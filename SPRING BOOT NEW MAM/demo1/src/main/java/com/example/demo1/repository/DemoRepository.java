package com.example.demo1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo1.model.DemoModel;

/* JpaRepository is used for running the queries in run time */
@Repository
public interface DemoRepository extends JpaRepository<DemoModel,Integer> {
    
}
