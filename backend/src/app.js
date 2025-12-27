import express from "express";
import cors from "cors";
import urlRoutes from "./routes/url.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", urlRoutes);
app.use("/", urlRoutes);

export default app;