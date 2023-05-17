const util = require("util");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'storage');
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

const uploadFiles = multer({ storage: storage }).array("images", 17);
const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;