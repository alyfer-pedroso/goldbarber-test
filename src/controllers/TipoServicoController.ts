import { AuthJWT } from "../middlewares/AuthJWT";
import TipoServicoModel from "../models/TipoServicoModel";
import { Router } from "express";

const tipoServicoController = Router();

// Cadastro
tipoServicoController.post("/tipos-servico", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const { descricao } = req.body;
        if (!descricao) {
            res.status(400).json({ message: "Informar descrição" });
            return;
        }

        const tipoServicoExiste = await TipoServicoModel.buscarTipoServicoPorDescricao(descricao);
        if (tipoServicoExiste) {
            res.status(400).json({ message: `Tipo de serviço '${descricao}' já cadastrado` });
            return;
        }

        // Cadastro do tipo de serviço
        const tipoServicoCadastrado = await TipoServicoModel.cadastrarTipoServico(descricao);

        res.status(201).json({ message: "Tipo de serviço cadastrado com sucesso", tipoServico: tipoServicoCadastrado });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta
tipoServicoController.get("/tipos-servico", AuthJWT, async (_, res) => {
    try {
        const tiposServico = await TipoServicoModel.buscarTiposServico();
        if (tiposServico.length === 0) {
            res.status(200).json([]);
            return;
        }

        res.status(200).json({ tiposServico });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização
tipoServicoController.put("/tipos-servico/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { descricao } = req.body;
        if (!descricao) {
            res.status(400).json({ message: "Informar descrição" });
            return;
        }

        const tipoServicoExiste = await TipoServicoModel.buscarTipoServicoPorId(id);
        if (!tipoServicoExiste) {
            res.status(404).json({ message: `Tipo de serviço '${descricao}' não encontrado` });
            return;
        }

        // Atualização do tipo de serviço
        const tipoServicoAtualizado = await TipoServicoModel.atualizarTipoServico(id, descricao);

        res.status(200).json({ message: "Tipo de serviço atualizado com sucesso", tipoServico: tipoServicoAtualizado });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Exclusão
tipoServicoController.delete("/tipos-servico/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const tipoServicoExiste = await TipoServicoModel.buscarTipoServicoPorId(id);
        if (!tipoServicoExiste) {
            res.status(404).json({ message: `Tipo de serviço '${id}' não encontrado` });
            return;
        }

        // Exclusão do tipo de serviço
        const tipoServicoExcluido = await TipoServicoModel.excluirTipoServico(id);

        res.status(200).json({ message: "Tipo de serviço excluído com sucesso", tipoServico: tipoServicoExcluido });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default tipoServicoController;