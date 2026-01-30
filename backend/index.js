import express from "express";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());
app.use("/api", taskRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
