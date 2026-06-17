package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ProdutoRequestDTO;
import com.managemente.MaUrban.dtos.ProdutoResponseDTO;
import com.managemente.MaUrban.entities.Produto;
import com.managemente.MaUrban.repositories.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setPrecoAtual(dto.precoAtual());
        produto.setQuantEstoque(dto.quantEstoque());

        produto = produtoRepository.save(produto);
        return mapToDTO(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Método interno usado por outros serviços (não exposto diretamente na API)
    @Transactional
    public Produto reduzirEstoque(UUID id, int quantidadeComprada) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (produto.getQuantEstoque() < quantidadeComprada) {
            throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
        }

        produto.setQuantEstoque(produto.getQuantEstoque() - quantidadeComprada);
        return produtoRepository.save(produto);
    }

    @Transactional
    public Produto restaurarEstoque(UUID id, int quantidadeDevolvida) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produto.setQuantEstoque(produto.getQuantEstoque() + quantidadeDevolvida);
        return produtoRepository.save(produto);
    }

    private ProdutoResponseDTO mapToDTO(Produto p) {
        return new ProdutoResponseDTO(p.getId(), p.getNome(), p.getPrecoAtual(), p.getQuantEstoque());
    }
}
