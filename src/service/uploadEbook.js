'use strict';

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/ebook/')
    },
    filename: function (req, file, cb) {
        var extFile = path.extname(file.originalname);
        extFile = extFile.toLowerCase();
        cb(null, 'bison-ebook-' + makeid(4) + '-' + Date.now() + '-' + file.originalname)
    }
})

function makeid(length) {
   var result           = '';
   var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
 
var uploadEbook = multer({ storage: storage })

module.exports = uploadEbook;