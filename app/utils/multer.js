import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.ms-excel',                     // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/msword',                           // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'image/jpeg',                                   // .jpg, .jpeg
    'image/png'                                     // opcional: permitir png también
];

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF, Excel, Word o imágenes JPG'), false);
        }
    }
});