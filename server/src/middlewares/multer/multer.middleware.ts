import multer from "multer";
import path from "path";
import fs from "fs";

// Setup directory
export const uploadDir = path.join(process.cwd(), "server", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer instance
export const upload = multer({
    dest: uploadDir,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
