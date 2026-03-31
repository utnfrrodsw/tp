import multer, {
    diskStorage
} from 'multer';

// Configura el almacenamiento de archivos de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


export const upload = multer({
    storage: storage /* , fileFilter: fileFilter  */
}).array('fotos', 5)

/* export default {
  upload
}; */