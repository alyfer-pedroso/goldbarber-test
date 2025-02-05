import { prisma } from "../db";

export type TipoServicoModel = {
    descricao: string;
    tipoServicoId: number;
    duracao: number;
    valor: number;
}

export default class ServicoModel {
    prisma = prisma;

    /**
     * Cadastra um novo serviço no banco de dados.
     * 
     * @param dadosServico Os dados do serviço a ser cadastrado.
     * @returns O serviço cadastrado.
     * @throws {Error} Se houver um erro ao cadastrar o serviço.
     */
    static async cadastrarServico(dadosServico: TipoServicoModel) {
        try {
            return await prisma.servico.create({ data: dadosServico });
        } catch (error: any) {  
            throw new Error(`Erro ao cadastrar serviço: ${error.message}`);
        }
    }

    /**
     * Busca todos os serviços no banco de dados.
     * 
     * @returns Uma lista com todos os serviços.
     * @throws {Error} Se houver um erro ao buscar os serviços.
     */
    static async buscarServicos() {
        try {
            return await prisma.servico.findMany();
        } catch (error: any) {  
            throw new Error(`Erro ao buscar serviços: ${error.message}`);
        }
    }

    /**
     * Busca um serviço pelo seu ID.
     * 
     * @param id O ID do serviço a ser buscado.
     * @returns O serviço encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o serviço.
     */
    static async buscarServicoPorId(id: number) {
        try {
            return await prisma.servico.findUnique({ where: { id } });
        } catch (error: any) {  
            throw new Error(`Erro ao buscar serviço por ID: ${error.message}`);
        }
    }

    /**
     * Busca um serviço por sua descrição.
     * 
     * @param descricao A descrição do serviço a ser buscado.
     * @returns O serviço encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o serviço.
     */
    static async buscarServicoPorDescricao(descricao: string) {
        try {
            return await prisma.servico.findFirst({ where: { descricao } });
        } catch (error: any) {  
            throw new Error(`Erro ao buscar serviço por descrição: ${error.message}`);
        }
    }

    /**
     * Atualiza um serviço no banco de dados.
     * 
     * @param id O ID do serviço a ser atualizado.
     * @param dadosAtualizados Os dados a serem atualizados no serviço.
     * @returns O serviço atualizado.
     * @throws {Error} Se houver um erro ao atualizar o serviço.
     */
    static async atualizarServico(id: number, dadosAtualizados: Partial<TipoServicoModel>) {
        try {
            return await prisma.servico.update({ where: { id }, data: dadosAtualizados });
        } catch (error: any) {  
            throw new Error(`Erro ao atualizar serviço: ${error.message}`);
        }
    }

    /**
     * Exclui um serviço do banco de dados com base no ID fornecido.
     * 
     * @param id O ID do serviço a ser excluído.
     * @returns O serviço excluído.
     * @throws {Error} Se houver um erro ao excluir o serviço.
     */
    static async excluirServico(id: number) {
        try {
            return await prisma.servico.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir serviço: ${error.message}`);
        }
    }
}