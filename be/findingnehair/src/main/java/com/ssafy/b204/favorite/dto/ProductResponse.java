package com.ssafy.b204.favorite.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private int productId;
    private String productName;
    private String productLink;
    private String productDescription;
    private int productPrice;
    private String productImage;
}
