package com.ssafy.b204.recommend.model;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ClusteringModel {
    private double[][] centroids;       // 클러스터 중심점 (K개)
    private int[] clusterLabels;        // 각 벡터가 속하는 클러스터 라벨

    /**
     * 클러스터링 학습 메서드
     * @param vectors 제품 벡터 배열
     * @param k 클러스터 개수
     */
    public void train(double[][] vectors, int k) {
        int n = vectors.length;
        int dim = vectors[0].length;
        clusterLabels = new int[n];

        centroids = kMeansPlusPlusInit(vectors, k);

        for (int iter = 0; iter < 10; iter++) {
            double[][] newCentroids = new double[k][dim];
            int[] counts = new int[k];

            for (int i = 0; i < n; i++) {
                int cluster = predict(vectors[i]);
                clusterLabels[i] = cluster;

                for (int j = 0; j < dim; j++) {
                    newCentroids[cluster][j] += vectors[i][j];
                }
                counts[cluster]++;
            }

            for (int i = 0; i < k; i++) {
                if (counts[i] == 0) continue;
                for (int j = 0; j < dim; j++) {
                    newCentroids[i][j] /= counts[i];
                }
            }

            centroids = newCentroids;
        }
    }

    /**
     * 코사인 유사도를 기반으로 클러스터 예측
     */
    public int predict(double[] userVector) {
        userVector = normalize(userVector); // ✅ 정규화 적용
        int bestCluster = 0;
        double minDist = cosineDistance(userVector, centroids[0]);
        for (int i = 1; i < centroids.length; i++) {
            double dist = cosineDistance(userVector, centroids[i]);
            if (dist < minDist) {
                minDist = dist;
                bestCluster = i;
            }
        }
        return bestCluster;
    }


    /**
     * 코사인 거리 계산
     */
    private double cosineDistance(double[] a, double[] b) {
        double dot = 0.0, normA = 0.0, normB = 0.0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA == 0 || normB == 0) return 1.0; // 0벡터 예외 처리
        return 1 - (dot / (Math.sqrt(normA) * Math.sqrt(normB)));
    }

    /**
     * 클러스터 중심점 반환
     */
    public double[][] getCentroids() {
        return centroids;
    }

    /**
     * 학습된 클러스터 레이블 반환
     */
    public int[] getClusterLabels() {
        return clusterLabels;
    }

    /**
     * KMeans++ 초기화
     * @param vectors
     * @param k
     * @return
     */
    private double[][] kMeansPlusPlusInit(double[][] vectors, int k) {
        Random rand = new Random();
        int n = vectors.length;
        int dim = vectors[0].length;
        double[][] centroids = new double[k][dim];

        List<double[]> centroidList = new ArrayList<>();

        // 첫 중심점 무작위 선택
        centroidList.add(vectors[rand.nextInt(n)]);

        for (int i = 1; i < k; i++) {
            double maxDist = -1;
            double[] nextCentroid = null;

            for (double[] vector : vectors) {
                double minDist = Double.MAX_VALUE;

                for (double[] centroid : centroidList) {
                    double dist = cosineDistance(vector, centroid);
                    minDist = Math.min(minDist, dist);
                }

                if (minDist > maxDist) {
                    maxDist = minDist;
                    nextCentroid = vector;
                }
            }

            centroidList.add(nextCentroid.clone());
        }

        for (int i = 0; i < k; i++) {
            centroids[i] = centroidList.get(i);
        }

        return centroids;
    }

    public double[] normalize(double[] vector) {
        double norm = 0.0;
        for (double v : vector) {
            norm += v * v;
        }
        norm = Math.sqrt(norm);

        if (norm == 0.0) return vector.clone(); // 0 벡터 예외처리

        double[] normalized = new double[vector.length];
        for (int i = 0; i < vector.length; i++) {
            normalized[i] = vector[i] / norm;
        }
        return normalized;
    }
}
