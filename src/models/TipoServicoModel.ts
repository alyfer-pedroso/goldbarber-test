import { prisma } from "../db";

export default class TipoServico {
    prisma = prisma;

    /**
     * Cadastra um novo tipo de serviço no banco de dados.
     * 
     * @param descricao A descrição do tipo de serviço a ser cadastrado.
     * @returns O tipo de serviço cadastrado.
     * @throws {Error} Se houver um erro ao cadastrar o tipo de serviço.
     */
    static async cadastrarTipoServico(descricao: string) {
        try {
            return await prisma.tipoServico.create({ data: { descricao } });
        } catch (error: any) {
            throw new Error(`Erro ao cadastrar tipo de serviço: ${error.message}`);
        }
    }

    /**
     * Busca todos os tipos de serviços no banco de dados.
     * 
     * @returns Uma lista com todos os tipos de serviços.
     * @throws {Error} Se houver um erro ao buscar os tipos de serviços.
     */
    static async buscarTiposServico() {
        try {
            return await prisma.tipoServico.findMany();
        } catch (error: any) {
            throw new Error(`Erro ao buscar tipos de serviços: ${error.message}`);
        }
    }

    /**
     * Busca um tipo de serviço pelo seu ID.
     * 
     * @param id O ID do tipo de serviço a ser buscado.
     * @returns O tipo de serviço encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o tipo de serviço.
     */
    static async buscarTipoServicoPorId(id: number) {
        try {
            return await prisma.tipoServico.findUnique({  where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar tipo de serviço por id: ${error.message}`);
        }
    }

    /**
     * Busca um tipo de serviço por sua descrição.
     * 
     * @param descricao A descrição do tipo de serviço a ser buscado.
     * @returns O tipo de serviço encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o tipo de serviço.
     */
    static async buscarTipoServicoPorDescricao(descricao: string) {
        try {
            return await prisma.tipoServico.findFirst({ where: { descricao } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar tipo de serviço por descrição: ${error.message}`);
        }
    }

    /**
     * Atualiza a descrição de um tipo de serviço no banco de dados.
     * 
     * @param id O ID do tipo de serviço a ser atualizado.
     * @param descricao A nova descrição para o tipo de serviço.
     * @returns O tipo de serviço atualizado.
     * @throws {Error} Se houver um erro ao atualizar o tipo de serviço.
     */
    static async atualizarTipoServico(id: number, descricao: string) {
        try {
            return await prisma.tipoServico.update({ where: { id }, data: { descricao } });
        } catch (error: any) {
            throw new Error(`Erro ao atualizar tipo de serviço: ${error.message}`);
        }
    }

    /**
     * Exclui um tipo de serviço do banco de dados com base no ID fornecido.
     * 
     * @param id O ID do tipo de serviço a ser excluído.
     * @returns O tipo de serviço excluído.
     * @throws {Error} Se houver um erro ao excluir o tipo de serviço.
     */
    static async excluirTipoServico(id: number) {
        try {
            return await prisma.tipoServico.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir tipo de serviço: ${error.message}`);
        }
    }
}