package com.tcs.vidyutseva.repository;

import com.tcs.vidyutseva.entity.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsumerRepository extends JpaRepository<Consumer, Long> {
    Optional<Consumer> findByConsumerNumber(String consumerNumber);
    boolean existsByConsumerNumber(String consumerNumber);
    List<Consumer> findByNameContainingIgnoreCaseOrConsumerNumberContaining(String name, String number);
}
