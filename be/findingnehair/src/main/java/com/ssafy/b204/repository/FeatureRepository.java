package com.ssafy.b204.repository;

import com.ssafy.b204.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Integer> {
    Optional<Feature> findByfeatureName(String name);
}
