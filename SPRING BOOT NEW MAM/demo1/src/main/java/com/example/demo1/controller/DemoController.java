package com.example.demo1.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo1.model.DemoModel;
import com.example.demo1.service.DemoService;

@RestController
public class DemoController {
    @Autowired
    DemoService service;
    @PostMapping("/create")
    public DemoModel create (@RequestBody DemoModel table){
        return service.add(table);
    }
    @GetMapping("/get")
    public List<DemoModel> getAll(){
        return service.getAll();
    }
    @GetMapping("/get/{id}")
    public DemoModel getById(@PathVariable int id) {
        return service.getById(id);
    }
    @DeleteMapping("/delete/{id}")
    public String deleteById(@PathVariable int id) {
        service.delete(id);
        return "Deleted id: " + id;
    }
    @DeleteMapping("/delete")
    public String deleteAll() {
        service.deleteAll();
        return "All records deleted";
    }
    @PutMapping("/update/{id}")
    public DemoModel update(@PathVariable int id, @RequestBody DemoModel updated) {
        return service.update(id, updated);
    }
    }