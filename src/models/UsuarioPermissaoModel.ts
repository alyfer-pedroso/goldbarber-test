import { prisma } from "../db";

export default class UsuarioPermissaoModel {
    prisma = prisma;

    /**
     * Adiciona uma permissão a um usuário no banco de dados.
     * 
     * @param usuarioId O ID do usuário ao qual a permissão será adicionada.
     * @param permissaoId O ID da permissão a ser adicionada ao usuário.
     * @throws {Error} Se houver um erro ao adicionar a permissão ao usuário.
     */
    static async adicionarPermissaoAoUsuario(usuarioId: number, permissaoId: number) {
        try {
            await prisma.usuarioPermissao.create({ data: { usuarioId, permissaoId } });
        } catch (error: any) {
            throw new Error(`Erro ao adicionar permissão ao usuário: ${error.message}`);
        }
    }

    /**
     * Busca as permissões de um usuário no banco de dados.
     * 
     * @param id O ID do usuário a ser buscado.
     * @returns As permissões do usuário.
     * @throws {Error} Se houver um erro ao buscar as permissões do usuário.
     */
    static async buscarPermissoesDoUsuario(id: number) {
        try {
            return await prisma.usuarioPermissao.findMany({ where: { usuarioId: id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar permissões do usuário: ${error.message}`);
        }
    }

    /**
     * Busca uma permissão específica de um usuário no banco de dados.
     * 
     * @param id O ID do usuário a ser buscado.
     * @param permissaoId O ID da permissão a ser buscada.
     * @returns A permissão do usuário ou null.
     * @throws {Error} Se houver um erro ao buscar a permissão do usuário.
     */
    static async buscarPermissaoDoUsuario(id: number, permissaoId: number) {
        try {
            return await prisma.usuarioPermissao.findFirst({ where: { usuarioId: id, permissaoId } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar permissão do usuário: ${error.message}`);
        }
    }

    /**
     * Busca uma permissão de um usuário no banco de dados pelo ID da permissão.
     * 
     * @param id O ID da permissão a ser buscada.
     * @returns A permissão do usuário ou null.
     * @throws {Error} Se houver um erro ao buscar a permissão do usuário.
     */
    static async buscarPermissaoDoUsuarioPorId(id: number) {
        try {
            return await prisma.usuarioPermissao.findUnique({ where: { id } });
        } catch (error: any) {
            throw new Error(`Erro ao buscar permissão do usuário por id: ${error.message}`);
        }
    }

    /**
     * Atualiza as permissões de um usuário no banco de dados.
     * 
     * @param id O ID do usuário a ser atualizado.
     * @param permissoes As novas permissões do usuário.
     * @returns O usuário atualizado com as novas permissões.
     * @throws {Error} Se houver um erro ao atualizar as permissões do usuário.
     */
    static async atualizarPermissoesDoUsuario(id: number, permissoes: number[]) {
        try {
            // Excluindo as permissões anteriores
            await prisma.usuarioPermissao.deleteMany({ where: { usuarioId: id } });

            // Adicionando as novas permissões
            for await (const permissao of permissoes) {
                await prisma.usuarioPermissao.create({ data: { usuarioId: id, permissaoId: permissao } });
            }

            // Buscando o usuário atualizado
            const usuario = await prisma.usuario.findUnique({ where: { id } });
            const permissoesAtualizadas = await this.buscarPermissoesDoUsuario(id);

            return { ...usuario, permissoes: permissoesAtualizadas };
        } catch (error: any) {
            throw new Error(`Erro ao atualizar permissões do usuário: ${error.message}`);
        }
    }

    /**
     * Remove uma permissão específica de um usuário no banco de dados.
     * 
     * @param id O ID do usuário a ser atualizado.
     * @param permissaoId O ID da permissão a ser removida.
     * @throws {Error} Se houver um erro ao remover a permissão do usuário.
     */ 
    static async removerPermissaoDoUsuario(id: number, permissaoId: number) {
        try {
            await prisma.usuarioPermissao.deleteMany({ where: { usuarioId: id, permissaoId } });
        } catch (error: any) {
            throw new Error(`Erro ao remover permissão do usuário: ${error.message}`);
        }
    }
}