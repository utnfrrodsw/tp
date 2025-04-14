const multer = require('multer');
const path = require('path');

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../../../public/images/solicitud'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-fastservices-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: diskstorage
}).array('fotos',5);


module.exports = upload;