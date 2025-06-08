package com.ssafy.b204.product.controller;

import com.opencsv.exceptions.CsvValidationException;
import com.ssafy.b204.product.dto.DiagnosisDto;
import com.ssafy.b204.product.dto.ProductDto;
import com.ssafy.b204.product.service.CsvImportService;
import com.ssafy.b204.product.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final CsvImportService csvImportService;
    private final ProductService productService;

    /**
     * CSV 파일에서 상품 데이터를 읽어 데이터베이스에 저장
     *
     */
    public int importProductFromCsv(String csvFilePath) {
        try {
            Path path = Paths.get(csvFilePath);
            return csvImportService.importProductFromCsv(path);
        } catch(IOException | CsvValidationException e) {
            e.printStackTrace();
            return 0;
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductDto>> getProductsByPage(
            @RequestParam(name = "mainCategory", required = false) String mainCategory,
            @RequestParam(name = "subCategory", required = false) String subCategory,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "20") int limit) {
        return ResponseEntity.ok(productService.getProductByPage(mainCategory, subCategory, page, limit));
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<ProductDto>> recommendProductList(HttpServletRequest request,
                                                                 @RequestBody DiagnosisDto diagnosisDto) {
        String userId = (String) request.getAttribute("kakaoId");
        return ResponseEntity.ok(productService.recommendProductList(userId, diagnosisDto));
    }

}
