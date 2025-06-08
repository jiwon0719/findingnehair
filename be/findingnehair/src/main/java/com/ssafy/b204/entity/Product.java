package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.util.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    @Comment("제품 ID")
    private int productId;

    @Column(name = "product_name", length = 100)
    @Comment("제품명")
    private String productName;

    @Column(name = "product_link")
    @Comment("제품 링크")
    private String productLink;

    @Column(name = "product_description")
    @Comment("제품 설명")
    private String productDescription;

    @Column(name = "product_price")
    @Comment("제품 가격")
    private int productPrice;

    @Column(name = "product_image")
    @Comment("제품 이미지")
    private String productImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_id")
    private SubCategory subCategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductFeature> productFeatures = new ArrayList<>();

    // 연관관계 편의 메서드
    public void addFeature(Feature feature) {
        ProductFeature productFeature = new ProductFeature(this, feature);
        this.productFeatures.add(productFeature);
    }
}
