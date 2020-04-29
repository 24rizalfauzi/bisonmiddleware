'use strict'

var env = process.env.NODE_ENV 

if (env==='dev') {
	//APP
	var portApp	 = 8512
	var bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
	//DB
	var host     = 'localhost'
	var user     = 'root'
	var password = ''
	var database = 'bison_db'
	var sslkey	 = 'C:/xampp/apache/conf/ssl.key/server.key'
	var sslcert	 = 'C:/xampp/apache/conf/ssl.crt/server.crt'
	var smtpHost = 'smtp.gmail.com'
	var smtpPort = 587
} else if (env==='test') {
	//APP
	var portApp	 = 8512
	var bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
	//DB
	var host     = 'localhost'
	var user     = 'rizalbek_bsi'
	var password = '0~=e~*=(s!oD'
	var database = 'rizalbek_bsi'
	var smtpHost = 'smtp.gmail.com'
	var smtpPort = 587
} else if (env==='prod') {
	//APP
	var portApp	 = 8512
	var bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
	//DB
	var host     = 'localhost'
	var user     = 'root'
	var password = ''
	var database = 'bison_db'
	var sslkey	 = 'C:/xampp/apache/conf/ssl.key/server.key'
	var sslcert	 = 'C:/xampp/apache/conf/ssl.crt/server.crt'
	var smtpHost = 'smtp.gmail.com'
	var smtpPort = 587
}
//APP
module.exports.portApp = portApp
module.exports.bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
//DB
module.exports.host     = host
module.exports.user     = user
module.exports.password = password
module.exports.database = database
module.exports.sslkey = sslkey
module.exports.sslcert = sslcert
//SMTP
module.exports.smtpHost = smtpHost
module.exports.smtpPort = smtpPort