import multer from "multer";

// Store the file in memory (as a Buffer), not on disk.
// req.file.buffer will hold the raw PDF bytes.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});

export default upload;