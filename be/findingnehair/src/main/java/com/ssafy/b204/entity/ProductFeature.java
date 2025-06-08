package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_features")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_feature_id")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feature_id")
    private Feature feature;

    public ProductFeature(Product product, Feature feature) {
        this.product = product;
        this.feature = feature;
    }
}
