import { AuthJWT } from "../middlewares/AuthJWT";
import PermissaoModel from "../models/PermissaoModel";
import { Router } from "express";

const permissaoController = Router();

// Cadastro
permissaoController.post("/permissoes", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const { descricao } = req.body;
        if (!descricao) {
            res.status(400).json({ message: "Informar descrição" });
            return;
        }

        const permissaoExiste = await PermissaoModel.buscarPermissaoPorDescricao(descricao);
        if (permissaoExiste) {
            res.status(400).json({ message: `Permissão '${descricao}' já cadastrada` });
            return;
        }

        // Cadastro da permissão
        const permissaoCadastrada = await PermissaoModel.cadastrarPermissao(descricao);

        res.status(201).json({ message: "Permissão cadastrada com sucesso", permissao: permissaoCadastrada });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta
permissaoController.get("/permissoes", AuthJWT, async (_, res) => {
    try {
        const permissoes = await PermissaoModel.buscarPermissoes();
        if (permissoes.length === 0) {
            res.status(200).json({ message: "Nenhuma permissão cadastrada" });
            return;
        }

        res.status(200).json({ permissoes });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por id
permissaoController.get("/permissoes/:id", AuthJWT, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const permissao = await PermissaoModel.buscarPermissaoPorId(id);
        if (!permissao) {
            res.status(404).json(permissao);
            return;
        }

        res.status(200).json({ permissao });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização
permissaoController.put("/permissoes/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { descricao } = req.body;
        if (!descricao) {
            res.status(400).json({ message: "Informar descrição" });
            return;
        }

        const permissaoExiste = await PermissaoModel.buscarPermissaoPorId(id);
        if (!permissaoExiste) {
            res.status(404).json({ message: `Permissão não encontrada` });
        }

        // Atualização da permissão
        const permissaoAtualizada = await PermissaoModel.atualizarPermissao(id, descricao);

        res.status(200).json({ message: "Permissão atualizada com sucesso", permissao: permissaoAtualizada });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Exclusão
permissaoController.delete("/permissoes/:id", AuthJWT, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const permissaoExiste = await PermissaoModel.buscarPermissaoPorId(id);
        if (!permissaoExiste) {
            res.status(404).json({ message: `Permissão não encontrada` });
            return;
        }

        const permissaoExcluida = await PermissaoModel.excluirPermissao(id);

        res.status(200).json({ message: "Permissão excluída com sucesso", permissao: permissaoExcluida });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default permissaoController;