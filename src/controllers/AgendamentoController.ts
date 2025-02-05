import BarbeiroModel from "../models/BarbeiroModel";
import AgendamentoModel, { TipoAgendamento } from "../models/AgendamentoModel";
import { Router } from "express";
import UsuarioModel from "../models/UsuarioModel";
import ServicoModel from "../models/ServicoModel";

const agendamentoController = Router();

// Cadastro
agendamentoController.post("/agendamentos", async (req, res) => {
    try {
        // Validação dos dados
        const { data, usuarioId, barbeiroId, servicoId } = req.body;
        if (!(data && usuarioId && barbeiroId && servicoId)) {
            res.status(400).json({ message: "Informar data, usuário, barbeiro e serviço" });
            return;
        }

        const dataFormatada = new Date(data);
        if (dataFormatada < new Date()) {
            res.status(400).json({ message: "Data inválida: agendamento no passado" });
            return;
        }

        const agendamentoExiste = await AgendamentoModel.buscarAgendamentoPorDataEBarbeiro(dataFormatada, barbeiroId);
        if (agendamentoExiste) {
            res.status(400).json({ message: `O barbeiro ${agendamentoExiste.barbeiro.nome.split(" ")[0]} já possui um agendamento para essa data ou não existe` });
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

        const servicoExiste = await ServicoModel.buscarServicoPorId(servicoId);
        if (!servicoExiste) {
            res.status(404).json({ message: "Servico não encontrado" });
            return;
        }

        // Cadastro do agendamento
        const agendamento = await AgendamentoModel.cadastrarAgendamento({ data: dataFormatada, usuarioId, barbeiroId, servicoId });

        res.status(200).json({ message: "Agendamento cadastrado com sucesso", agendamento });
    } catch (error: any) {
        res.status(500).json({ message: error.message });	
    }
});

// Consulta
agendamentoController.get("/agendamentos", async (_, res) => {
    try {
        const agendamentos = await AgendamentoModel.buscarAgendamentos();
        if (agendamentos.length === 0) {
            res.status(404).json([]);
            return;
        }

        res.status(200).json(agendamentos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por id
agendamentoController.get("/agendamentos/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const agendamento = await AgendamentoModel.buscarAgendamentoPorId(id);

        if (!agendamento) {
            res.status(404).json(agendamento);
            return;
        }

        res.status(200).json(agendamento);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por barbeiro
agendamentoController.get("/agendamentos/barbeiro/:id", async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        
        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(id);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        const agendamentos = await AgendamentoModel.buscarAgendamentosPorBarbeiro(id);
        if (agendamentos.length === 0) {
            res.status(404).json({ message: `Nenhum agendamento encontrado para o barbeiro ${barbeiroExiste.nome}` });
        }

        res.status(200).json(agendamentos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta por usuário
agendamentoController.get("/agendamentos/usuario/:id", async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        
        const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
        if (!usuarioExiste) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const agendamentos = await AgendamentoModel.buscarAgendamentosPorUsuario(id);
        if (agendamentos.length === 0) {
            res.status(404).json({ message: `Nenhum agendamento encontrado para o barbeiro ${usuarioExiste.nome}` });
        }

        res.status(200).json(agendamentos);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização completa
agendamentoController.put("/agendamentos/:id", async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { data, usuarioId, barbeiroId, servicoId } = req.body;
        if (!(data && usuarioId && barbeiroId && servicoId)) {
            res.status(400).json({ message: "Informar data, usuário, barbeiro e serviço" });
            return;
        }

        const dataFormatada = new Date(data);
        if (dataFormatada < new Date()) {
            res.status(400).json({ message: "Data inválida: agendamento no passado" });
            return;
        }

        const agendamentoExiste = await AgendamentoModel.buscarAgendamentoPorId(id);
        if (!agendamentoExiste) {
            res.status(404).json({ message: "Agendamento não encontrado" });
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

        const servicoExiste = await ServicoModel.buscarServicoPorId(servicoId);
        if (!servicoExiste) {
            res.status(404).json({ message: "Servico não encontrado" });
            return;
        }

        // Atualização do agendamento
        const agendamento = await AgendamentoModel.atualizarAgendamento(id, { data: dataFormatada, usuarioId, barbeiroId, servicoId });

        res.status(200).json({ message: "Agendamento atualizado com sucesso", agendamento });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização parcial
agendamentoController.patch("/agendamentos/:id", async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const dadosAgendamento = req.body;

        if (!(dadosAgendamento || Object.keys(dadosAgendamento).length === 0)) {
            res.status(400).json({ message: "Nenhum dado informado" });
            return;
        }

        if (dadosAgendamento.data) {
            dadosAgendamento.data = new Date(dadosAgendamento.data);
            if (dadosAgendamento.data < new Date()) {
                res.status(400).json({ message: "Data inválida: agendamento no passado" });
                return;
            }
        }

        const agendamentoExiste = await AgendamentoModel.buscarAgendamentoPorId(id);
        if (!agendamentoExiste) {
            res.status(404).json({ message: "Agendamento não encontrado" });
            return;
        }

        if (dadosAgendamento.usuarioId) {
            const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(dadosAgendamento.usuarioId);
            if (!usuarioExiste) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }
        }

        if (dadosAgendamento.barbeiroId) {
            const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(dadosAgendamento.barbeiroId);
            if (!barbeiroExiste) {
                res.status(404).json({ message: "Barbeiro não encontrado" });
                return;
            }
        }

        if (dadosAgendamento.servicoId) {
            const servicoExiste = await ServicoModel.buscarServicoPorId(dadosAgendamento.servicoId);
            if (!servicoExiste) {
                res.status(404).json({ message: "Servico não encontrado" });
                return;
            }
        }

        // Agrupa os dados passados num objeto
        let dadosAtualizados: Partial<TipoAgendamento> = {};
        for (const dado in dadosAgendamento) {
            if (dado !== "data" && dado !== "usuarioId" && dado !== "barbeiroId" && dado !== "servicoId") {
                res.status(400).json({ message: `Campo ''${dado}'' inválido` });
                return;
            }

            dadosAtualizados[dado as keyof TipoAgendamento] = dadosAgendamento[dado];
        }

        const agendamentoAtualizado = await AgendamentoModel.atualizarAgendamento(id, dadosAtualizados);

        res.status(200).json({ message: "Agendamento atualizado com sucesso", agendamento: agendamentoAtualizado });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Exclusão
agendamentoController.delete("/agendamentos/:id", async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);

        const agendamentoExiste = await AgendamentoModel.buscarAgendamentoPorId(id);
        if (!agendamentoExiste) {
            res.status(404).json({ message: "Agendamento não encontrado" });
            return;
        }

        // Exclusão do agendamento
        const agendamentoExcluido = await AgendamentoModel.excluirAgendamento(id);

        res.status(200).json({ message: "Agendamento excluído com sucesso", agendamento: agendamentoExcluido });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default agendamentoController;