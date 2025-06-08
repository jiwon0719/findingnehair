package com.ssafy.b204.config;

import com.ssafy.b204.product.controller.ProductController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class ConditionalDataLoader implements ApplicationRunner {

    private final ProductController productController;

    @Value("${app.load-data:false}")
    private boolean shouldLoadData;

    @Autowired
    public ConditionalDataLoader(ProductController productController) {
        this.productController = productController;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (shouldLoadData) {
            ClassPathResource resource = new ClassPathResource("all_products.csv");
            String csvFilePath = resource.getFile().getAbsolutePath();
            int count = productController.importProductFromCsv(csvFilePath);
            System.out.println("CSV 파일에서 " + count + "개의 제품을 가져왔습니다.");
        } else {
            System.out.println("데이터 로드를 건너뜁니다. 필요하다면 application.properties에서 app.load-data=true로 설정하세요.");
        }
    }
}