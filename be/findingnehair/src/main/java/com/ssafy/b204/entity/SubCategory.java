package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Comment;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sub_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_id")
    @Comment("서브 카테고리 ID")
    private int subCategoryId;

    @Column(name = "sub_name")
    @Comment("서브 카테고리 이름")
    private String subCategoryName;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private MainCategory mainCategory;

    @OneToMany(mappedBy = "subCategory")
    private List<Product> products = new ArrayList<>();

    public SubCategory(String subCategoryName) {
        this.subCategoryName = subCategoryName;
    }
}
