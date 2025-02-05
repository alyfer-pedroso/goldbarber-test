import { AuthJWT } from "../middlewares/AuthJWT";
import ServicoModel, { TipoServicoModel } from "../models/ServicoModel";
import { Router } from "express";

const servicoController = Router();

// Cadastro
servicoController.post("/servicos", AuthJWT,async (req, res) => {
    try {
        // Validação dos dados
        const { descricao, duracao, valor, tipoServicoId } = req.body;
        if (!(descricao && duracao && valor && tipoServicoId)) {
            res.status(400).json({ message: "Informar descrição, duração, valor e tipo de servico" });
            return;
        }

        if (typeof duracao !== "number" && 
            typeof valor !== "number" &&
            typeof tipoServicoId !== "number"
        ) {
            res.status(400).json({ message: "Duração, valor e tipo de serviço devem ser números" });
            return;
        }

        const servicoExiste = await ServicoModel.buscarServicoPorDescricao(descricao);
        if (servicoExiste) {
            res.status(400).json({ message: `Serviço '${descricao}' já cadastrado` });
            return;
        }

        // Cadastro do serviço
        const servicoCadastrado = await ServicoModel.cadastrarServico({ descricao, duracao, valor, tipoServicoId });

        res.status(201).json({ message: "Serviço cadastrado com sucesso", servico: servicoCadastrado });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta
servicoController.get("/servicos", AuthJWT, async (_, res) => {
    try {
        const servicos = await ServicoModel.buscarServicos();
        if (servicos.length === 0) {
            res.status(200).json([]);
            return;
        }

        res.status(200).json({ servicos });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização completa
servicoController.put("/servicos/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { descricao, duracao, valor, tipoServicoId } = req.body;
        if (!(descricao && duracao && valor && tipoServicoId)) {
            res.status(400).json({ message: "Informar descrição, duração, valor e tipo de servico" });
            return;
        }

        if (typeof duracao !== "number" && 
            typeof valor !== "number" &&
            typeof tipoServicoId !== "number"
        ) {
            res.status(400).json({ message: "Duração, valor e tipo de serviço devem ser números" });
            return;
        }

        const servicoExiste = await ServicoModel.buscarServicoPorId(id);
        if (!servicoExiste) {
            res.status(404).json({ message: `Serviço '${descricao}' não encontrado` });
            return;
        }

        // Atualização do serviço
        const servicoAtualizado = await ServicoModel.atualizarServico(id, { descricao, duracao, valor, tipoServicoId });

        res.status(200).json({ message: "Serviço atualizado com sucesso", servico: servicoAtualizado });	
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização parcial
servicoController.patch("/servicos/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const dadosServico = req.body;

        if (!(dadosServico || Object.keys(dadosServico).length === 0)) {
            res.status(400).json({ message: "Nenhum dado informado" });
            return;
        }

        const servicoExiste = await ServicoModel.buscarServicoPorId(id);
        if (!servicoExiste) {
            res.status(404).json({ message: `Serviço '${id}' não encontrado` });
            return;
        }

        // Agrupa os dados passados num objeto
        let dadosAtualizados: Partial<TipoServicoModel> = {};
        for (const dado in dadosServico) {
            if (dado !== "descricao" && dado !== "duracao" &&
                dado !== "valor" && dado !== "tipooServicoId"
            ) {
                res.status(400).json({ message: `Campo ''${dado}'' inválido` });
                return;
            }

            dadosAtualizados[dado as keyof TipoServicoModel] = dadosServico[dado];
        }

        // Atualização do serviço
        const servicoAtualizado = await ServicoModel.atualizarServico(id, dadosAtualizados);

        res.status(200).json({ message: "Serviço atualizado com sucesso", servico: servicoAtualizado });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Exclusão
servicoController.delete("/servicos/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const servicoExiste = await ServicoModel.buscarServicoPorId(id);
        if (!servicoExiste) {
            res.status(404).json({ message: `Serviço '${id}' não encontrado` });
            return;
        }

        // Exclusão do serviço
        const servicoExcluido = await ServicoModel.excluirServico(id);

        res.status(200).json({ message: "Serviço excluído com sucesso", servico: servicoExcluido });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default servicoController;