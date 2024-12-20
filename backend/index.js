import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; // Importando helmet para configurar a CSP
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";


dotenv.config({});

const app = express();
const _dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Configuração de Content Security Policy (CSP) com Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "chrome-extension://8364c58d-972f-4c78-aab1-c4dbcc475ef5"], // Adicionando a extensão ao scriptSrc
      // Adicionar outras diretivas conforme necessário
    }
  }
}));

// Configuração de CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // Altere para a URL correta do frontend
  credentials: true // Permitir credenciais
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// Conexão com o banco de dados
connectDB();

// Rotas da API
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (_,res) => {
	res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

