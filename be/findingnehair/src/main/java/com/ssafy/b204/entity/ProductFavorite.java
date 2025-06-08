package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;

@Entity
@Table(name = "product_favorite")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductFavorite {

    @EmbeddedId
    private ProductFavoriteId id;

    @MapsId("productId")
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserInfo userInfo;
}
