package com.example.demo1.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.demo1.Exception.IdNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {
@ExceptionHandler(IdNotFoundException.class)
public ResponseEntity<String> handlenotfound(IdNotFoundException ex){
    return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_FOUND);
}
   
}
