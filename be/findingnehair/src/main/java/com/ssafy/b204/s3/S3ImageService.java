package com.ssafy.b204.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;


import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Component
public class S3ImageService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    /**
     * 호출하는 upload 함수
     * @param image
     * @param userId
     * @return
     */
    public String upload(MultipartFile image, String userId) {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new IllegalArgumentException("파일이 비어있거나 이름이 없습니다.");
        }
        return this.uploadImage(image, userId);
    }

    /**
     * 이미지 업로드
     * @param image
     * @param userId
     * @return
     */
    private String uploadImage(MultipartFile image, String userId) {
        this.validateImageFileExtention(image.getOriginalFilename());
        return this.uploadImageToS3(image, userId);
    }

    /**
     * 파일 확장자 검사
     * @param filename
     */
    private void validateImageFileExtention(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new IllegalArgumentException("파일 확장자가 없습니다.");
        }

        String extension = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtentionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        if (!allowedExtentionList.contains(extension)) {
            throw new IllegalArgumentException("허용되지 않는 확장자입니다.");
        }
    }

    /**
     * s3 업로드
     * @param image
     * @param userId
     * @return
     */
    private String uploadImageToS3(MultipartFile image, String userId) {
        try {
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uuidFileName = UUID.randomUUID().toString().substring(0, 10) + extension;
            String s3FileName = userId + "/" + uuidFileName;

            InputStream is = image.getInputStream();
            byte[] bytes = IOUtils.toByteArray(is);

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/" + extension.replace(".", ""));
            metadata.setContentLength(bytes.length);

            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata);

            amazonS3.putObject(putObjectRequest);

            byteArrayInputStream.close();
            is.close();

            return amazonS3.getUrl(bucketName, s3FileName).toString();

        } catch (Exception e) {
            // 그냥 RuntimeException 그대로 터뜨리기
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    /**
     * s3에서 이미지 삭제
     * @param imageAddress
     */
    public void deleteImageFromS3(String imageAddress) {
        String key = getKeyFromImageAddress(imageAddress);
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, key));
    }

    private String getKeyFromImageAddress(String imageAddress) {
        try {
            URL url = new URL(imageAddress);
            String decodingKey = URLDecoder.decode(url.getPath(), "UTF-8");
            return decodingKey.substring(1); // 맨 앞 '/' 제거
        } catch (Exception e) {
            throw new RuntimeException("이미지 주소 파싱 실패", e);
        }
    }

    /**
     * Presigned URL 생성 (GET 방식, 5분 유효)
     * @param userId 사용자 ID (파일 경로 포함용)
     * @param fileName 업로드된 파일 이름 (예: abc.jpg)
     * @return presigned URL 문자열
     */
    public String generatePresignedUrl(String userId, String fileName) {
        try {
            String s3Key = userId + "/" + fileName;

            // 유효 시간: 현재 시간 + 5분
            Date expiration = new Date();
            long expTimeMillis = expiration.getTime();
            expTimeMillis += 1000 * 60 * 30; // 5분-
            expiration.setTime(expTimeMillis);

            // Presigned URL 요청 생성
            GeneratePresignedUrlRequest generatePresignedUrlRequest =
                    new GeneratePresignedUrlRequest(bucketName, s3Key)
                            .withMethod(HttpMethod.GET)
                            .withExpiration(expiration);

            // URL 생성
            URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
            return url.toString();

        } catch (Exception e) {
            throw new RuntimeException("Presigned URL 생성 실패", e);
        }
    }
}
