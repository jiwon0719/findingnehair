# db.py
import psycopg2
import numpy as np
from psycopg2.extras import RealDictCursor

# PostgreSQL 연결
def get_db_connection():
    conn = psycopg2.connect(
        dbname="postgres_db",
        user="root",
        password="ttt00000",
        host="postgres",
        port="5432"
    )
    
    return conn

def get_user_scalp_data(user_id: str):
    """ 사용자의 두피 관련 데이터를 가져오는 함수 """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT shampoo_usage_frequency, perm_frequency, gender, age_group
        FROM user_scalp
        WHERE user_id = %s
    """, (user_id,))
    
    user_scalp = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user_scalp:
        return user_scalp
    else:
        raise Exception(f"User {user_id} not found in user_scalp table")

def get_product_data(product_id: int):
    """ 제품의 이름과 설명을 가져오는 함수 """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT product_name, product_description
        FROM products
        WHERE product_id = %s
    """, (product_id,))
    
    product = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if product:
        return product
    else:
        raise Exception(f"Product {product_id} not found in products table")

def get_product_vector(product_id: int):
    """ 제품의 벡터 데이터를 가져오는 함수 (pgvector 사용) """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT product_vector
        FROM products
        WHERE product_id = %s
    """, (product_id,))
    
    product_vector = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if product_vector:
        return np.array(product_vector["product_vector"])  # 벡터를 반환
    else:
        raise Exception(f"Product vector not found for product ID {product_id}")


def get_all_product_ids():
    """ 모든 제품 ID를 가져오는 함수 """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT product_id FROM products")
    products = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return [product["product_id"] for product in products]


def get_user_favorites(user_id: str):
    """ 사용자가 좋아요를 눌렀던 제품들의 ID를 가져오는 함수 """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT product_id
        FROM product_favorite
        WHERE user_id = %s
    """, (user_id,))
    
    favorites = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [favorite['product_id'] for favorite in favorites]
