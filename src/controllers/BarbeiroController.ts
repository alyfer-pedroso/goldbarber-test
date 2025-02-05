import { Router } from "express";
import bcrypt from "bcrypt";
import { AuthJWT } from "../middlewares/AuthJWT";
import BarbeiroModel, { TipoBarbeiroModel } from "../models/BarbeiroModel";
const barbeiroController = Router();

// Cadastro
barbeiroController.post("/barbeiros", async (req, res) => {
    try {
        // Validação dos dados
        const { nome, telefone, senha } = req.body;
        if (!(nome && telefone && senha)) {
            res.status(400).json({ message: "Informar nome, telefone e senha" });
            return;
        }

        //TODO: checar se barbeiro já está cadastrado (vide TipoBarbeiroModel)

        // Cadastro do barbeiro
        const hash = await bcrypt.hash(senha, 10);
        const barbeiroCadastrado = await BarbeiroModel.cadastrarBarbeiro({ nome, telefone, senha: hash });

        res.status(201).json({ message: "Barbeiro cadastrado com sucesso", barbeiro: barbeiroCadastrado });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Consulta
barbeiroController.get("/barbeiros", AuthJWT, async (_, res) => {
    try {
        const barbeiros = await BarbeiroModel.buscarBarbeiros();
        if (barbeiros.length === 0) {
            res.status(200).json([]);
            return;
        }

        res.status(200).json(barbeiros);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização completa
barbeiroController.put("/barbeiros/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const { nome, telefone } = req.body;
        if (!(nome && telefone)) {
            res.status(400).json({ message: "Informar nome e telefone" });
            return;
        }

        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(id);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        // Atualização do barbeiro
        const barbeiroAtualizado = await BarbeiroModel.atualizarBarbeiro(id, { nome, telefone });

        res.status(200).json({
            message: "Barbeiro atualizado com sucesso",
            barbeiro: barbeiroAtualizado
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Atualização parcial
barbeiroController.patch("/barbeiros/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);
        const dadosBarbeiro  = req.body;
        if (!(dadosBarbeiro || Object.keys(dadosBarbeiro).length === 0)) {
            res.status(400).json({ message: "Nenhum dado informado" });
            return;
        }

        if (dadosBarbeiro.senha) {
            res.status(400).json({ message: "Não é possível atualizar senha" });
            return;
        }

        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(id);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        // Agrupa os dados passados num objeto
        let dadosAtualizados: Partial<TipoBarbeiroModel> = {};
        for (const dado in dadosBarbeiro) {
            if (dado !== "nome" && dado !== "telefone") {
                res.status(400).json({ message: `Campo ''${dado}'' inválido` });
                return;
            }

            dadosAtualizados[dado as keyof TipoBarbeiroModel] = dadosBarbeiro[dado];
        }

        const barbeiroAtualizado = await BarbeiroModel.atualizarBarbeiro(id, dadosAtualizados);

        res.status(200).json({ 
            message: "Barbeiro atualizado com sucesso", 
            barbeiro: barbeiroAtualizado 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Exclusão
barbeiroController.delete("/barbeiros/:id", AuthJWT, async (req, res) => {
    try {
        // Validação dos dados
        const id = parseInt(req.params.id);

        const barbeiroExiste = await BarbeiroModel.buscarBarbeiroPorId(id);
        if (!barbeiroExiste) {
            res.status(404).json({ message: "Barbeiro não encontrado" });
            return;
        }

        // Exclusão do barbeiro
        const barbeiroExcluido = await BarbeiroModel.excluirBarbeiro(id);

        res.status(200).json({ 
            message: "Barbeiro excluído com sucesso", 
            barbeiro: barbeiroExcluido 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default barbeiroController;