import express from "express";
import cors from "cors";

import workspaceRoutes from "./routes/workspace.js";
import experimentsRoutes from "./routes/experiments.js";
import intelligenceRoutes from "./routes/intelligence.js";
import governanceRoutes from "./routes/governance.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

const PORT = Number(process.env.PROMPTWASH_API_PORT || 3000);
const HOST = process.env.PROMPTWASH_API_HOST || "127.0.0.1";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "success",
    data: {
      service: "promptwash-api",
      ok: true,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/workspace", workspaceRoutes);
app.use("/api/experiments", experimentsRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/governance", governanceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`PromptWash API listening on http://${HOST}:${PORT}`);
});