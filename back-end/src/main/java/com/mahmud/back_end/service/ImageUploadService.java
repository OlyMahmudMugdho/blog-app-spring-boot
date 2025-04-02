package com.mahmud.back_end.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageUploadService {
    public String uploadImage(MultipartFile file);
}
