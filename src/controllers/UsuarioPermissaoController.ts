import { AuthJWT } from "../middlewares/AuthJWT";
import PermissaoModel from "../models/PermissaoModel";
import UsuarioModel from "../models/UsuarioModel";
import UsuarioPermissaoModel from "../models/UsuarioPermissaoModel";
import { Router } from "express";

const usuarioPermissaoController = Router();

// Adicionar permissão
usuarioPermissaoController.post("/usuarios/:id/permissoes", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { permissao } = req.body;

        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        
        if (!permissao) {
            res.status(400).json({ message: "Informar permissão" });
            return;
        }

        const permissaoExiste = await PermissaoModel.buscarPermissaoPorId(permissao);
        if (!permissaoExiste) {
            res.status(404).json({ message: "Permissão não encontrada" });
            return;
        }

        const usuarioPossuiPermissao = await UsuarioPermissaoModel.buscarPermissaoDoUsuario(id, permissao);
        if (usuarioPossuiPermissao) {
            res.status(400).json({ message: "Usuário ja possui essa permissão" });
            return;
        }

        // Adição da permissão ao usuário
        await UsuarioPermissaoModel.adicionarPermissaoAoUsuario(id, permissao);

        res.status(200).json({ message: "Permissão adicionada ao usuário com sucesso" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consultar permissões
usuarioPermissaoController.get("/usuarios/:id/permissoes", AuthJWT, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const permissoes = await UsuarioPermissaoModel.buscarPermissoesDoUsuario(id);
        res.status(200).json({ permissoes });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consultar permissão
usuarioPermissaoController.get("/usuarios/permissoes/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);

        const permissao = await UsuarioPermissaoModel.buscarPermissaoDoUsuarioPorId(id);
        
        res.status(200).json({ permissao });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualizar permissões
usuarioPermissaoController.put("/usuarios/:id/permissoes", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { permissoes } = req.body;
        if (!permissoes) {
            res.status(400).json({ message: "Informar permissões" });
        }

        if (!Array.isArray(permissoes)) {
            res.status(400).json({ message: "As permissões devem ser enviadas como um array" });
            return;
        }

        for await (const permissao of permissoes) {
            if (typeof permissao !== "number") {
                res.status(400).json({ message: "As permissões devem ser enviadas como um array de numeros" });
                return;
            }

            const permissaoExiste = await PermissaoModel.buscarPermissaoPorId(permissao);
            if (!permissaoExiste) {
                res.status(404).json({ message: `Permissão ${permissao} não encontrada` });
                return;
            }
        }

        const usuarioExiste =  await UsuarioModel.buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        // Atualiza as permissões
        const usuarioAtualizado = await UsuarioPermissaoModel.atualizarPermissoesDoUsuario(id, permissoes);

        res.status(200).json({ message: "Permissões atualizadas com sucesso", usuario: usuarioAtualizado });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Remover permissão
usuarioPermissaoController.delete("/usuarios/:id/permissoes/:permissaoId", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const permissaoId = parseInt(req.params.permissaoId)

        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const permissaoExiste = await PermissaoModel.buscarPermissaoPorId(permissaoId);
        if (!permissaoExiste) {
            res.status(404).json({ message: "Permissão não encontrada" });
            return;
        }

        const usuarioPossuiPermissao = await UsuarioPermissaoModel.buscarPermissaoDoUsuario(id, permissaoId);
        if (!usuarioPossuiPermissao) {
            res.status(400).json({ message: "Usuário não possui essa permissão" });
            return;
        }

        // Remoção da permissão ao usuário
        await UsuarioPermissaoModel.removerPermissaoDoUsuario(id, permissaoId);

        res.status(200).json({ message: "Permissão removida ao usuário com sucesso" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default usuarioPermissaoController;