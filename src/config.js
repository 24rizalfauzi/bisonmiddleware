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
} else if (env==='test') {
	//APP
	var portApp	 = 8512
	var bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
	//DB
	var host     = 'localhost'
	var user     = 'rizalbek_bsi'
	var password = '0~=e~*=(s!oD'
	var database = 'rizalbek_bsi'
} else if (env==='prod') {
	//APP
	var portApp	 = 8512
	var bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
	//DB
	var host     = 'localhost'
	var user     = 'root'
	var password = ''
	var database = 'bison_db'
}
//APP
module.exports.portApp = portApp
module.exports.bsiSecretKey = '84l1Sm4t!nn[0]v4t![o]n'
//DB
module.exports.host     = host
module.exports.user     = user
module.exports.password = password
module.exports.database = database