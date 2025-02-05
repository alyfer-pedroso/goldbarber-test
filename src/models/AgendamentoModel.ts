import { prisma } from "../db";

export type TipoAgendamento = {
    data: Date;
    usuarioId: number;
    barbeiroId: number;
    servicoId: number;
};

export default class AgendamentoModel {
    prisma = prisma;

    /**
     * Cadastra um novo agendamento no banco de dados.
     * 
     * @param agendamento Os dados do agendamento a ser cadastrado.
     * @returns O agendamento cadastrado.
     * @throws {Error} Se houver um erro ao cadastrar o agendamento.
     */
    static async cadastrarAgendamento(agendamento: TipoAgendamento) {
        try {
            return await prisma.agendamento.create({ data: agendamento });
        } catch (error: any) {
            throw new Error(`Erro ao cadastrar agendamento: ${error.message}`);
        }
    }

    /**
     * Busca todos os agendamentos no banco de dados.
     * 
     * @returns Uma lista com todos os agendamentos.
     * @throws {Error} Se houver um erro ao buscar os agendamentos.
     */
    static async buscarAgendamentos() {
        try {
            return await prisma.agendamento.findMany();
        } catch (error: any) {
            throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
        }
    }

    /**
     * Busca um agendamento pelo seu ID.
     * 
     * @param id O ID do agendamento a ser buscado.
     * @returns O agendamento encontrado ou null.
     * @throws {Error} Se houver um erro ao buscar o agendamento.
     */
    static async buscarAgendamentoPorId(id: number) {
        try {
            return await prisma.agendamento.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar agendamento por ID: ${error.message}`);
        }
    }

    /**
     * Busca todos os agendamentos de um barbeiro no banco de dados.
     * 
     * @param barbeiroId O ID do barbeiro a ser buscado.
     * @returns Uma lista com todos os agendamentos do barbeiro.
     * @throws {Error} Se houver um erro ao buscar os agendamentos.
     */
    static async buscarAgendamentosPorBarbeiro(barbeiroId: number) {
        try {
            return await prisma.agendamento.findMany({ where: { barbeiroId } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar agendamentos por barbeiro: ${error.message}`);
        }
    }

    /**
     * Busca todos os agendamentos de um usuário no banco de dados.
     * 
     * @param usuarioId O ID do usuário a ser buscado.
     * @returns Uma lista com todos os agendamentos do usuário.
     * @throws {Error} Se houver um erro ao buscar os agendamentos.
     */
    static async buscarAgendamentosPorUsuario(usuarioId: number) {
        try {
            return await prisma.agendamento.findMany({ where: { usuarioId } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar agendamentos por usuário: ${error.message}`);
        }
    }

    /**
     * Busca um agendamento no banco de dados com base na data e no ID do barbeiro.
     * 
     * @param data A data do agendamento a ser buscado.
     * @param barbeiroId O ID do barbeiro associado ao agendamento.
     * @returns O agendamento encontrado e o nome do barbeiro associado ou null.
     * @throws {Error} Se houver um erro ao buscar o agendamento por data e barbeiro.
     */
    static async buscarAgendamentoPorDataEBarbeiro(data: Date, barbeiroId: number) {
        try {
            return await prisma.agendamento.findFirst({ 
                where: { data, barbeiroId },
                include: { 
                    barbeiro: {
                        select: { nome: true }
                    }
                } 
            });
        } catch (error: any) {
            throw new Error(`Erro ao buscar agendamento por data e barbeiro: ${error.message}`);
        }
    }

    /**
     * Atualiza um agendamento no banco de dados.
     * 
     * @param id O ID do agendamento a ser atualizado.
     * @param dadosAgendamento Os dados a serem atualizados no agendamento.
     * @returns O agendamento atualizado.
     * @throws {Error} Se houver um erro ao atualizar o agendamento.
     */
    static async atualizarAgendamento(id: number, dadosAgendamento: Partial<TipoAgendamento>) {
        try {
            return await prisma.agendamento.update({ where: { id }, data: dadosAgendamento });
        } catch (error: any) {
            throw new Error(`Erro ao atualizar agendamento: ${error.message}`);
        }
    }

    /**
     * Exclui um agendamento do banco de dados com base no ID fornecido.
     * 
     * @param id O ID do agendamento a ser excluído.
     * @returns O agendamento excluído.
     * @throws {Error} Se houver um erro ao excluir o agendamento.
     */
    static async excluirAgendamento(id: number) {
        try {
            return await prisma.agendamento.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir agendamento: ${error.message}`);
        }
    }
}