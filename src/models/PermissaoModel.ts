import { prisma } from "../db";

export type TipoPermissaoModel = {
    id?: number;
    descricao: string;
};

export default class PermissaoModel {
    prisma = prisma;

    /**
     * Cadastra uma nova permissão no banco de dados.
     * 
     * @param descricao A descrição da permissão a ser cadastrada.
     * @returns A permissão cadastrada.
     * @throws {Error} Se houver um erro ao cadastrar a permissão.
     */
    static async cadastrarPermissao(descricao: string) {
        try {
            return await prisma.permissao.create({ data: { descricao } });
        } catch (error: any) {
            throw new Error(`Erro ao cadastrar permissão: ${error.message}`);
        }
    }

    /**
     * Busca todas as permissões no banco de dados.
     * 
     * @returns Uma lista com todas as permissões.
     * @throws {Error} Se houver um erro ao buscar as permissões.
     */
    static async buscarPermissoes() {
        try {
            return await prisma.permissao.findMany();
        } catch (error: any) {
            throw new Error(`Erro ao buscar permissões: ${error.message}`);
        }
    }

    /**
     * Busca uma permissão no banco de dados pelo seu ID.
     * 
     * @param id O ID da permissão a ser buscada.
     * @returns A permissão encontrada ou null.
     * @throws {Error} Se houver um erro ao buscar a permissão por id.
     */
    static async buscarPermissaoPorId(id: number) {
        try {
            return await prisma.permissao.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar permissão por id: ${error.message}`);
        }
    }

    /**
     * Busca uma permissão no banco de dados por sua descrição.
     * 
     * @param descricao A descrição da permissão a ser buscada.
     * @returns A permissão encontrada ou null.
     * @throws {Error} Se houver um erro ao buscar a permissão por descrição.
     */
    static async buscarPermissaoPorDescricao(descricao: string) {
        try {
            return await prisma.permissao.findFirst({ where: { descricao } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar permissão por descrição: ${error.message}`);
        }
    }

    /**
     * Atualiza a descrição de uma permissão no banco de dados.
     * 
     * @param id O ID da permissão a ser atualizada.
     * @param descricao A nova descrição para a permissão.
     * @returns A permissão atualizada.
     * @throws {Error} Se houver um erro ao atualizar a permissão.
     */
    static async atualizarPermissao(id: number, descricao: string) {
        try {
            return await prisma.permissao.update({ where: { id }, data: { descricao } });
        } catch (error: any) {
            throw new Error(`Erro ao atualizar permissão: ${error.message}`);
        }
    }

    /**
     * Exclui uma permissão do banco de dados com base no ID fornecido.
     * 
     * @param id O ID da permissão a ser excluída.
     * @returns A permissão excluída.
     * @throws {Error} Se houver um erro ao excluir a permissão.
     */
    static async excluirPermissao(id: number) {
        try {
            return await prisma.permissao.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir permissão: ${error.message}`);
        }
    }
}