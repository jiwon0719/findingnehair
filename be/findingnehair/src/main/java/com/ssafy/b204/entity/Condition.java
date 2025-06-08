package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "condition")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Condition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition_id")
    private int conditionId;

    @Column(name = "condition_name", length = 20)
    private String conditionName;
}
