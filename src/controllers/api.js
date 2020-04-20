'use strict';

var express = require('express')
var router = express.Router()

var cors = require('cors')
router.use(cors())

const jwt = require('jsonwebtoken');
const uploadEbook = require('../service/uploadEbook');
const uploadPhoto = require('../service/uploadPhoto');
const uploadAttachmentsIde = require('../service/uploadAttachmentsIde');
const uploadAttachmentsSharing = require('../service/uploadAttachmentsSharing');
const uploadAttachmentsChatIde = require('../service/uploadAttachmentsChatIde');
const uploadAttachmentsChatSharing = require('../service/uploadAttachmentsChatSharing');
const uploadAttachmentsNotif = require('../service/uploadAttachmentsNotif');
const uploadBackgroundLogin = require('../service/uploadBackgroundLogin');

router.post('/token', async function (req, res, next) {
    let tk = await service.token()
    res.json(tk);
    res.end();
});

router.get('/token', async function (req, res, next) {
    let tk = await service.token()
    res.json(tk);
    res.end();
});

router.post('/updateTokenFirebase', async function (req, res, next) {
    let tk = await service.updateTokenFirebase(req.body)
    res.json(tk);
    res.end();
});
//FITUR USER

router.post('/login', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var serviceLogin = await service.login(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.send(serviceLogin);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/getPagePegawai', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var servicegetPagePegawai = await service.getPagePegawai(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.send(servicegetPagePegawai);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/createUser', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var servicecreateUser = await service.createUser(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.send(servicecreateUser);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/getUserById', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var serviceGetUserById = await service.getUserById(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.send(serviceGetUserById);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/updateUser', uploadPhoto.single('userPhoto'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    if (req.file!=undefined) {
        var serviceUpdateUser = await service.updateUser(req.body, req.file.filename)
    } else {
        var serviceUpdateUser = await service.updateUser(req.body, undefined)
    }
    res.send(serviceUpdateUser)
    res.end(); 
})

//FITUR IDE

router.post('/getPageIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceGetPageIde = await service.getPageIde(req.body)
    res.send(serviceGetPageIde);
    res.end();    
});

router.post('/submitNewIde', uploadAttachmentsIde.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceSubmitNewIde = await service.submitNewIde(req.body,req.files)
    res.send(serviceSubmitNewIde);
    res.end();    
});

router.post('/selectMentorByRso', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceSelectMentorByRso = await service.selectMentorByRso(req.body)
    res.send(serviceSelectMentorByRso);
    res.end();    
});

router.post('/rsoOrForumIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceRsoOrForumIde = await service.rsoOrForumIde(req.body)
    res.send(serviceRsoOrForumIde);
    res.end();    
});

router.post('/getPageForumIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceGetPageForumIde = await service.getPageForumIde(req.body)
    res.send(serviceGetPageForumIde);
    res.end();    
});

router.post('/submitKomenIde', uploadAttachmentsChatIde.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceSubmitKomenIde = await service.submitKomenIde(req.body,req.files)
    res.send(serviceSubmitKomenIde);
    res.end();    
});

router.post('/changeProgressIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceChangeProgressIde = await service.changeProgressIde(req.body,req.files)
    res.send(serviceChangeProgressIde);
    res.end();    
});

router.post('/updateStatusIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var updateStatusIde = await service.updateStatusIde(req.body)
    res.send(updateStatusIde);
    res.end();
});

router.post('/updateMembersIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var updateStatusIde = await service.updateMembersIde(req.body)
    res.send(updateStatusIde);
    res.end();
});

//FITUR SHARING SEASON

router.post('/getPageSharing', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceGetPageSharing = await service.getPageSharing(req.body)
    res.send(serviceGetPageSharing);
    res.end();    
});

router.post('/submitNewSharing', uploadAttachmentsSharing.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceSubmitNewSharing = await service.submitNewSharing(req.body,req.files)
    res.send(serviceSubmitNewSharing);
    res.end();    
});

