package com.ssafy.b204.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoResponseDto {

    private String userId;
    private int shampooUsageFrequency;
    private int permFrequency;
    private int hairDyeFrequency;
    private int gender;
    private int ageGroup;
}
