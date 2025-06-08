package com.ssafy.b204.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryDto {
    private int subCategoryId;
    private String subCategoryName;
    private MainCategoryDto mainCategory;
}
