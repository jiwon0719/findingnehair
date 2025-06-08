package com.ssafy.b204.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class DiagnosisDto {
    private int microKeratin;
    private int excessSebum;
    private int follicularErythema;
    private int follicularInflammationPustules;
    private int dandRuff;
    private int hairLoss;
}
