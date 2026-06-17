import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now();

        cb(
            null,
            uniqueSuffix + "-" + file.originalname
        );
    },

});

// Accept only PDF files
const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {

        cb(null, true);

    } else {

        cb(
            new Error("Only PDF files are allowed"),
            false
        );

    }

};

const upload = multer({

    storage,
    fileFilter,

});

export default upload;