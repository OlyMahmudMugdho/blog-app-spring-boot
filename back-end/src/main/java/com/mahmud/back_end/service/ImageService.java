package com.mahmud.back_end.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        String publicId = "blog/" + UUID.randomUUID().toString();
        
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), Map.of(
            "public_id", publicId,
            "resource_type", "auto"
        ));
        
        return result.get("secure_url").toString();
    }
} 