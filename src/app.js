'use strict';

global.config = require('./config.js')
global.service = require('./service/service');

//cek aplikasi
try {
    var mysql      = require('mysql')
    var connection = mysql.createConnection({
      host     : config.host,
      user     : config.user,
      password : config.password,
      database : config.database
    })                 
    connection.connect()
    connection.query('select 1', function (error, results, fields) {
        if (error) {
			console.log('============DATABASE============')
			console.log('host database : ' + config.host)
			console.log('user database : ' + config.user)
			console.log('password database : ' + config.password)
			console.log('nama database : ' + config.database)
            console.log('error database code 1 : ' + error)
			console.log('apakah sudah benar? ')
			console.log('================================')
        } else {
			console.log('============DATABASE============')
			console.log('host database : ' + config.host)
			console.log('user database : ' + config.user)
			console.log('password database : ' + config.password)
			console.log('nama database : ' + config.database)
        	console.log('sukses konek ke database')
			console.log('apakah sudah benar? ')
			console.log('================================')
			console.log('cek aplikasi berjalan dari browser : https://192.168.108.6:' + config.portApp)
        }
    })
    connection.end()
} catch (error) {
	console.log('============DATABASE============')
	console.log('host database : ' + config.host)
	console.log('user database : ' + config.user)
	console.log('password database : ' + config.password)
	console.log('nama database : ' + config.database)
	console.log('apakah sudah benar? ')
	console.log('error database code 2 : ' + error)
	console.log('================================')
}

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use('/assets/profile-pics', express.static('assets/profile-pics'))
app.use('/assets/attachments-notif', express.static('assets/attachments-notif'))
app.use('/assets/attachments-ide', express.static('assets/attachments-ide'))
app.use('/assets/attachments-sharing', express.static('assets/attachments-sharing'))
app.use('/assets/attachments-chat-ide', express.static('assets/attachments-chat-ide'))
app.use('/assets/attachments-chat-sharing', express.static('assets/attachments-chat-sharing'))
app.use('/assets/ebook', express.static('assets/ebook'))
app.use('/assets/settings', express.static('assets/settings'))

app.use(bodyParser.json())

//security

global.jwt = require('jsonwebtoken');

var cors = require('cors')
app.use(cors())

var helmet = require('helmet')
app.use(helmet())

app.disable('x-powered-by')

var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3',
  name: 'sessionId'
}))

//end security

//routing

var serveIndex = require('serve-index');
app.use(express.static("/"))
app.use('/assets/attachments-ide', serveIndex('assets/attachments-ide'));
app.use('/assets/attachments-notif', serveIndex('assets/attachments-notif'));
app.use('/assets/attachments-chat-ide', serveIndex('assets/attachments-chat-ide'));
app.use('/assets/attachments-sharing', serveIndex('assets/attachments-sharing'));
app.use('/assets/attachments-chat-sharing', serveIndex('assets/attachments-chat-sharing'));
app.use('/assets/profile-pics', serveIndex('assets/profile-pics'));
app.use('/assets/ebook', serveIndex('assets/ebook'));
app.use('/assets/settings', serveIndex('assets/settings'));

app.get('/', async function (req, res, next) {
	res.send('middleware berjalan');
    res.end();
});

var api = require('./controllers/api')
app.use('/api', api)

//end routing

app.listen(config.portApp)