router.post('/selectJadwalSharingByAdmin', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceSelectJadwalSharingByAdmin = await service.selectJadwalSharingByAdmin(req.body)
    res.send(serviceSelectJadwalSharingByAdmin);
    res.end();    
});

router.post('/getPageForumSharing', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceGetPageForumSharing = await service.getPageForumSharing(req.body)
    res.send(serviceGetPageForumSharing);
    res.end();    
});

router.post('/submitKomenSharing', uploadAttachmentsChatSharing.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceSubmitKomenSharing = await service.submitKomenSharing(req.body,req.files)
    res.send(serviceSubmitKomenSharing);
    res.end();    
});

router.post('/updateStatusSharing', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var updateStatusSharing = await service.updateStatusSharing(req.body)
    res.send(updateStatusSharing);
    res.end();
});

router.post('/updateMembersSharing', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var updateStatusSharing = await service.updateMembersSharing(req.body)
    res.send(updateStatusSharing);
    res.end();
});

//FITUR EBOOK

router.post('/getPageEbook', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceGetPageEbook = await service.getPageEbook(req.body)
    res.send(serviceGetPageEbook)
    res.end(); 
})


router.post('/uploadEbook', uploadEbook.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceUploadEbook = await service.uploadEbook(req.body, req.files)
    res.send(serviceUploadEbook)
    res.end(); 
})

router.get('/downloadEbook/:ebookName', function(req, res){
  const file = 'assets/ebook/'+req.params.ebookName;
  res.download(file);
});

router.get('/downloadAttachmentIde/:attachment', function(req, res){
  const file = 'assets/attachments-ide/'+req.params.attachment;
  res.download(file);
});

router.get('/downloadAttachmentSharing/:attachment', function(req, res){
  const file = 'assets/attachments-sharing/'+req.params.attachment;
  res.download(file);
});

router.get('/downloadAttachmentChatIde/:attachment', function(req, res){
  const file = 'assets/attachments-chat-ide/'+req.params.attachment;
  res.download(file);
});

router.get('/downloadAttachmentChatSharing/:attachment', function(req, res){
  const file = 'assets/attachments-chat-sharing/'+req.params.attachment;
  res.download(file);
});

//FITUR HISTORY

router.post('/getPageHistoryIde', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    var serviceGetPageHistoryIde = await service.getPageHistoryIde(req.body)
    res.send(serviceGetPageHistoryIde)
    res.end(); 
})

//FITUR SETTINGS

router.post('/updateSettings', uploadBackgroundLogin.single('backgroundLoginImg'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    if (req.file!=undefined) {
        var serviceUpdateSettings = await service.updateSettings(req.body, req.file.filename)
    } else {
        var serviceUpdateSettings = await service.updateSettings(req.body, undefined)
    }
    res.send(serviceUpdateSettings)
    res.end(); 
})

//FITUR NOTIFICATIONS

router.post('/countNotif', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var servicecountNotif = await service.countNotif(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.send(servicecountNotif);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/getPageNotif', async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var servicegetPageNotif = await service.getPageNotif(req.body)
        res.setHeader('Content-Type', 'application/json');
        res.send(servicegetPageNotif);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/insertNotif', uploadAttachmentsNotif.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var serviceinsertNotif = await service.insertNotif(req.body,req.files)
        res.setHeader('Content-Type', 'application/json');
        res.send(serviceinsertNotif);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.post('/updateNotif', uploadAttachmentsNotif.array('attachments'), async function (req, res, next) {
    await service.validateToken(req.headers.authorization, res)
    try {
        var serviceupdateNotif = await service.updateNotif(req.body,req.files)
        res.setHeader('Content-Type', 'application/json');
        res.send(serviceupdateNotif);
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    }
})

router.get('/downloadAttachmentNotif/:attachment', function(req, res){
    const file = 'assets/attachments-notif/'+req.params.attachment;
    res.download(file);
  });

module.exports = router