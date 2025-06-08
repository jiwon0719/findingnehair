from fastapi import FastAPI, File, UploadFile, HTTPException
from io import BytesIO
from PIL import Image
import torch
from torchvision import transforms
import torch.nn.functional as F
import os
from recommendation import recommend_similar_products
from db import get_db_connection

app = FastAPI()

# -----------------------------
# 1) 모델 로드
# -----------------------------

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(CURRENT_DIR, "test_scalp_weights")
model_names = ['micro_keratin', 'excess_sebum', 'follicular_erythema', 'follicular_inflammation_pustules', 'dandruff', 'hair_loss']
NUM_CLASSES_PER_MODEL = 4
models = {}

# 메인 진단 모델 로드
for m in model_names:
    model_path = os.path.join(MODEL_DIR, f'nehair_{m}.pt')
    if os.path.exists(model_path):
        model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
        model.eval()
        models[m] = model
        print(f"[INFO] '{m}' 모델 로드 완료!")
    else:
        print(f"[WARNING] {model_path} not found. '{m}' 모델은 로드되지 않았습니다.")

# ✅ 두피 여부 판별 모델 로드
scalp_verifier_path = os.path.join(MODEL_DIR, 'nehair_scalp_verifier.pt')
if os.path.exists(scalp_verifier_path):
    scalp_verifier = torch.load(scalp_verifier_path, map_location='cpu', weights_only=False)
    scalp_verifier.eval()
    print("[INFO] 두피 여부 판별 모델 로드 완료.")
else:
    scalp_verifier = None
    print("[WARNING] 두피 여부 판별 모델이 없습니다.")

# -----------------------------
# 2) 전처리 함수
# -----------------------------

def transform_image(image: Image.Image):
    transformation = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225]),
    ])
    return transformation(image).unsqueeze(0)

# ✅ 두피 이미지 여부 확인 함수
def is_scalp_image(tensor_img: torch.Tensor) -> bool:
    if scalp_verifier is None:
        print("[WARN] 두피 판별 모델 없음 - 자동 통과")
        return True  # 모델이 없으면 통과

    with torch.no_grad():
        output = scalp_verifier(tensor_img)
        probs = F.softmax(output, dim=1)
        _, pred = torch.max(probs, dim=1)
        return pred.item() == 0  # 0: scalp, 1: non_scalp

# -----------------------------
# 3) 진단 결과 해석
# -----------------------------

severity_text_map = {
    0: "양호",
    1: "경증",
    2: "중등도",
    3: "중증"
}

priority_order = ['follicular_inflammation_pustules', 'excess_sebum', 'follicular_erythema', 'hair_loss', 'dandruff', 'micro_keratin']

def get_final_diagnosis(diagnosis_result: dict) -> str:
    max_severity = max(diagnosis_result.values())
    if max_severity == 0:
        return "정상"

    candidates = [name for name, val in diagnosis_result.items() if val == max_severity]
    sorted_candidates = sorted(candidates, key=lambda x: priority_order.index(x) if x in priority_order else 999)
    main_symptom = sorted_candidates[0]
    severity_text = severity_text_map[max_severity]
    return f"{main_symptom} {severity_text}"

# -----------------------------
# 4) 엔드포인트
# -----------------------------

@app.get("/")
async def read_root():
    return {"message": "니모를 찾으러 떠나볼까요?"}

@app.post("/diagnosis")
async def diagnosis(image: UploadFile = File(...)):
    """
    두피 이미지 1장을 업로드하세요 :)
    """
    if len(models) == 0:
        raise HTTPException(status_code=500, detail="모델이 로드되지 않았습니다.")

    try:
        image_data = await image.read()
        pil_image = Image.open(BytesIO(image_data)).convert('RGB')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 파일을 열 수 없습니다: {e}")

    input_tensor = transform_image(pil_image)

    # ✅ 1단계: 두피 이미지인지 확인
    if not is_scalp_image(input_tensor):
        raise HTTPException(status_code=400, detail="두피 이미지를 업로드 해주세요.")

    # ✅ 2단계: 진단 수행
    diagnosis_results = {}
    for m in model_names:
        if m not in models:
            diagnosis_results[m] = None
            continue
        
        model = models[m]
        with torch.no_grad():
            output = model(input_tensor)
            if output.shape[1] != NUM_CLASSES_PER_MODEL:
                raise HTTPException(
                    status_code=500,
                    detail=f"모델 '{m}'의 출력 크기가 {output.shape[1]}입니다. {NUM_CLASSES_PER_MODEL} 이어야 합니다."
                )
            probabilities = F.softmax(output, dim=1)
            _, predicted_idx = torch.max(probabilities, dim=1)
            diagnosis_results[m] = predicted_idx.item()

    all_zero = all(value == 0 for value in diagnosis_results.values() if value is not None)
    overall_result = "정상입니다." if all_zero else "아래와 같은 상태가 감지되었습니다."
    final_diagnosis = get_final_diagnosis(diagnosis_results)

    return {
        "result": overall_result,
        "diagnosis": diagnosis_results,
        "final_diagnosis": final_diagnosis
    }


@app.get("/recommend/{user_id}")
async def recommend_products(user_id: str):
    try:
        recommended_products = recommend_similar_products(user_id)
        return {"recommended_products": recommended_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DB 연결 테스트 (애플리케이션 시작 시 DB 연결이 제대로 되는지 확인)
@app.on_event("startup")
async def startup_event():
    try:
        conn = get_db_connection()
        print("[INFO] DB 연결 성공")
        conn.close()
    except Exception as e:
        print(f"[ERROR] DB 연결 실패: {e}")

