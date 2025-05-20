package project.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;
import java.io.File;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedMethods("*")
            .allowedOrigins("http://localhost:3000")
            .allowCredentials(true)
            .maxAge(3600L);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Create uploads directory if it doesn't exist
        try {
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
                System.out.println("Created uploads directory at: " + uploadDir.getAbsolutePath());
            }
            
            String uploadPath = Paths.get("uploads").toAbsolutePath().toString();
            System.out.println("Uploads directory path: " + uploadPath);
            
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadPath + "/")
                    .setCachePeriod(0); // Disable caching
                    
            System.out.println("Resource handler configured for uploads directory");
        } catch (Exception e) {
            System.err.println("Error configuring resource handler: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
