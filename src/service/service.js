'use strict';

var request = require('request');
request = request.defaults({
    //'proxy':config.proxyPass,
    'rejectUnauthorized': false
})

async function query(query) {
return new Promise(function (resolve, reject) {
        try {
            var mysql      = require('mysql')
            var connection = mysql.createConnection({
              host     : config.host,
              user     : config.user,
              password : config.password,
              database : config.database
            })                 
            connection.connect()
            connection.query(query, function (error, results, fields) {
                if (error) {
                    console.log('error database code 1' + error)
                    resolve('errdb1');
                }
                resolve(results)
            })
            connection.end()
        } catch (error) {
            console.log('error database code 2' + error)
            resolve('errdb2');
        }
    })
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = {
    token: async function () {
        return new Promise(function (resolve, reject) {
            const jwt = require('jsonwebtoken');
            try {
                (async () => {
                    var querySettings = await query(`CALL procGetSettings();`);
                    const user = {
                        id: 1,
                        username: "johndoes",
                        email: "john.doe@test.com"
                    }
                    jwt.sign({user},config.bsiSecretKey, { expiresIn: 60 * 60 * 24 * 30 * 12}, (err, token) => {
                        resolve({token:token,settings:querySettings[0][0]});
                    });
                })()
            } catch (error) {
                console.log('error token' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    validateToken: async function (token, res) {
        return new Promise(function (resolve, reject) {
            try {
                jwt.verify(token, config.bsiSecretKey, (err, authData)=>{
                    if(err){
                        resolve(res.sendStatus(403));
                    } else {
                        resolve("token valid");
                    }
                });
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateTokenFirebase: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`UPDATE tbl_users SET token_firebase="`+req.tokenFirebase+`" WHERE id="`+req.userId+`";`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses'
                    }); 
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR USER
    getPagePegawai: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var pegawai = await query(`CALL procGetUsersOrderByName();`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        pegawai : pegawai[0]
                    }); 
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    createUser: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    var md5 = require('md5');
                    var password = md5(req.password)
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`CALL procCreateUser("`+req.nip+`","`+password+`","`+req.name+`","`+req.email+`","`+req.role+`");`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses'
                    }); 
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    login: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    var isValid = false;
                    var queryUser = await query(`CALL procGetUserByNip("`+req.nip+`");`);
                    if (queryUser=='errdb1'||queryUser=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    var users = queryUser[0];
                    var user = users[0];
                    if (users.length==1) {
                        var md5 = require('md5');
                        if (user.password==md5(req.password)) {
                            isValid = true
                        }
                    } 
                    if (isValid) {
                        resolve({
                            responseCode : true,
                            responseMessage : 'Sukses',
                            user : user
                        });                        
                    } else {
                        resolve({
                            responseCode : false,
                            responseMessage : 'NIp atau password salah'
                        });
                    }
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    loginV2: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    var isValid = false;
                    var queryUser = await query(`SELECT * from tbl_users where tbl_users.nip="${req.nip}" OR tbl_users.email="${req.nip}" OR tbl_users.name="${req.nip}" limit 1;`);
                    if (queryUser=='errdb1'||queryUser=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    var user = queryUser[0];
                    if (queryUser.length==1) {
                        var email = user.email;
                        var password = req.password;
                        const nodemailer = require('nodemailer')
                        let transporter = nodemailer.createTransport({
                            host: 'localhost',
                            port: '25',
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: email, // generated ethereal user
                                pass: password // generated ethereal password
                            }
                        })
                        // verify connection configuration
                        transporter.verify(function(error, success) {
                            if (error) {
                                console.log(error)
                                resolve({
                                    responseCode : false,
                                    responseMessage : 'Password salah / Pastikan Anda sudah didaftarkan oleh Admin ke database'
                                });
                            } else {
                                resolve({
                                    responseCode : true,
                                    responseMessage : 'Sukses',
                                    user : user
                                });  
                            }
                        });
                    } else {
                        resolve({
                            responseCode : false,
                            responseMessage : 'NIP / Nama / Email / Password salah / Pastikan Anda sudah didaftarkan oleh Admin ke database'
                        });
                    }
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    getUserById: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    var isValid = false;
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryUser = await query(`CALL procGetUserById(`+req.userId+`);`);
                    if (queryUser=='errdb1'||queryUser=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    var users = queryUser[0];
                    var user = users[0];
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        user : user
                    });
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateUser: async function (req, newPhotoName) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var md5 = require('md5');
                    var queryUpdateUser = `` 
                    if (newPhotoName==undefined) {
                        if (req.userPassword || req.userPassword=='' || req.userPassword==null) {
                            queryUpdateUser = `UPDATE tbl_users SET nip="`+req.userNip+`", name="`+req.userName+`", email="`+req.userEmail+`", status="`+req.userStatus+`", role="`+req.userRole+`" WHERE id="`+req.userId+`";`
                        } else {
                            queryUpdateUser = `UPDATE tbl_users SET nip="`+req.userNip+`", password="`+md5(req.userPassword)+`", name="`+req.userName+`", email="`+req.userEmail+`", status="`+req.userStatus+`", role="`+req.userRole+`" WHERE id="`+req.userId+`";`
                        }
                    } else {
                        if (req.userPassword || req.userPassword=='' || req.userPassword==null) {
                            queryUpdateUser = `UPDATE tbl_users SET nip="`+req.userNip+`", name="`+req.userName+`", email="`+req.userEmail+`", photo="`+newPhotoName+`", status="`+req.userStatus+`", role="`+req.userRole+`" WHERE id="`+req.userId+`";`
                        } else {
                            queryUpdateUser = `UPDATE tbl_users SET nip="`+req.userNip+`", password="`+md5(req.userPassword)+`", name="`+req.userName+`", email="`+req.userEmail+`", photo="`+newPhotoName+`", status="`+req.userStatus+`", role="`+req.userRole+`" WHERE id="`+req.userId+`";`
                        }
                    }
                    await query(queryUpdateUser)
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses mengajukan ide'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR IDE
    getPageIde: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryGetMentors = await query(`CALL procGetmentors();`);
                    if (req.userRole=='rso') {
                        var queryIde = await query(`CALL procGetPageIdeRso();`);
                    } else {
                        var queryIde = await query(`CALL procGetPageIdeUser(`+req.userId+`);`);
                    }

                    //ubah bentuk json attachments dari text jadi array
                    var ide = queryIde[0]
                    var attachments = []
                    for (var i = 0; i < ide.length; i++) {
                        attachments.push(ide[i].attachments.split(","))
                    }
                    //remove attachment kosong dari array attachment
                    for (var j = 0; j < attachments.length; j++) {
                        attachments[j].remove("")
                    }
                    //memasukkan array attachments ke chatIde
                    for (var k = 0; k < ide.length; k++) {
                        ide[k].attachments = attachments[k]
                        ide[k].border = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                    }
                    

                    resolve(
                        {
                            responseCode : true,
                            responseMessage : 'Sukses',
                            applicantIde : ide,
                            mentors : queryGetMentors[0]
                        }
                    );

                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    getPageHistoryIde: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    if (req.userRole=='admin') {
                        var queryGetPageHistoryIde = await query(`CALL procGetPageHistoryIdeAdmin();`);
                        var queryGetPageHistorySharing = await query(`CALL procGetPageHistorySharingAdmin();`);
                    } else {
                        var queryGetPageHistoryIde = await query(`CALL procGetPageHistoryIde(`+req.userId+`);`);
                        var queryGetPageHistorySharing = await query(`CALL procGetPageHistorySharing(`+req.userId+`);`);                        
                    }
                    resolve(
                        {
                            responseCode : true,
                            responseMessage : 'Sukses',
                            ideas : queryGetPageHistoryIde[0],
                            sharings : queryGetPageHistorySharing[0]
                        }
                    );

                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    submitNewIde: async function (req,files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    var querySubmitNewIde = await query(`CALL procSubmitNewIde("`+req.applicantId+`", "`+req.judul+`", "`+req.latarBelakang+`", "`+req.tujuan+`", "`+req.costBenefitAnalysis+`", "`+attachments+`");`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses mengajukan ide'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    selectMentorByRso: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryGetUserAdmin = await query(`CALL procGetUsersByRole("admin");`);
                    var querySelectMentorByRso = await query(`CALL procSelectMentorByRso('`+req.ideId+`','`+req.mentorId+`');`);
                    var queryGetIdeById = await query(`call procGetIdeById("`+req.ideId+`")`)
                    var queryGetMentorById = await query(`call procGetUserById("`+req.mentorId+`")`)

                    var textMentor = `Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : `+queryGetIdeById[0][0].judul+`, Latar Belakang : `+queryGetIdeById[0][0].latar_belakang+`, Tujuan : `+queryGetIdeById[0][0].tujuan+`, Pengaju : `+queryGetIdeById[0][0].applicantName
                    var textAdmin = queryGetMentorById[0][0].name+` ditunjuk oleh RSO untuk menjadi mentor. Judul : `+queryGetIdeById[0][0].judul+`, Latar Belakang : `+queryGetIdeById[0][0].latar_belakang+`, Tujuan : `+queryGetIdeById[0][0].tujuan+`, Pengaju : `+queryGetIdeById[0][0].applicantName
                    var htmlMentor = textMentor
                    var htmlAdmin = textAdmin
                    await query(`CALL procInsertPushEmail("`+req.mentorId+`","Pilih Mentor Ide Oleh RSO - Bali Smart Innovation","`+textMentor+`","`+htmlMentor+`","`+queryGetIdeById[0][0].attachments+`");`);
                    for (var i = 0; i < queryGetUserAdmin[0].length; i++) {
                        await query(`CALL procInsertPushEmail("`+queryGetUserAdmin[0][i].id+`","Pilih Mentor Ide Oleh RSO - Bali Smart Innovation","`+textAdmin+`","`+htmlAdmin+`","`+queryGetIdeById[0][0].attachments+`");`);
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses Pilih Mentor'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    rsoOrForumIde: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`CALL procUpdateStatusIde('`+req.ideId+`','`+req.ideStatus+`','`+req.mentorId+`');`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses Pilih Mentor'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR KOMEN IDE
    getPageForumIde: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryGetIdeById = await query('CALL procGetIdeById('+req.ideId+');');
                    var queryChatIde = await query('CALL procGetChatIde('+req.ideId+');');
                    var queryGetMemberByIdeId = await query('CALL procGetMemberByIdeId('+req.ideId+');');
                    var queryUsersBiasa = await query(`CALL procGetUsersByRole("user");`);
                    var queryGetMentors = await query(`CALL procGetmentors();`);

                    //ubah bentuk json attachments dari text jadi array
                    var chatIde = queryChatIde[0]
                    var attachments = []
                    for (var i = 0; i < chatIde.length; i++) {
                        attachments.push(chatIde[i].attachments.split(","))
                    }
                    //remove attachment kosong dari array attachment
                    for (var j = 0; j < attachments.length; j++) {
                        attachments[j].remove("")
                    }
                    //memasukkan array attachments ke chatIde
                    for (var k = 0; k < chatIde.length; k++) {
                        chatIde[k].attachments = attachments[k]
                    }

                    //ubah bentuk json attachments Ide dari text jadi array
                    var ide = queryGetIdeById[0][0]
                    var attachmentsIde = []
                    attachmentsIde.push(ide.attachments.split(","))
                    attachmentsIde.remove("")
                    ide.attachments = attachmentsIde[0]
                    ide.attachments.remove("")

                    //ubah bentuk json members dari text jadi array
                    var members = []
                    var getMemberByIdeId = queryGetMemberByIdeId[0][0]
                    if (getMemberByIdeId.memberId!=null) {
                        var membersId = getMemberByIdeId.memberId.split(",")
                        var membersName = getMemberByIdeId.memberName.split(",")
                        for (var l = 0; l < membersId.length; l++) {
                            members.push({
                                memberId : membersId[l],
                                memberName : membersName[l],
                            })
                        }
                    }

                    resolve(
                        {
                            responseCode : true,
                            responseMessage : 'Sukses',
                            ide : ide,
                            chatIde : chatIde,
                            usersBiasa : queryUsersBiasa[0],
                            members : members,
                            mentors : queryGetMentors[0]
                        }
                    );

                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateStatusIde: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    if (req.ideStatus=='ditolak') {
                        await query(`CALL procUpdateStatusIde('`+req.ideId+`','`+req.ideStatus+`',null);`);
                    } else {
                        await query(`CALL procUpdateStatusIde('`+req.ideId+`','`+req.ideStatus+`','`+req.mentorId+`');`);
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    submitKomenIde: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    var querySubmitKomenIde = await query(`CALL procSubmitKomenIde("`+req.komen+`", "`+req.userId+`", "`+req.ideId+`", "`+attachments+`" );`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    changeProgressIde: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var querySubmitKomenIde = await query(`CALL procChangeProgressIde("`+req.ideId+`", "`+req.ideProgress+`");`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateMembersIde: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`CALL procDeleteMembersIdeByIdeId("`+req.ideId+`");`);
                    for (var i = 0; i < req.membersId.length; i++) {
                        await query(`CALL procInsertMemberIde("`+req.ideId+`","`+req.applicantId+`","`+req.membersId[i]+`","`+req.mentorId+`");`);
                    }

                    var queryGetMemberByIdeId = await query('CALL procGetMemberByIdeId('+req.ideId+');');

                    //ubah bentuk json members dari text jadi array
                    var members = []
                    var getMemberByIdeId = queryGetMemberByIdeId[0][0]
                    if (getMemberByIdeId.memberId!=null) {
                        var membersId = getMemberByIdeId.memberId.split(",")
                        var membersName = getMemberByIdeId.memberName.split(",")
                        for (var l = 0; l < membersId.length; l++) {
                            members.push({
                                memberId : membersId[l],
                                memberName : membersName[l],
                            })
                        }
                    }

                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar',
                        members : members
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR SHARING SESSION
    getPageSharing: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryGetMentors = await query(`CALL procGetmentors();`);
                    if (req.userRole=='admin') {
                        var querySharing = await query(`CALL procGetPageSharingAdmin();`);
                    } else {
                        var querySharing = await query(`CALL procGetPageSharingUser(`+req.userId+`);`);
                    }
                    for (let i = 0; i < querySharing[0].length; i++) {
                        querySharing[0][i].border = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                        
                    }
                    resolve(
                        {
                            responseCode : true,
                            responseMessage : 'Sukses',
                            applicantSharing : querySharing[0],
                            mentors : queryGetMentors[0]
                        }
                    );

                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    submitNewSharing: async function (req,files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    var querySubmitNewSharing = await query(`CALL procSubmitNewSharing("`+req.applicantId+`", "`+req.judul+`", "`+req.latarBelakang+`", "`+req.tujuan+`", "`+req.costBenefitAnalysis+`", "`+req.mentorId+`", "`+attachments+`");`);


                    //email

                    var queryGetUserAdmin = await query(`CALL procGetUsersByRole("admin");`);
                    var queryGetSharingById = await query(`call procGetSharingById("`+querySubmitNewSharing[0][0].sharingId+`")`)
                    var queryGetMentorById = await query(`call procGetUserById("`+req.mentorId+`")`)

                    var textMentor = `Anda ditunjuk untuk menjadi mentor dan menunggu jadwal dari admin. Judul : `+queryGetSharingById[0][0].judul+`, Pengaju : `+queryGetSharingById[0][0].applicantName
                    var textAdmin = queryGetMentorById[0][0].name+` ditunjuk untuk menjadi mentor dan menunggu jadwal dari admin. Judul : `+queryGetSharingById[0][0].judul+`, Pengaju : `+queryGetSharingById[0][0].applicantName
                    var htmlMentor = textMentor
                    var htmlAdmin = textAdmin
                    await query(`CALL procInsertPushEmail("`+req.mentorId+`","Sharing Baru - Bali Smart Innovation","`+textMentor+`","`+htmlMentor+`","`+queryGetSharingById[0][0].attachments+`");`);
                    for (var i = 0; i < queryGetUserAdmin[0].length; i++) {
                        await query(`CALL procInsertPushEmail("`+queryGetUserAdmin[0][i].id+`","Sharing Baru - Bali Smart Innovation","`+textAdmin+`","`+htmlAdmin+`","`+queryGetSharingById[0][0].attachments+`");`);
                    }


                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses mengajukan sharing'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    selectJadwalSharingByAdmin: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var querySelectJadwalSharingByAdmin = await query(`CALL procSelectJadwalSharingByAdmin('`+req.sharingId+`','`+req.jadwal+`');`);


                    //email

                    var queryGetUserAdmin = await query(`CALL procGetUsersByRole("admin");`);
                    var queryGetSharingById = await query(`call procGetSharingById("`+req.sharingId+`")`)

                    var textMentor = `Anda ditunjuk untuk menjadi mentor pada `+req.jadwal+`. Judul : `+queryGetSharingById[0][0].judul+`, Pengaju : `+queryGetSharingById[0][0].applicantName
                    var textAdmin = queryGetSharingById[0][0].mentorName+` ditunjuk menjadi mentor pada `+req.jadwal+`. Judul : `+queryGetSharingById[0][0].judul+`, Pengaju : `+queryGetSharingById[0][0].applicantName
                    var htmlMentor = textMentor
                    var htmlAdmin = textAdmin
                    await query(`CALL procInsertPushEmail("`+req.mentorId+`","Jadwal Sharing - Bali Smart Innovation","`+textMentor+`","`+htmlMentor+`","`+queryGetSharingById[0][0].attachments+`");`);
                    for (var i = 0; i < queryGetUserAdmin[0].length; i++) {
                        await query(`CALL procInsertPushEmail("`+queryGetUserAdmin[0][i].id+`","Jadwal Sharing - Bali Smart Innovation","`+textAdmin+`","`+htmlAdmin+`","`+queryGetSharingById[0][0].attachments+`");`);
                    }


                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses Menentukan Tanggal'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR KOMEN SHARING
    getPageForumSharing: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryGetSharingById = await query('CALL procGetSharingById('+req.sharingId+');');
                    var queryChatSharing = await query('CALL procGetChatSharing('+req.sharingId+');');
                    var queryGetMemberBySharingId = await query('CALL procGetMemberBySharingId('+req.sharingId+');');
                    var queryUsersBiasa = await query(`CALL procGetUsersByRole("user");`);

                    //ubah bentuk json attachments dari text jadi array
                    var chatSharing = queryChatSharing[0]
                    var attachments = []
                    for (var i = 0; i < chatSharing.length; i++) {
                        attachments.push(chatSharing[i].attachments.split(","))
                    }
                    //remove attachment kosong dari array attachment
                    for (var j = 0; j < attachments.length; j++) {
                        attachments[j].remove("")
                    }
                    //memasukkan array attachments ke chatSharing
                    for (var k = 0; k < chatSharing.length; k++) {
                        chatSharing[k].attachments = attachments[k]
                    }

                    //ubah bentuk json members dari text jadi array
                    var members = []
                    var getMemberBySharingId = queryGetMemberBySharingId[0][0]
                    if (getMemberBySharingId.memberId!=null) {
                        var membersId = getMemberBySharingId.memberId.split(",")
                        var membersName = getMemberBySharingId.memberName.split(",")
                        for (var l = 0; l < membersId.length; l++) {
                            members.push({
                                memberId : membersId[l],
                                memberName : membersName[l],
                            })
                        }
                    }

                    //ubah bentuk json attachments Ide dari text jadi array
                    var sharing = queryGetSharingById[0][0]
                    var attachmentsSharing = []
                    attachmentsSharing.push(sharing.attachments.split(","))
                    attachmentsSharing.remove("")
                    sharing.attachments = attachmentsSharing[0]
                    sharing.attachments.remove("")

                    resolve(
                        {
                            responseCode : true,
                            responseMessage : 'Sukses',
                            sharing : sharing,
                            chatSharing : chatSharing,
                            usersBiasa : queryUsersBiasa[0],
                            members : members
                        }
                    );

                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateStatusSharing: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`CALL procUpdateStatusSharing('`+req.sharingId+`','`+req.sharingStatus+`','`+req.mentorId+`');`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    submitKomenSharing: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    var querySubmitKomenSharing = await query(`CALL procSubmitKomenSharing("`+req.komen+`", "`+req.userId+`", "`+req.sharingId+`", "`+attachments+`" );`);
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateMembersSharing: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`CALL procDeleteMembersSharingBySharingId("`+req.sharingId+`");`);
                    for (var i = 0; i < req.membersId.length; i++) {
                        await query(`CALL procInsertMemberSharing("`+req.sharingId+`","`+req.applicantId+`","`+req.membersId[i]+`","`+req.mentorId+`");`);
                    }

                    var queryGetMemberBySharingId = await query('CALL procGetMemberBySharingId('+req.sharingId+');');

                    //ubah bentuk json members dari text jadi array
                    var members = []
                    var getMemberBySharingId = queryGetMemberBySharingId[0][0]
                    if (getMemberBySharingId.memberId!=null) {
                        var membersId = getMemberBySharingId.memberId.split(",")
                        var membersName = getMemberBySharingId.memberName.split(",")
                        for (var l = 0; l < membersId.length; l++) {
                            members.push({
                                memberId : membersId[l],
                                memberName : membersName[l],
                            })
                        }
                    }

                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses berkomentar',
                        members : members
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR EBOOK
    getPageEbook: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryGetPageEbook = await query(`CALL procGetPageEbook();`)
                    var queryGetSettings = await query(`CALL procGetSettings();`)
                    var settings = queryGetSettings[0][0]
                    var folderSettings = settings.folder_ebook.split(",")
                    //ubah bentuk json attachments dari text jadi array
                    var ebooks = queryGetPageEbook[0]
                    var attachments = []
                    for (var i = 0; i < ebooks.length; i++) {
                        attachments.push(ebooks[i].attachments.split(","))
                    }
                    //remove attachment kosong dari array attachment
                    for (var j = 0; j < attachments.length; j++) {
                        attachments[j].remove("")
                    }
                    //memasukkan array attachments ke ebooks
                    for (var k = 0; k < ebooks.length; k++) {
                        ebooks[k].attachments = attachments[k]
                    }
                    var newStucture = {}
                    for (let a = 0; a < folderSettings.length; a++) {
                        var newIsiStucture = []
                        for (let b = 0; b < ebooks.length; b++) {
                            if(ebooks[b].folder == folderSettings[a]){
                                newIsiStucture.push(ebooks[b])
                            }
                        }
                        newStucture[folderSettings[a]] = newIsiStucture;
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        ebooks : newStucture
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    uploadEbook: async function (req, files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => { 
                    await query(`CALL procLastActiveUser(`+req.uploaderId+`);`);
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    await query(`CALL procInsertEbook(`+req.uploaderId+`, '`+attachments+`', '`+req.folder+`');`)
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses Upload'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateSettings: async function (req, newPhotoName) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryUpdateSetting = `` 
                    if (newPhotoName==undefined) {
                        queryUpdateSetting = `UPDATE tbl_setting SET about="`+req.about+`" WHERE id=1;`
                    } else {
                        queryUpdateSetting = `UPDATE tbl_setting SET about="`+req.about+`",background_login="`+newPhotoName+`" WHERE id=1;`
                    }
                    await query(queryUpdateSetting)
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses mengajukan ide'
                    });
                })();
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    //FITUR NOTIFICATIONS
    getPageNotif: async function (req) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    var isValid = false;
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    await query(`CALL procReadNotif(`+req.activeUserId+`);`);
                    var queryNotif = await query(`CALL procGetPageNotif();`);
                    //ubah bentuk json attachments dari text jadi array
                    var notif = queryNotif[0]
                    var attachments = []
                    for (var i = 0; i < notif.length; i++) {
                        if (notif[i].attachments!=null) {
                            attachments.push(notif[i].attachments.split(","))   
                        } else {
                            attachments.push([])
                        }
                    }
                    //remove attachment kosong dari array attachment
                    for (var j = 0; j < attachments.length; j++) {
                        attachments[j].remove("")
                    }
                    //memasukkan array attachments ke chatnotif
                    for (var k = 0; k < notif.length; k++) {
                        notif[k].attachments = attachments[k]
                    }
                    if (queryNotif=='errdb1'||queryNotif=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        notifications : notif
                    });
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    insertNotif: async function (req,files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    var isValid = false;
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var queryNotif = await query(`CALL procInsertNotif("`+req.message+`","`+attachments+`");`);
                    var users = await query(`CALL procGetUsersOrderByName();`);
                    for (let a = 0; a < users[0].length; a++) {
                        await query(`CALL procInsertPushNotif("`+users[0][a].id+`","`+queryNotif[0][0].notifId+`");`);
                    }
                    if (queryNotif=='errdb1'||queryNotif=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        notifications : queryNotif[0]
                    });
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    updateNotif: async function (req,files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var isValid = false;
                    var attachments = '';
                    for (var i = 0; i < files.length; i++) {
                        attachments = attachments+files[i].filename+','
                    }
                    if (attachments=='') {
                        var queryNotif = await query(`CALL  procUpdateNotifWithoutAttachments("`+req.id+`","`+req.message+`");`);
                    } else {
                        var queryNotif = await query(`CALL procUpdateNotif("`+req.id+`","`+req.message+`","`+attachments+`");`);
                    }
                    if (queryNotif=='errdb1'||queryNotif=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        notifications : queryNotif[0]
                    });
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
    countNotif: async function (req,files) {
        return new Promise(function (resolve, reject) {
            try {
                (async () => {
                    await query(`CALL procLastActiveUser(`+req.activeUserId+`);`);
                    var countNotif = await query(`CALL  procGetCountNotifByUserId("`+req.userId+`");`);
                    if (countNotif=='errdb1'||countNotif=='errdb2') {
                        resolve({
                            responseCode : false,
                            responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                        });
                    }
                    resolve({
                        responseCode : true,
                        responseMessage : 'Sukses',
                        countNotif : countNotif[0][0].countNotif
                    });
                })();   
            } catch (error) {
                console.log('error' + error)
                resolve({
                    responseCode : false,
                    responseMessage : 'Terjadi Kesalahan Sistem. Hubungi Administrator.'
                });
            }
        })
    },
}