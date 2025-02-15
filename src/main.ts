import express from "express";
import cors from "cors";
import usuarioController from "./controllers/UsuarioController";
import barbeiroController from "./controllers/BarbeiroController";
import tipoServicoController from "./controllers/TipoServicoController";
import servicoController from "./controllers/ServicoController";
import agendamentoController from "./controllers/AgendamentoController";
import permissaoController from "./controllers/PermissaoController";
import usuarioPermissaoController from "./controllers/UsuarioPermissaoController";
import avalicaoBarbeiroController from "./controllers/AvaliacaoBarbeiroController";

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(usuarioController);
app.use(barbeiroController);
app.use(tipoServicoController);
app.use(servicoController);
app.use(agendamentoController);
app.use(permissaoController);
app.use(usuarioPermissaoController);
app.use(avalicaoBarbeiroController);

app.get("/", (req, res) => {
  res.send("A API está funcionando!");
});

app.listen(process.env.PORT, () => {
  console.log(`API rodando na porta ${process.env.PORT}!`);
});

export default app;
