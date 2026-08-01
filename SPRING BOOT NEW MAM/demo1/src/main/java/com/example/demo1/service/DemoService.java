package com.example.demo1.service;

import java.util.List;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo1.Exception.IdNotFoundException;
import com.example.demo1.model.DemoModel;
import com.example.demo1.repository.DemoRepository;

@Service
public class DemoService {
    @Autowired
    DemoRepository repo;
    public DemoModel add(DemoModel table){
        return repo.save(table);
    }
    public List<DemoModel> getAll(){
        return repo.findAll();
    }
    public DemoModel getById(int id) {
        return repo.findById(id).orElseThrow(()->new IdNotFoundException("Id Not Found "+id));
    }
    public String delete(int id){
        if(!repo.existsById(id)){
            throw new IdNotFoundException("Id not Found "+id);
        }
        repo.deleteById(id);
        return "Records Deleted Successfully";
    }

    public void deleteAll() {
        repo.deleteAll();
    }
    public DemoModel update(int id,DemoModel table){
        Optional<DemoModel>exist=repo.findById(id);
        if(exist.isPresent()){
            DemoModel Dm=exist.get();
            Dm.setName(table.getName());
            return repo.save(Dm);
        }
        return null;
    }
}
