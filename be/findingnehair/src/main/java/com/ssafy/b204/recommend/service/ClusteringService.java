package com.ssafy.b204.recommend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.b204.entity.Product;
import com.ssafy.b204.product.dto.DiagnosisDto;
import com.ssafy.b204.recommend.dto.ProductFeatureDto;
import com.ssafy.b204.recommend.model.ClusteringModel;
import com.ssafy.b204.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClusteringService {

    private final ClusteringModel clusteringModel;
    private final ProductRepository productRepository;

    private int featureCount;
    private Map<String, Integer> featureIndexMap = new LinkedHashMap<>();

    private Map<Integer, List<Product>> clusteredProductMap = new HashMap<>();

    /**
     * 서버 시작 시 클러스터링 초기화 (1회 실행)
     */
    @PostConstruct
    public void initClustering() throws IOException {
        log.info("clustering start");

        // 1. JSON에서 feature set 로딩 및 인덱스 매핑
        Set<String> featureSet = loadFeaturesFromJson();
        int idx = 0;
        for (String feature : featureSet) {
            featureIndexMap.put(feature, idx++);
        }
        this.featureCount = featureIndexMap.size();

        // 2. DB에서 제품 정보 불러오기
        List<Product> products = productRepository.findAllWithFeaturesAndCategories();
        List<ProductFeatureDto> productDtos = new ArrayList<>();

        for (Product product : products) {
            List<String> featureNames = product.getProductFeatures().stream()
                    .map(pf -> pf.getFeature().getFeatureName())
                    .collect(Collectors.toList());

            ProductFeatureDto dto = new ProductFeatureDto(
                    (long) product.getProductId(),
                    product.getProductName(),
                    featureNames,
                    0
            );
            productDtos.add(dto);
        }

        // 3. 벡터화 및 0벡터 제거
        List<Product> filteredProducts = new ArrayList<>();
        List<ProductFeatureDto> filteredDtos = new ArrayList<>();
        List<double[]> filteredVectors = new ArrayList<>();

        for (int i = 0; i < productDtos.size(); i++) {
            double[] vector = toVector(productDtos.get(i).getFeatures());
            boolean isAllZero = Arrays.stream(vector).allMatch(v -> v == 0.0);
            if (!isAllZero) {
                filteredProducts.add(products.get(i));
                filteredDtos.add(productDtos.get(i));
                filteredVectors.add(vector);
            }
        }

        // 4. 클러스터링
        int k = 6;
        clusteringModel.train(filteredVectors.toArray(new double[0][]), k);

        // 5. 결과 적용
        int[] labels = clusteringModel.getClusterLabels();

        Map<Integer, Integer> countMap = new HashMap<>();
        for (int label : labels) {
            countMap.put(label, countMap.getOrDefault(label, 0) + 1);
        }

        for (int i = 0; i < filteredDtos.size(); i++) {
            filteredDtos.get(i).setCluster(labels[i]);
        }

        // 6. 클러스터별 제품 저장
        for (int i = 0; i < labels.length; i++) {
            int cluster = labels[i];
            Product product = filteredProducts.get(i);
            clusteredProductMap.computeIfAbsent(cluster, j -> new ArrayList<>()).add(product);
        }

        log.info("clustering finish");
    }

    /**
     * JSON 파일에서 성분 목록 로딩
     */
    private Set<String> loadFeaturesFromJson() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(new ClassPathResource("feature_clusturing_data.json").getInputStream());

        Set<String> features = new LinkedHashSet<>();
        for (JsonNode array : root) {
            array.forEach(node -> features.add(node.asText()));
        }
        return features;
    }

    /**
     * 제품 성분 리스트 → 벡터 변환 (정규화 제거)
     */
    public double[] toVector(List<String> features) {
        double[] vector = new double[featureCount];
        for (String f : features) {
            Integer idx = featureIndexMap.get(f);
            if (idx != null) {
                vector[idx] += 1.0;
            }
        }
        return vector; // ✅ 정규화 제거
    }

    /**
     * 사용자 feature → 벡터 변환 (정규화 제거)
     */
    public double[] vectorize(Map<String, Double> weightedFeatures) {
        double[] vector = new double[featureCount];
        for (Map.Entry<String, Double> entry : weightedFeatures.entrySet()) {
            Integer idx = featureIndexMap.get(entry.getKey());
            if (idx != null) {
                vector[idx] = entry.getValue();
            }
        }
        return vector; // ✅ 정규화 제거
    }

    /**
     * 사용자 벡터 → 클러스터 예측
     */
    public int predictCluster(double[] userVector) {
        return clusteringModel.predict(userVector);
    }

    /**
     * 클러스터에 속한 제품 조회
     */
    public List<Product> getClusteredProducts(int clusterLabel) {
        return clusteredProductMap.getOrDefault(clusterLabel, Collections.emptyList());
    }

    /**
     * 두피 진단 → 가중치 feature 맵 변환
     */
    public Map<String, Double> addFeatures(DiagnosisDto dto) {
        Map<String, Double> weightedFeatures = new HashMap<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(new ClassPathResource("feature_clusturing_data.json").getInputStream());

            Map<String, Integer> scoreMap = Map.of(
                    "micro_keratin", dto.getMicroKeratin(),
                    "excess_sebum", dto.getExcessSebum(),
                    "follicular_erythema", dto.getFollicularErythema(),
                    "follicular_inflammation_pustules", dto.getFollicularInflammationPustules(),
                    "dandruff", dto.getDandRuff(),
                    "hair_loss", dto.getHairLoss()
            );

            for (Map.Entry<String, Integer> entry : scoreMap.entrySet()) {
                String key = entry.getKey();
                int score = entry.getValue();

                JsonNode featureArray = root.get(key);
                if (featureArray != null && score > 0) {
                    for (JsonNode node : featureArray) {
                        String featureName = node.asText();
                        weightedFeatures.put(featureName, weightedFeatures.getOrDefault(featureName, 0.0) + score);
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("성분 JSON 읽기 실패", e);
        }

        return weightedFeatures;
    }

}
