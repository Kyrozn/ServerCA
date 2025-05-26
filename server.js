"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cocktail_routes_1 = __importDefault(require("./routes/cocktail.routes"));
const app = (0, express_1.default)();
const PORT = 5050;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Static files (e.g. images)
app.use("/cocktailImage", express_1.default.static(path_1.default.join(__dirname, "Image")));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/cocktails", cocktail_routes_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
