package com.ssafy.b204.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {

    private int productId;
    private String productName;
    private String productLink;
    private String productDescription;
    private int productPrice;
    private String productImage;
    private SubCategoryDto subCategory;
    private List<FeatureDto> features;

}
