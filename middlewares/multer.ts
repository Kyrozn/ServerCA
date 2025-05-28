import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Crée le dossier si nécessaire
const imageDir = path.join(__dirname, "..", "Image");
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// Config de multer
const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, imageDir);
  },
  filename: (_req: any, file: any, cb: any) => {
    const ext = file.filename;
    cb(null, ext);
  },
});

const upload = multer({ storage });

export default upload;
