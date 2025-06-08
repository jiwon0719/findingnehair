package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.util.*;

@Entity
@Table(name = "features")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feature_id")
    @Comment("특징 ID")
    private int featureId;

    @Column(name = "feature_name")
    @Comment("특징 이름")
    private String featureName;

    @OneToMany(mappedBy = "feature")
    private List<ProductFeature> productFeatures = new ArrayList<>();

    public Feature(String featureName) {
        this.featureName = featureName;
    }
}
