package com.mahmud.back_end.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CloudinaryImageUploadService implements ImageUploadService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            String publicId = "blog/" + UUID.randomUUID().toString();

            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "public_id", publicId,
                    "resource_type", "auto"
            ));

            return result.get("secure_url").toString();
        } catch (Exception e) {
            System.out.println("Error while uploading image: ");
            return null;
        }
    }
}
