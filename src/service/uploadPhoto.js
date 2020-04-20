'use strict';

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/profile-pics/')
    },
    filename: function (req, file, cb) {
        var extFile = path.extname(file.originalname);
        extFile = extFile.toLowerCase();
        cb(null, req.body.userId + extFile)
    }
})
 
var uploadPhoto = multer({ storage: storage })

module.exports = uploadPhoto;