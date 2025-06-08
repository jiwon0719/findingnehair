FROM python:3.10-slim

WORKDIR /app

# pip, setuptools, wheel 설치
RUN pip install --upgrade pip setuptools wheel \
  && pip install torch==2.6.0+cu118 torchvision==0.21.0+cu118 torchaudio==2.6.0+cu118 \
     --index-url https://download.pytorch.org/whl/cu118 \
     --trusted-host download.pytorch.org

# requirements.txt 복사 및 설치
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI 앱 및 모델 복사
COPY ./app/ ./app/
COPY ./test_scalp_weights/ ./app/test_scalp_weights/

WORKDIR /app/app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
