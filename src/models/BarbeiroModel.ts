import { prisma } from "../db";

export type TipoBarbeiroModel = {
    nome: string;
    telefone: string;
    senha?: string;
    //TODO: adicionar email?
}

export default class BarbeiroModel {
    prisma = prisma;

    /**
     * Cadastra um novo barbeiro no banco de dados.
     * 
     * @param dadosBarbeiro Os dados do barbeiro a ser cadastrado.
     * @returns O barbeiro cadastrado.
     * @throws {Error} Se houver um erro ao cadastrar o barbeiro.
     */
    static async cadastrarBarbeiro(dadosBarbeiro: TipoBarbeiroModel) {
        try {
            return await prisma.barbeiro.create({
                data: { ...dadosBarbeiro, senha: dadosBarbeiro.senha! }
            });
        } catch (error: any) {
            throw new Error(`Erro ao cadastrar barbeiro: ${error.message}`);
        }
    }

    /**
     * Busca todos os barbeiros no banco de dados.
     * 
     * @returns Uma lista com todos os barbeiros.
     * @throws {Error} Se houver um erro ao buscar os barbeiros.
     */
    static async buscarBarbeiros() {
        try {
            return await prisma.barbeiro.findMany();
        } catch (error: any) {
            throw new Error(`Erro ao buscar barbeiros: ${error.message}`);
        }
    }

    /**
     * Busca um barbeiro pelo seu ID.
     * @param id O ID do barbeiro.
     * @returns O barbeiro encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o barbeiro.
     */
    static async buscarBarbeiroPorId(id: number) {
        try {
            return await prisma.barbeiro.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar barbeiro por id: ${error.message}`);
        }
    }

    /**
     * Atualiza um barbeiro no banco de dados.
     * 
     * @param id O ID do barbeiro a ser atualizado.
     * @param data Os dados a serem atualizados no barbeiro.
     * @returns O barbeiro atualizado.
     * @throws {Error} Se houver um erro ao atualizar o barbeiro.
     */
    static async atualizarBarbeiro(id: number, data: Partial<TipoBarbeiroModel>) {
        try {
            return await prisma.barbeiro.update({ where: { id }, data  });
        } catch (error: any) {
            throw new Error(`Erro ao atualizar barbeiro: ${error.message}`);
        }
    }

    /**
     * Exclui um barbeiro do banco de dados com base no ID fornecido.
     * 
     * @param id O ID do barbeiro a ser excluído.
     * @returns O barbeiro excluído.
     * @throws {Error} Se houver um erro ao excluir o barbeiro.
     */
    static async excluirBarbeiro(id: number) {
        try {
            return await prisma.barbeiro.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir barbeiro: ${error.message}`);
        }
    }
}