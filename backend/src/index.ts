import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`<h1>hello our project..</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});