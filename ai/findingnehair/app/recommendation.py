# recommendation.py
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from db import get_product_data, get_product_vector, get_user_scalp_data, get_all_product_ids

def recommend_similar_products(user_id, top_n=3):
    """
    사용자의 특성에 맞는 제품을 추천하는 함수.
    user_id와 DB에서 가져온 데이터를 기반으로 추천 시스템을 구현
    """

    # 사용자 특성 가져오기 (DB에서)
    user_scalp = get_user_scalp_data(user_id)
    
    if not user_scalp:
        return f"User {user_id} not found in user_scalp table"

    # 사용자 특성 벡터화 (예시로는 'gender', 'age_group'과 'shampoo_usage_frequency' 등을 벡터로 변환)
    # 실제로는 데이터를 숫자로 변환 후 벡터를 구성해야 합니다.
    # 예를 들어, 샴푸 사용 빈도와 성별 등을 벡터화:
    user_vector = np.array([
        user_scalp['shampoo_usage_frequency'] == 'Daily',  # 샴푸 사용 빈도 (예시로 boolean 변환)
        user_scalp['perm_frequency'] == 'Once a month',  # 펌 빈도
        user_scalp['gender'],  # 성별
        user_scalp['age_group']  # 나이 그룹
    ], dtype=float)

    # 모든 제품 벡터 가져오기 (DB에서)
    product_ids = get_all_product_ids()  # 모든 제품 ID 가져오기
    similarities = []

    # 각 제품에 대해 유사도 계산
    for product_id in product_ids:
        try:
            # 제품 정보 가져오기
            product_data = get_product_data(product_id)
            product_vector = get_product_vector(product_id)  # 벡터 데이터 가져오기

            # 유사도 계산 (사용자 벡터와 제품 벡터)
            similarity = cosine_similarity([user_vector], [product_vector])
            similarities.append((product_id, similarity[0][0], product_data['product_name']))

        except Exception as e:
            print(f"Error fetching data for product {product_id}: {str(e)}")
            continue
    
    # 유사도 기준으로 상위 N개 제품 추천
    similarities.sort(key=lambda x: x[1], reverse=True)
    recommended_product_ids = [item[0] for item in similarities[:top_n]]
    
    return recommended_product_ids


