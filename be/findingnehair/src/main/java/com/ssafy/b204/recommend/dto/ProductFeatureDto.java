package com.ssafy.b204.recommend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductFeatureDto {

    private Long productId;           // 제품 ID
    private String productName;       // 제품 이름
    private List<String> features;    // 성분명 목록
    private int cluster;              // 클러스터링 결과 (초기에는 0, 이후 설정)
}
