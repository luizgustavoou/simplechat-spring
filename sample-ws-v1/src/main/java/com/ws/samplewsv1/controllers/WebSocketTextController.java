package com.ws.samplewsv1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ws.samplewsv1.dtos.TextMessageDto;

@RestController
public class WebSocketTextController {

    @Autowired
    SimpMessagingTemplate template;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody TextMessageDto textMessageDTO) {
        template.convertAndSend("/topic/message", textMessageDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @MessageMapping("/sendMessage")
    public void receiveMessage(@Payload TextMessageDto textMessageDTO) {
        System.out.println(textMessageDTO.getMessage());

        template.convertAndSend("/topic/message", textMessageDTO);

        // receive message from client
    }

    @SendTo("/topic/message")
    public TextMessageDto broadcastMessage(@Payload TextMessageDto textMessageDTO) {
        return textMessageDTO;
    }
}
