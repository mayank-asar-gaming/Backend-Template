import multer from "multer";
import path from "path";

// setup multer for multiple image upload and single image upload with file filter
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, "uploads/");
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, Date.now() + file.originalname);
    },
});

// export default { upload };
let fileFilter = async (req: any, file: any, cb: any) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
};

// Initialize Multer
let upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
