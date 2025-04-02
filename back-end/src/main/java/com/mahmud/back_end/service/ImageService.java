package com.mahmud.back_end.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageService {

    private final ImageUploadService imageUploadService;

    public ImageService(AwsImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        return imageUploadService.uploadImage(file);
    }
} 