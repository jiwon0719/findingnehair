package com.ssafy.b204.global.api;

import com.ssafy.b204.mypage.dto.UserScalpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ApiClient {

    private final RestTemplate restTemplate;

    @Value("${fastapi.url}")
    private String fastApiUrl;

    public Map<String , Object> sendImage(MultipartFile multipartFile) {
        File tempFile = null;
        try {
            tempFile = convertMultipartFileToFile(multipartFile);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new FileSystemResource(tempFile));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    fastApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<>() {}
            );

            return response.getBody();

        } catch (HttpClientErrorException e) {
            // 400 에러 처리
            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                String responseBody = e.getResponseBodyAsString();
                if (responseBody.contains("두피 이미지를 업로드 해주세요.")) {
                    System.out.println("[INFO] 두피 이미지가 아닌 것으로 판단되어 null 반환");
                    return null;
                }
            }
            throw new RuntimeException("FastAPI 요청 실패: " + e.getMessage(), e);

        } catch (IOException e) {
            throw new RuntimeException("FastAPI 전송 실패", e);

        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }


    private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        File convFile = File.createTempFile("upload_", multipartFile.getOriginalFilename());
        multipartFile.transferTo(convFile);
        return convFile;
    }

    private UserScalpDto changeMapToDto(Map<String , Object> map){
        UserScalpDto userScalpDto = new UserScalpDto();

        userScalpDto.setMicroKeratin((Integer) map.get("micro_keratin"));
        userScalpDto.setExcessSebum((Integer) map.get("excess_sebum"));
        userScalpDto.setFollicularErythema((Integer) map.get("follicular_erythema"));
        userScalpDto.setFollicularInflammationPustules((Integer) map.get("follicular_inflammation_pustules"));
        userScalpDto.setDandruff((Integer) map.get("dandruff"));
        userScalpDto.setHairLoss((Integer) map.get("hair_loss"));
        return userScalpDto;
    }
}
