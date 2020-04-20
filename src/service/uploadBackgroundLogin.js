'use strict';

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/settings/')
    },
    filename: function (req, file, cb) {
        var extFile = path.extname(file.originalname);
        extFile = extFile.toLowerCase();
        cb(null, 'background-login' + extFile)
    }
})
 
var uploadBackgroundLogin = multer({ storage: storage })

module.exports = uploadBackgroundLogin;