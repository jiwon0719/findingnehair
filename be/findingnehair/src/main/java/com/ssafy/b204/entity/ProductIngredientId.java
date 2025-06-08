package com.ssafy.b204.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductIngredientId implements Serializable {

    @Column(name = "product_id")
    private int productId;

    @Column(name = "ingredient_id")
    private int ingredientId;
}
