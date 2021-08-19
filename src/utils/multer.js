const multer = require('multer')

module.exports = multer({
    storage : multer.diskStorage({}),
    limits : {
        fileSize : 2000000
    },
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.match(/(jpg|png|jpeg)$/)){

            return cb(new Error('File must be jpg, png or jpeg'), false)
           
        }
        return cb(undefined, true)
    }
})