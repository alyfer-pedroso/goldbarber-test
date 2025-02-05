import AvaliacaoBarbeiroModel from "../models/AvaliacaoBarbeiroModel";
import BarbeiroModel from "../models/BarbeiroModel";
import UsuarioModel from "../models/UsuarioModel";
import { Router } from "express";
import { AuthJWT } from "../middlewares/AuthJWT";

const avalicaoBarbeiroController = Router();

// Cadastro
avalicaoBarbeiroController.post("/avaliacoes-barbeiro", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const { avaliacao, usuarioId, barbeiroId } = req.body;
        if (!(avaliacao && usuarioId && barbeiroId)) {
            res.status(400).json({ message: "Informar avaliação, usuário e barbeiro" });
            return;
        }

        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(usuarioId);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(barbeiroId);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        const avaliacaoExiste = await AvaliacaoBarbeiroModel.buscarAvaliacaoPorBarbeiroEUsuario(barbeiroId, usuarioId);
        if (avaliacaoExiste) {
            res.status(409).json({ message: "Avaliação já existe" });
            return;
        }

        // Cria a avaliação
        const avaliacaoBarbeiro = await AvaliacaoBarbeiroModel.cadastrarAvaliacao({ avaliacao, barbeiroId, usuarioId });

        res.status(201).json({ message: "Avaliação cadastrada com sucesso", avaliacaoBarbeiro });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por barbeiro
avalicaoBarbeiroController.get("/avaliacoes-barbeiro/barbeiro/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);

        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(id);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        const avaliacoes = await AvaliacaoBarbeiroModel.buscarAvaliacoesPorBarbeiro(id);

        res.status(200).json(avaliacoes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por barbeiro e usuário
avalicaoBarbeiroController.get("/avaliacoes-barbeiro/barbeiro/:barbeiroId/usuario/:usuarioId", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const barbeiroId = parseInt(req.params.barbeiroId);
        const usuarioId = parseInt(req.params.usuarioId);

        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(barbeiroId);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(usuarioId);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const avaliacao = await AvaliacaoBarbeiroModel.buscarAvaliacaoPorBarbeiroEUsuario(barbeiroId, usuarioId);

        res.status(200).json(avaliacao);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por usuário
avalicaoBarbeiroController.get("/avaliacoes-barbeiro/usuario/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);

        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const avaliacoes = await AvaliacaoBarbeiroModel.buscarAvaliacoesPorUsuario(id);

        res.status(200).json(avaliacoes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualizar avaliação
avalicaoBarbeiroController.put("/avaliacoes-barbeiro/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { avaliacao } = req.body;
        if (!avaliacao) {
            res.status(400).json({ message: "Informar avaliação" });
            return;
        }

        const avaliacaoExiste = await AvaliacaoBarbeiroModel.buscarAvaliacaoPorId(id);
        if (!avaliacaoExiste) {
            res.status(404).json({ message: "Avaliação não encontrada" });
            return;
        }

        // Atualização da avaliação
        const avaliacaoAtualizada = await AvaliacaoBarbeiroModel.atualizarAvaliacao(id, avaliacao);

        res.status(200).json(avaliacaoAtualizada);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Exclusão
avalicaoBarbeiroController.delete("/avaliacoes-barbeiro/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);

        const avaliacaoExiste = await AvaliacaoBarbeiroModel.buscarAvaliacaoPorId(id);
        if (!avaliacaoExiste) {
            res.status(404).json({ message: "Avaliação não encontrada" });
            return;
        }
        
        // Exclusão da avaliação
        const avaliacaoExcluida = await AvaliacaoBarbeiroModel.excluirAvaliacao(id);

        res.status(200).json(avaliacaoExcluida);
    } catch (error: any) {
    res.status(500).json({ message: error.message });
}
});

export default avalicaoBarbeiroController;