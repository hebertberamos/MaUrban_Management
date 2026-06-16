package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByQuantEstoqueLessThan(int quantidade);
}
