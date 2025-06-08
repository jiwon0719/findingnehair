package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "main_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MainCategory {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "category_id")
    @Comment("메인 카테고리 ID")
    private int categoryId;

    @Column(name = "category_name")
    @Comment("메인 카테고리 이름")
    private String categoryName;

    @OneToMany(mappedBy = "mainCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubCategory> subCategories = new ArrayList<>();

    public MainCategory(String categoryName) {
        this.categoryName = categoryName;
    }


    // 연관관계 편의 메서드
    public void addSubCategory(SubCategory subCategory) {
        this.subCategories.add(subCategory);
        subCategory.setMainCategory(this);
    }
}
