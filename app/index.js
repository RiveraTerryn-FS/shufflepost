import express from "express";
import morgan from "morgan";
import routeHandler from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
// ---------- API  ----------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API up and running",
    success: true,
  });
});
// ---------- API ROUTES ----------
app.use("/api/v1", routeHandler);
// ---------- 404 HANDLER ---------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});
// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    error: err.message,
    message: "Server Error",
  });
});
export default app;