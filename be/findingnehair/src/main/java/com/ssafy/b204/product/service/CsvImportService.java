package com.ssafy.b204.product.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.ssafy.b204.entity.*;
import com.ssafy.b204.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsvImportService {

    private final ProductRepository productRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final FeatureRepository featureRepository;
    private final ProductFeatureRepository productFeatureRepository;

    /**
     * CSV 파일에서 제품 데이터를 읽어 데이터베이스에 저장
     */
    @Transactional
    public int importProductFromCsv(Path csvFilePath) throws IOException, CsvValidationException {
        int importCnt = 0;

        try (CSVReader csvReader = new CSVReader(new FileReader(csvFilePath.toFile()))){
            // 헤더 읽기
            String[] header = csvReader.readNext();

            // 행 처리
            String[] line;
            while((line = csvReader.readNext()) != null) {
                try {
                    processProductLine(line);
                    importCnt++;
                } catch (Exception e) {
                    // 한 행 오류나도 다른 행은 계속 처리
                    log.warn("Error processing line: " + Arrays.toString(line));
                    e.printStackTrace();
                }
            }
        }
        return importCnt;
    }

    /**
     * CSV 파일의 한 행씩 처리해서 데이터베이스에 저장
     *
     */
    @Transactional
    private Product processProductLine(String[] line) {
        // 0:name, 1:link, 2:description, 3:price, 4:image, 5:features, 6:main_category, 7:sub_category

        // MainCategory 처리
        String mainCategoryName = line[6].trim();
        MainCategory mainCategory = getOrCreateMainCategory(mainCategoryName);

        // SunCategory 처리
        String subCategoryName = line[7].trim();
        SubCategory subCategory = getOrCreateSubCategory(subCategoryName, mainCategory);

        // Product 처리
        Product product = new Product();
        product.setProductName(line[0].trim());
        product.setProductLink(line[1].trim());
        product.setProductDescription(line[2].trim());
        product.setProductPrice(Integer.parseInt(line[3].trim()));
        product.setProductImage(line[4].trim());
        product.setSubCategory(subCategory);

        product = productRepository.save(product); // ID 생성을 위해 한 번 저장

        // Feature 처리
        String featureString = line[5].trim();
        processFeaturesForProduct(featureString, product);

        return product;
    }

    /**
     * 특징들을 제품과 연결
     *
     */
    private void processFeaturesForProduct(String featureString, Product product) {
        if(featureString == null || featureString.isEmpty()) {
            return;
        }

        featureString = featureString.replace("[", "").replace("]", "").replace("'", "");
        String[] features = featureString.split(",");

        for(String feature : features) {
            String featureName = feature.trim();
            if(!featureName.isEmpty()) {
                Feature feature1 = getOrCreateFeature(featureName);

                ProductFeature productFeature = new ProductFeature(product, feature1);
                productFeatureRepository.save(productFeature);
            }
        }
    }

    /**
     * 특징 이름으로 특징을 찾거나 새로 생성
     *
     */
    private Feature getOrCreateFeature(String featureName) {
        Optional<Feature> feature = featureRepository.findByfeatureName(featureName);

        if(feature.isPresent()) {
            return feature.get();
        } else {
            Feature newFeature = new Feature(featureName);

            return featureRepository.save(newFeature);
        }
    }

    /**
     * 서브 카테고리 이름과 메인 카테고리로 서브 카테고리를 찾거나 새로 생성
     *
     */
    @Transactional
    private SubCategory getOrCreateSubCategory(String subCategoryName, MainCategory mainCategory) {
        Optional<SubCategory> subCategory = subCategoryRepository.findBySubCategoryNameAndMainCategory(subCategoryName, mainCategory);

        if(subCategory.isPresent()) {
            return subCategory.get();
        } else {
            SubCategory newSubCategory = new SubCategory(subCategoryName);
            newSubCategory.setMainCategory(mainCategory);

            return subCategoryRepository.save(newSubCategory);
        }
    }

    /**
     * 메인 카테고리 이름으로 카테고리를 찾거나 새로 생성
     *
     *
     */
    @Transactional
    private MainCategory getOrCreateMainCategory(String mainCategoryName) {
        Optional<MainCategory> mainCategory = mainCategoryRepository.findByCategoryName(mainCategoryName);

        if(mainCategory.isPresent()) {
            return mainCategory.get();
        } else {
            MainCategory newMainCategory = new MainCategory(mainCategoryName);

            return mainCategoryRepository.save(newMainCategory);
        }
    }
}
