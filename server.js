import app from "./app/index.js";
import dotenv from "dotenv";
import "./app/db/config.js";
// ------------------ SERVER CONNECTION -----------------
dotenv.config();
const PORT = process.env.PORT || 3000;
// -------------------- SERVER START --------------------
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));