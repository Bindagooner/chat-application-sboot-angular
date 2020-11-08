package com.example.demo.service;

import com.example.demo.dto.MessageDto;
import com.example.demo.dto.OutputMessageDto;
import com.example.demo.model.Message;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public OutputMessageDto saveAndResponse(MessageDto messageDto) {
        Message message = Message.builder().data(messageDto.getText())
                .time(LocalDateTime.now())
                .user(messageDto.getFrom())
                .fileName(messageDto.getFileName())
                .build();
        messageRepository.save(message);
        return new OutputMessageDto(messageDto.getFrom(), messageDto.getText(),
                messageDto.getFileName(),
                message.getTime().format(DateTimeFormatter.ofPattern("HH:mm | dd/MM")));
    }
}
