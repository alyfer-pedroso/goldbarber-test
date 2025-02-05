import { prisma } from "../db";

export type TipoUsuarioModel = {
    nome: string;
    telefone: string;
    email: string;
    senha?: string;
}

export default class UsuarioModel {
    prisma = prisma;

    /**
     * Busca um usuário pelo seu ID.
     * @param id O ID do usuário.
     * @returns O usuário encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o usuário.
     */
    static async buscarUsuarioPorId(id: number) {
        try {
            return await prisma.usuario.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
        }
    }

    /**
     * Busca um usuário pelo seu email.
     * @param email O email do usuário.
     * @returns O usuário encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o usuário.
     */
    static async buscarUsuarioPorEmail(email: string) {
        try {
            return await prisma.usuario.findUnique({ where: { email } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
        }
    }

    /**
     * Cadastra um novo usuário no banco de dados.
     * 
     * @param dadosUsuario Os dados do usuário a ser cadastrado.
     * @returns O usuário cadastrado.
     * @throws {Error} Se houver um erro ao cadastrar o usuário.
     */
    static async cadastrarUsuario(dadosUsuario: TipoUsuarioModel) {
        try {
            return await prisma.usuario.create({
                data: { ...dadosUsuario, senha: dadosUsuario.senha! }
            });
        } catch (error: any) {
            throw new Error(`Erro ao cadastrar usuário: ${error.message}`);
        }
    }

    /**
     * Busca todos os usuários no banco de dados.
     * 
     * @returns Uma lista com todos os usuários.
     * @throws {Error} Se houver um erro ao buscar os usuários.
     */
    static async buscarUsuarios() {
        try {
            return await prisma.usuario.findMany();
        } catch (error: any) {
            throw new Error(`Erro ao buscar usuários: ${error.message}`);
        }
    }

    /**
     * Atualiza um usuário no banco de dados.
     * 
     * @param id O ID do usuário a ser atualizado.
     * @param data Os dados a serem atualizados no usuário.
     * @returns O usuário atualizado.
     * @throws {Error} Se houver um erro ao atualizar o usuário.
     */
    static async atualizarUsuario(id: number, data: Partial<TipoUsuarioModel>) {
        try {
            return await prisma.usuario.update({ where: { id }, data });
        } catch (error: any) {
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    /**
     * Exclui um usuário do banco de dados com base no ID fornecido.
     * 
     * @param id O ID do usuário a ser excluído.
     * @returns O usuário excluído.
     * @throws {Error} Se houver um erro ao excluir o usuário.
     */
    static async excluirUsuario(id: number) {
        try {
            return await prisma.usuario.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir usuário: ${error.message}`);
        }
    }
}