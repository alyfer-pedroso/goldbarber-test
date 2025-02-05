import { prisma } from "../db";

export type TipoAvaliacaoBarbeiro = {
    id?: number;
    avaliacao: number;
    usuarioId: number;
    barbeiroId: number;
}

export default class AvaliacaoBarbeiroModel {
    prisma = prisma;

    /**
     * Cadastra uma nova avaliação de barbeiro no banco de dados.
     * 
     * @param dadosAvaliacao Os dados da avaliação a ser cadastrada.
     * @returns A avaliação cadastrada.
     * @throws {Error} Se houver um erro ao cadastrar a avaliação.
     */
    static async cadastrarAvaliacao(dadosAvaliacao: TipoAvaliacaoBarbeiro) {
        try {
            return await prisma.avaliacaoBarbeiro.create({ data: dadosAvaliacao });
        } catch (error: any) {
            throw new Error(`Erro ao cadastrar avaliação: ${error.message}`);
        }
    }

    /**
     * Busca uma avaliação de barbeiro por id no banco de dados.
     * 
     * @param id O ID da avaliação a ser buscada.
     * @returns A avaliação encontrada.
     * @throws {Error} Se houver um erro ao buscar a avaliação.
     */
    static async buscarAvaliacaoPorId(id: number) {
        try {
            return await prisma.avaliacaoBarbeiro.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar avaliação por id: ${error.message}`);
        }
    }

    /**
     * Busca todas as avaliações de um barbeiro no banco de dados.
     * 
     * @param id O ID do barbeiro cujas avaliações serão buscadas.
     * @returns Uma lista com todas as avaliações do barbeiro.
     * @throws {Error} Se houver um erro ao buscar as avaliações.
     */
    static async buscarAvaliacoesPorBarbeiro(id: number) {
        try {
            return await prisma.avaliacaoBarbeiro.findMany({ where: { barbeiroId: id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar avaliações por barbeiro: ${error.message}`);
        }
    }

    /**
     * Busca todas as avaliações feitas por um usuário no banco de dados.
     * 
     * @param id O ID do usuário cujas avaliações serão buscadas.
     * @returns Uma lista com todas as avaliações do usuário.
     * @throws {Error} Se houver um erro ao buscar as avaliações.
     */
    static async buscarAvaliacoesPorUsuario(id: number) {
        try {
            return await prisma.avaliacaoBarbeiro.findMany({ where: { usuarioId: id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar avaliações por usuário: ${error.message}`);
        }
    }

    /**
     * Busca uma avaliação de um barbeiro feita por um usuário no banco de dados.
     * 
     * @param idBarbeiro O ID do barbeiro cuja avaliação será buscada.
     * @param idUsuario O ID do usuário que fez a avaliação.
     * @returns A avaliação do barbeiro feita pelo usuário.
     * @throws {Error} Se houver um erro ao buscar a avaliação.
     */
    static async buscarAvaliacaoPorBarbeiroEUsuario(idBarbeiro: number, idUsuario: number) {
        try {
            return await prisma.avaliacaoBarbeiro.findFirst({ where: { barbeiroId: idBarbeiro, usuarioId: idUsuario } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar avaliação por barbeiro e usuário: ${error.message}`);
        }
    }

    /**
     * Atualiza uma avaliação de um barbeiro no banco de dados.
     * 
     * @param id O ID da avaliação que será atualizada.
     * @param avaliacao A nova avaliação.
     * @returns A avaliação atualizada.
     * @throws {Error} Se houver um erro ao atualizar a avaliação.
     */
    static async atualizarAvaliacao(id: number, avaliacao: number) {
        try {
            return await prisma.avaliacaoBarbeiro.update({
                where: { id },
                data: { avaliacao }
            });
        } catch (error: any) {
            throw new Error(`Erro ao atualizar avaliação: ${error.message}`);
        }
    }

    /**
     * Exclui uma avaliação de um barbeiro do banco de dados.
     * 
     * @param id O ID da avaliação a ser excluída.
     * @returns A avaliação excluída.
     * @throws {Error} Se houver um erro ao excluir a avaliação.
     */
    static async excluirAvaliacao(id: number) {
        try {
            return await prisma.avaliacaoBarbeiro.delete({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao excluir avaliação: ${error.message}`);
        }
    }
}