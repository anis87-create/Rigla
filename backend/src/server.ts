import express from "express";
import cors from "cors";
import pool from "./config/index.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.get("/api/health", async (_req, res) => {
  try {
     const result = await pool.query('SELECT NOW()');
     res.json({
      msg:'Connexion réussie',
      time: result.rows[0].now
     })
  } catch (error) {
     console.error(error);

    res.status(500).json({
      message: "Erreur de connexion à la base de données",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
