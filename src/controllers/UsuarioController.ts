import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthJWT } from "../middlewares/AuthJWT";
import UsuarioModel, { TipoUsuarioModel } from "../models/UsuarioModel";
import UsuarioPermissaoModel from "../models/UsuarioPermissaoModel";

const usuarioController = Router();

// Login
usuarioController.post("/login", async (req, res) => {
  try {
    // Validação dos dados
    const { email, senha } = req.body;
    if (!(email && senha)) {
      res.status(400).json({ message: "Informar email e senha" });
      return;
    }

    const usuarioExiste = await UsuarioModel.buscarUsuarioPorEmail(email);
    if (!usuarioExiste) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const senhaEstaCorreta = await bcrypt.compare(senha, usuarioExiste.senha);
    if (!senhaEstaCorreta) {
      res.status(401).json({ message: "Senha incorreta" });
      return;
    }

    // Geração do token
    const payload = {
      id: usuarioExiste.id,
      nome: usuarioExiste.nome,
      email: usuarioExiste.email,
      senha: usuarioExiste.senha,
      telefone: usuarioExiste.telefone,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: "30d" });

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Cadastro
usuarioController.post("/usuarios", async (req, res) => {
  try {
    // Validação dos dados
    const { nome, email, senha, telefone } = req.body;
    if (!(nome && email && senha && telefone)) {
      res.status(400).json({ message: "Informar nome, email, senha e telefone" });
      return;
    }

    const usuarioExiste = await UsuarioModel.buscarUsuarioPorEmail(email);
    if (usuarioExiste) {
      res.status(400).json({ message: "Usuário já cadastrado" });
      return;
    }

    // Cadastro do usuário
    const hash = await bcrypt.hash(senha, 10);
    const usuarioCadastrado = await UsuarioModel.cadastrarUsuario({ nome, email, telefone, senha: hash });

    res.status(201).json({ message: "Usuário cadastrado com sucesso", usuario: usuarioCadastrado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Consulta
usuarioController.get("/usuarios", AuthJWT, async (_, res) => {
  try {
    const usuarios = await UsuarioModel.buscarUsuarios();
    if (usuarios.length === 0) {
      res.status(200).json([]);
      return;
    }

    const usuariosComPermissoes = await Promise.all(
      usuarios.map(async (usuario) => {
        const permissoes = await UsuarioPermissaoModel.buscarPermissoesDoUsuario(usuario.id);
        return { ...usuario, permissoes };
      })
    );

    res.status(200).json(usuariosComPermissoes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Consulta por id
usuarioController.get("/usuarios/:id", AuthJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuario = await UsuarioModel.buscarUsuarioPorId(id);
    if (!usuario) {
      res.status(404).json(usuario);
      return;
    }

    const permissoes = await UsuarioPermissaoModel.buscarPermissoesDoUsuario(id);
    res.status(200).json({ ...usuario, permissoes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Atualização completa
usuarioController.put("/usuarios/:id", AuthJWT, async (req, res) => {
  try {
    // Validação dos dados
    const id = parseInt(req.params.id);
    const { nome, email, telefone } = req.body;
    if (!(nome && email && telefone)) {
      res.status(400).json({ message: "Informar nome, email e telefone" });
    }

    const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
    if (!usuarioExiste) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    // Atualização do usuário
    const usuarioAtualizado = await UsuarioModel.atualizarUsuario(id, { nome, email, telefone });

    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: usuarioAtualizado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Atualização parcial
usuarioController.patch("/usuarios/:id", AuthJWT, async (req, res) => {
  try {
    // Validação dos dados
    const id = parseInt(req.params.id);
    const dadosUsuario = req.body;

    if (!(dadosUsuario || Object.keys(dadosUsuario).length === 0)) {
      res.status(400).json({ message: "Nenhum dado informado" });
      return;
    }

    if (dadosUsuario.senha) {
      res.status(400).json({ message: "Não é possível atualizar senha" });
      return;
    }

    const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
    if (!usuarioExiste) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    // Agrupa os dados passados num objeto
    let dadosAtualizados: Partial<TipoUsuarioModel> = {};
    for (const dado in dadosUsuario) {
      if (dado !== "nome" && dado !== "email" && dado !== "telefone") {
        res.status(400).json({ message: `Campo ''${dado}'' inválido` });
        return;
      }

      dadosAtualizados[dado as keyof TipoUsuarioModel] = dadosUsuario[dado];
    }

    const usuarioAtualizado = await UsuarioModel.atualizarUsuario(id, dadosAtualizados);

    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: usuarioAtualizado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Exclusão
usuarioController.delete("/usuarios/:id", AuthJWT, async (req, res) => {
  try {
    // Validação dos dados
    const id = parseInt(req.params.id);

    const usuarioExiste = await UsuarioModel.buscarUsuarioPorId(id);
    if (!usuarioExiste) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    // Exclusão do usuário
    const usuarioExcluido = await UsuarioModel.excluirUsuario(id);

    res.status(200).json({
      message: "Usuário excluido com sucesso",
      usuario: usuarioExcluido,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default usuarioController;
