package com.example.demo.dto;

import lombok.Data;

@Data
public class OutputMessageDto extends MessageDto {

    private String time;

    public OutputMessageDto(String from, String text, String fileName, String time) {
        super(from, text, fileName);
        this.time = time;
    }
}
