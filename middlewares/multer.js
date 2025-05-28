"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Crée le dossier si nécessaire
const imageDir = path_1.default.join(__dirname, "..", "Image");
if (!fs_1.default.existsSync(imageDir)) {
    fs_1.default.mkdirSync(imageDir);
}
// Config de multer
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, imageDir);
    },
    filename: (_req, file, cb) => {
        const ext = file.filename;
        cb(null, ext);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
