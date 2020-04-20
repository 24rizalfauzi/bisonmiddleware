-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.39-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for procedure bison_db.procChangeProgressIde
DELIMITER //
CREATE PROCEDURE `procChangeProgressIde`(
	IN `reqIdeId` INT
,
	IN `reqProgressIde` INT


)
BEGIN
	UPDATE tbl_ide set tbl_ide.progress=reqProgressIde where tbl_ide.id=reqIdeId;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procDeleteMembersIdeByIdeId
DELIMITER //
CREATE PROCEDURE `procDeleteMembersIdeByIdeId`(
	IN `reqIdeId` INT







)
BEGIN
	delete from tbl_group_ide where tbl_group_ide.ide_id=reqIdeId AND tbl_group_ide.member_id IS NOT NULL;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procDeleteMembersSharingBySharingId
DELIMITER //
CREATE PROCEDURE `procDeleteMembersSharingBySharingId`(
	IN `reqSharingId` INT


)
BEGIN
	delete from tbl_group_sharing where tbl_group_sharing.sharing_id=reqSharingId AND tbl_group_sharing.member_id IS NOT NULL;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetAdmins
DELIMITER //
CREATE PROCEDURE `procGetAdmins`()
BEGIN
	select * from tbl_users where role='admin';
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetChatIde
DELIMITER //
CREATE PROCEDURE `procGetChatIde`(
	IN `reqIdeId` INT











)
BEGIN
	SELECT
		tbl_users.id AS userId,
		tbl_users.name AS userName,
		tbl_users.photo AS userPhoto,
		tbl_forum_ide.komen AS komen,
		tbl_forum_ide.attachments AS attachments,
		tbl_forum_ide.created_date AS createdDate
 	FROM tbl_forum_ide
	LEFT JOIN tbl_users
	ON tbl_users.id = tbl_forum_ide.user_id
	LEFT JOIN tbl_ide
	ON tbl_ide.id = tbl_forum_ide.ide_id
	WHERE tbl_forum_ide.ide_id = reqIdeId
	ORDER BY tbl_forum_ide.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetChatSharing
DELIMITER //
CREATE PROCEDURE `procGetChatSharing`(
	IN `reqSharingId` INT


)
BEGIN
	SELECT
		tbl_users.id AS userId,
		tbl_users.name AS userName,
		tbl_users.photo AS userPhoto,
		tbl_forum_sharing.komen AS komen,
		tbl_forum_sharing.attachments AS attachments,
		tbl_forum_sharing.created_date AS createdDate
 	FROM tbl_forum_sharing
	LEFT JOIN tbl_users
	ON tbl_users.id = tbl_forum_sharing.user_id
	LEFT JOIN tbl_sharing
	ON tbl_sharing.id = tbl_forum_sharing.sharing_id
	WHERE tbl_forum_sharing.sharing_id = reqSharingId
	ORDER BY tbl_forum_sharing.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetIdeById
DELIMITER //
CREATE PROCEDURE `procGetIdeById`(
	IN `reqIdeId` INT







)
BEGIN
	SELECT  
	        tbl_group_ide.id AS groupIdeId,
	        tbl_group_ide.ide_id AS ideId,
	        tbl_group_ide.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_ide.member_id) AS memberId,
	        tbl_group_ide.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_ide.judul,
	        tbl_ide.latar_belakang,
	        tbl_ide.tujuan,
	        tbl_ide.cost_benefit_analysis AS costBenefitAnalysis,
	        tbl_ide.attachments AS attachments,
	        tbl_ide.created_date AS createdDate,
	        tbl_ide.updated_date AS updatedDate,
	        tbl_ide.`status` AS `status`,
	        tbl_ide.progress AS progress
	FROM tbl_group_ide
	LEFT JOIN tbl_ide
	ON tbl_ide.id = tbl_group_ide.ide_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_ide.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_ide.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_ide.member_id)
	WHERE tbl_group_ide.ide_id = reqIdeId
	GROUP BY tbl_ide.id,tbl_group_ide.applicant_id
	ORDER BY tbl_ide.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetMemberByIdeId
DELIMITER //
CREATE PROCEDURE `procGetMemberByIdeId`(
	IN `reqIdeId` INT







)
BEGIN
	select
		GROUP_CONCAT(tbl_users.id) AS memberId,
		GROUP_CONCAT(tbl_users.name) AS memberName
	from tbl_group_ide
	LEFT JOIN tbl_users
	ON tbl_users.id = tbl_group_ide.member_id
	where tbl_group_ide.ide_id=reqIdeId
	group by tbl_group_ide.ide_id;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetMemberBySharingId
DELIMITER //
CREATE PROCEDURE `procGetMemberBySharingId`(
	IN `reqSharingId` INT

)
BEGIN
	select
		GROUP_CONCAT(tbl_users.id) AS memberId,
		GROUP_CONCAT(tbl_users.name) AS memberName
	from tbl_group_sharing
	LEFT JOIN tbl_users
	ON tbl_users.id = tbl_group_sharing.member_id
	where tbl_group_sharing.sharing_id=reqSharingId
	group by tbl_group_sharing.sharing_id;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetMentors
DELIMITER //
CREATE PROCEDURE `procGetMentors`()
BEGIN
	select * from tbl_users where role = "mentor";
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageEbook
DELIMITER //
CREATE PROCEDURE `procGetPageEbook`()
BEGIN
	select 
		tbl_users.id as uploaderId,
		tbl_users.name as uploaderName,
		tbl_ebook.attachments as attachments,
		tbl_ebook.created_date as createdDate,
		tbl_ebook.`status` as `status`	
	from tbl_ebook
	left join tbl_users
	ON tbl_users.id = tbl_ebook.uploader_id;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageHistoryIde
DELIMITER //
CREATE PROCEDURE `procGetPageHistoryIde`(
	IN `reqUserId` INT







)
BEGIN
	SELECT  
	        tbl_group_ide.id AS groupIdeId,
	        tbl_group_ide.ide_id AS ideId,
	        tbl_group_ide.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_ide.member_id) AS memberId,
	        tbl_group_ide.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_ide.judul,
	        tbl_ide.created_date AS createdDate,
	        tbl_ide.updated_date AS updatedDate,
	        tbl_ide.`status` AS `status`
	FROM tbl_group_ide
	LEFT JOIN tbl_ide
	ON tbl_ide.id = tbl_group_ide.ide_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_ide.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_ide.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_ide.member_id)
	WHERE (tbl_group_ide.applicant_id = reqUserId OR tbl_group_ide.member_id = reqUserId OR tbl_group_ide.mentor_id = reqUserId) AND (tbl_ide.`status`='disetujui' OR tbl_ide.`status`='ditolak')
	GROUP BY tbl_ide.id,tbl_group_ide.applicant_id
	ORDER BY tbl_ide.updated_date desc
	LIMIT 1000;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageHistoryIdeAdmin
DELIMITER //
CREATE PROCEDURE `procGetPageHistoryIdeAdmin`()
BEGIN
	SELECT  
	        tbl_group_ide.id AS groupIdeId,
	        tbl_group_ide.ide_id AS ideId,
	        tbl_group_ide.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_ide.member_id) AS memberId,
	        tbl_group_ide.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_ide.judul,
	        tbl_ide.created_date AS createdDate,
	        tbl_ide.updated_date AS updatedDate,
	        tbl_ide.`status` AS `status`
	FROM tbl_group_ide
	LEFT JOIN tbl_ide
	ON tbl_ide.id = tbl_group_ide.ide_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_ide.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_ide.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_ide.member_id)
	WHERE tbl_ide.`status`='disetujui' OR tbl_ide.`status`='ditolak'
	GROUP BY tbl_ide.id,tbl_group_ide.applicant_id
	ORDER BY tbl_ide.updated_date desc
	LIMIT 1000;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageHistorySharing
DELIMITER //
CREATE PROCEDURE `procGetPageHistorySharing`(
	IN `reqUserId` INT
)
BEGIN
	SELECT  
	        tbl_group_sharing.id AS groupSharingId,
	        tbl_group_sharing.sharing_id AS sharingId,
	        tbl_group_sharing.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_sharing.member_id) AS memberId,
	        tbl_group_sharing.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_sharing.judul,
	        tbl_sharing.created_date AS createdDate,
	        tbl_sharing.updated_date AS updatedDate,
	        tbl_sharing.`status` AS `status`
	FROM tbl_group_sharing
	LEFT JOIN tbl_sharing
	ON tbl_sharing.id = tbl_group_sharing.sharing_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_sharing.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_sharing.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_sharing.member_id)
	WHERE (tbl_group_sharing.applicant_id = reqUserId OR tbl_group_sharing.member_id = reqUserId OR tbl_group_sharing.mentor_id = reqUserId) AND (tbl_sharing.`status`='ditutup')
	GROUP BY tbl_sharing.id,tbl_group_sharing.applicant_id
	ORDER BY tbl_sharing.updated_date desc
	LIMIT 1000;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageHistorySharingAdmin
DELIMITER //
CREATE PROCEDURE `procGetPageHistorySharingAdmin`()
BEGIN
	SELECT  
	        tbl_group_sharing.id AS groupSharingId,
	        tbl_group_sharing.sharing_id AS sharingId,
	        tbl_group_sharing.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_sharing.member_id) AS memberId,
	        tbl_group_sharing.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_sharing.judul,
	        tbl_sharing.created_date AS createdDate,
	        tbl_sharing.updated_date AS updatedDate,
	        tbl_sharing.`status` AS `status`
	FROM tbl_group_sharing
	LEFT JOIN tbl_sharing
	ON tbl_sharing.id = tbl_group_sharing.sharing_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_sharing.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_sharing.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_sharing.member_id)
	WHERE tbl_sharing.`status`='ditutup'
	GROUP BY tbl_sharing.id,tbl_group_sharing.applicant_id
	ORDER BY tbl_sharing.updated_date desc
	LIMIT 1000;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageIdeRso
DELIMITER //
CREATE PROCEDURE `procGetPageIdeRso`()
BEGIN
	SELECT  
	        tbl_group_ide.id AS groupIdeId,
	        tbl_group_ide.ide_id AS ideId,
	        tbl_group_ide.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_ide.member_id) AS memberId,
	        tbl_group_ide.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_ide.judul,
	        tbl_ide.latar_belakang,
	        tbl_ide.tujuan,
	        tbl_ide.progress,
	        tbl_ide.attachments,
	        tbl_ide.created_date AS createdDate,
	        tbl_ide.updated_date AS updatedDate,
	        tbl_ide.`status` AS `status`
	FROM tbl_group_ide
	LEFT JOIN tbl_ide
	ON tbl_ide.id = tbl_group_ide.ide_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_ide.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_ide.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_ide.member_id)
	WHERE tbl_ide.`status`='menunggu rso'
	GROUP BY tbl_ide.id,tbl_group_ide.applicant_id
	ORDER BY tbl_ide.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageIdeUser
DELIMITER //
CREATE PROCEDURE `procGetPageIdeUser`(
	IN `reqUserId` INT






















)
BEGIN
	SELECT  
	        tbl_group_ide.id AS groupIdeId,
	        tbl_group_ide.ide_id AS ideId,
	        tbl_group_ide.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_ide.member_id) AS memberId,
	        tbl_group_ide.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_ide.judul,
	        tbl_ide.latar_belakang,
	        tbl_ide.tujuan,
	        tbl_ide.progress,
	        tbl_ide.attachments,
	        tbl_ide.created_date AS createdDate,
	        tbl_ide.updated_date AS updatedDate,
	        tbl_ide.`status` AS `status`,
	        tbl_ide.progress AS progress
	FROM tbl_group_ide
	LEFT JOIN tbl_ide
	ON tbl_ide.id = tbl_group_ide.ide_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_ide.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_ide.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_ide.member_id)
	WHERE (tbl_group_ide.applicant_id = reqUserId OR tbl_group_ide.member_id = reqUserId OR tbl_group_ide.mentor_id = reqUserId) AND (tbl_ide.`status`!='disetujui' OR tbl_ide.`status`!='ditolak')
	GROUP BY tbl_ide.id,tbl_group_ide.applicant_id
	ORDER BY tbl_ide.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageSharingAdmin
DELIMITER //
CREATE PROCEDURE `procGetPageSharingAdmin`()
BEGIN
	SELECT  
	        tbl_group_sharing.id AS groupSharingId,
	        tbl_group_sharing.sharing_id AS sharingId,
	        tbl_group_sharing.applicant_id AS applicantid,
	        GROUP_CONCAT(tbl_group_sharing.member_id) AS memberid,
	        tbl_group_sharing.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_sharing.judul,
	        tbl_sharing.created_date AS createdDate,
	        tbl_sharing.updated_date AS updatedDate,
	        tbl_sharing.`status` AS `status`,
	        tbl_sharing.jadwal
	FROM tbl_group_sharing
	LEFT JOIN tbl_sharing
	ON tbl_sharing.id = tbl_group_sharing.sharing_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_sharing.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_sharing.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_sharing.member_id)
	WHERE tbl_sharing.`status`='menunggu jadwal'
	GROUP BY tbl_sharing.id,tbl_group_sharing.applicant_id
	ORDER BY tbl_sharing.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPageSharingUser
DELIMITER //
CREATE PROCEDURE `procGetPageSharingUser`(
	IN `reqUserId` INT


)
BEGIN
	SELECT  
	        tbl_group_sharing.id AS groupSharingId,
	        tbl_group_sharing.sharing_id AS sharingId,
	        tbl_group_sharing.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_sharing.member_id) AS memberId,
	        tbl_group_sharing.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_sharing.judul,
	        tbl_sharing.created_date AS createdDate,
	        tbl_sharing.updated_date AS updatedDate,
	        tbl_sharing.`status` AS `status`,
	        tbl_sharing.progress AS progress,
	        tbl_sharing.jadwal
	FROM tbl_group_sharing
	LEFT JOIN tbl_sharing
	ON tbl_sharing.id = tbl_group_sharing.sharing_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_sharing.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_sharing.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_sharing.member_id)
	WHERE (tbl_group_sharing.applicant_id = reqUserId OR tbl_group_sharing.member_id = reqUserId OR tbl_group_sharing.mentor_id = reqUserId) AND (tbl_sharing.`status`!='ditutup')
	GROUP BY tbl_sharing.id,tbl_group_sharing.applicant_id
	ORDER BY tbl_sharing.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPushEmail
DELIMITER //
CREATE PROCEDURE `procGetPushEmail`()
BEGIN
	select *,tbl_push_email.id as emailId from tbl_push_email
	LEFT JOIN tbl_users ON tbl_users.id = tbl_push_email.user_id
	where tbl_push_email.send="false" LIMIT 100;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetPushNotif
DELIMITER //
CREATE PROCEDURE `procGetPushNotif`()
BEGIN
	select *,tbl_push_notif.id as notifId from tbl_push_notif
	LEFT JOIN tbl_users ON tbl_users.id = tbl_push_notif.user_id
	where tbl_push_notif.send="false" LIMIT 100;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetSharingById
DELIMITER //
CREATE PROCEDURE `procGetSharingById`(
	IN `reqSharingId` INT

)
BEGIN
	SELECT  
	        tbl_group_sharing.id AS groupSharingId,
	        tbl_group_sharing.sharing_id AS sharingId,
	        tbl_group_sharing.applicant_id AS applicantId,
	        GROUP_CONCAT(tbl_group_sharing.member_id) AS memberId,
	        tbl_group_sharing.mentor_id AS mentorId,
	        t_u_mentor.name AS mentorName,
	        t_u_applicant.name AS applicantName,
	        GROUP_CONCAT(t_u_member.name) AS memberName,
	        tbl_sharing.judul,
	        tbl_sharing.jadwal,
	        tbl_sharing.created_date AS createdDate,
	        tbl_sharing.updated_date AS updatedDate,
	        tbl_sharing.`status` AS `status`,
	        tbl_sharing.progress AS progress
	FROM tbl_group_sharing
	LEFT JOIN tbl_sharing
	ON tbl_sharing.id = tbl_group_sharing.sharing_id
	LEFT JOIN tbl_users t_u_mentor
	ON t_u_mentor.id = tbl_group_sharing.mentor_id
	LEFT JOIN tbl_users t_u_applicant
	ON t_u_applicant.id = tbl_group_sharing.applicant_id
	LEFT JOIN tbl_users t_u_member
	ON t_u_member.id IN (tbl_group_sharing.member_id)
	WHERE tbl_group_sharing.sharing_id = reqSharingId
	GROUP BY tbl_sharing.id,tbl_group_sharing.applicant_id
	ORDER BY tbl_sharing.updated_date desc;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetUserById
DELIMITER //
CREATE PROCEDURE `procGetUserById`(
	IN `reqUserId` VARCHAR(50)








)
BEGIN
	SELECT
		tbl_users.id,
		tbl_users.nip,
		tbl_users.name,
		tbl_users.email,
		tbl_users.photo,
		tbl_users.`status`,
		tbl_users.role,
		tbl_users.created_date,
		tbl_users.updated_date 
	from tbl_users	where tbl_users.id=reqUserId limit 1;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetUserByNip
DELIMITER //
CREATE PROCEDURE `procGetUserByNip`(
	IN `reqNip` VARCHAR(50)


)
BEGIN
	SELECT * from tbl_users where tbl_users.nip=reqNip limit 1;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetUsers
DELIMITER //
CREATE PROCEDURE `procGetUsers`()
BEGIN
	select * from tbl_users;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procGetUsersByRole
DELIMITER //
CREATE PROCEDURE `procGetUsersByRole`(
	IN `reqUserRole` VARCHAR(50)

)
BEGIN
	select
		tbl_users.id,
		tbl_users.nip,
		tbl_users.name,
		tbl_users.email,
		tbl_users.photo,
		tbl_users.`status`,
		tbl_users.role,
		tbl_users.created_date,
		tbl_users.updated_date
	from tbl_users where tbl_users.role = reqUserRole;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procInsertEbook
DELIMITER //
CREATE PROCEDURE `procInsertEbook`(
	IN `uploaderId` INT,
	IN `ebookName` TEXT
)
BEGIN
	INSERT INTO tbl_ebook (tbl_ebook.uploader_id, tbl_ebook.attachments) VALUES (uploaderId, ebookName);
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procInsertMemberIde
DELIMITER //
CREATE PROCEDURE `procInsertMemberIde`(
	IN `reqIdeId` INT,
	IN `reqApplicantId` INT,
	IN `reqMemberId` INT,
	IN `reqMentorId` INT


)
BEGIN
	insert into tbl_group_ide (ide_id,applicant_id,member_id,mentor_id) VALUES (reqIdeId,reqApplicantId,reqMemberId,reqMentorId);
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procInsertMemberSharing
DELIMITER //
CREATE PROCEDURE `procInsertMemberSharing`(
	IN `reqSharingId` INT,
	IN `reqApplicantId` INT,
	IN `reqMemberId` INT,
	IN `reqMentorId` INT
)
BEGIN
	insert into tbl_group_sharing (sharing_id,applicant_id,member_id,mentor_id) VALUES (reqSharingId,reqApplicantId,reqMemberId,reqMentorId);
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procInsertPushEmail
DELIMITER //
CREATE PROCEDURE `procInsertPushEmail`(
	IN `reqUserId` INT,
	IN `reqSubject` TEXT,
	IN `reqText` TEXT,
	IN `reqHtml` TEXT,
	IN `reqAttachments` TEXT

)
BEGIN
	insert into tbl_push_email (
		tbl_push_email.user_id,
		tbl_push_email.subject,
		tbl_push_email.text,
		tbl_push_email.html,
		tbl_push_email.attachments
	)
	values(
		reqUserId,
		reqSubject,
		reqText,
		reqHtml,
		reqAttachments
	);
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procLastActiveUser
DELIMITER //
CREATE PROCEDURE `procLastActiveUser`(
	IN `reqActiveUserId` INT
)
BEGIN
	UPDATE `tbl_users` SET updated_date=NOW() WHERE id=reqActiveUserId;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procSelectJadwalSharingByAdmin
DELIMITER //
CREATE PROCEDURE `procSelectJadwalSharingByAdmin`(
	IN `reqSharingId` INT,
	IN `reqJadwal` TIMESTAMP
)
BEGIN
	UPDATE tbl_sharing SET jadwal=reqJadwal,status='diskusi' where id = reqSharingId;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procSelectMentorByRso
DELIMITER //
CREATE PROCEDURE `procSelectMentorByRso`(
	IN `reqIdeId` INT
,
	IN `reqMentorId` INT

)
BEGIN
	START TRANSACTION;
	UPDATE tbl_ide set tbl_ide.`status`='menunggu mentor' where tbl_ide.id=reqIdeId;
	UPDATE tbl_group_ide set tbl_group_ide.mentor_id=reqMentorId where tbl_group_ide.ide_id=reqIdeId;
	COMMIT; 
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procSubmitKomenIde
DELIMITER //
CREATE PROCEDURE `procSubmitKomenIde`(
	IN `reqKomen` TEXT,
	IN `reqUserId` INT,
	IN `reqIdeId` INT


,
	IN `reqAttachments` TEXT
)
BEGIN
	insert into tbl_forum_ide(komen,user_id,ide_id,attachments) values (reqKomen,reqUserId,reqIdeId,reqAttachments);
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procSubmitKomenSharing
DELIMITER //
CREATE PROCEDURE `procSubmitKomenSharing`(
	IN `reqKomen` TEXT,
	IN `reqUserId` INT,
	IN `reqSharingId` INT,
	IN `reqAttachments` TEXT
)
BEGIN
	insert into tbl_forum_sharing(komen,user_id,sharing_id,attachments) values (reqKomen,reqUserId,reqSharingId,reqAttachments);
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procSubmitNewIde
DELIMITER //
CREATE PROCEDURE `procSubmitNewIde`(
	IN `reqUserId` INT

,
	IN `reqJudul` VARCHAR(50),
	IN `reqlatar_belakang` TEXT,
	IN `reqTujuan` TEXT,
	IN `reqCostBenefitAnalysis` TEXT,
	IN `reqAttachments` TEXT





)
    DETERMINISTIC
BEGIN
   START TRANSACTION;
	INSERT INTO tbl_ide(judul,latar_belakang,tujuan,cost_benefit_analysis,tbl_ide.attachments) VALUES(reqJudul,reqlatar_belakang,reqTujuan,reqCostBenefitAnalysis,reqAttachments);
	SET @last_id_in_table1 = LAST_INSERT_ID();
	INSERT INTO tbl_group_ide(ide_id,applicant_id) VALUES(@last_id_in_table1,reqUserId);
	COMMIT; 
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procSubmitNewSharing
DELIMITER //
CREATE PROCEDURE `procSubmitNewSharing`(
	IN `reqUserId` INT,
	IN `reqJudul` VARCHAR(50),
	IN `reqMentorId` INT,
	IN `reqAttachments` TEXT







)
BEGIN
   START TRANSACTION;
	INSERT INTO tbl_sharing(judul,tbl_sharing.attachments) VALUES(reqJudul,reqAttachments);
	SET @last_id_in_table1 = LAST_INSERT_ID();
	INSERT INTO tbl_group_sharing(sharing_id,tbl_group_sharing.mentor_id,applicant_id) VALUES(@last_id_in_table1,reqMentorId,reqUserId);
	select @last_id_in_table1 as sharingId;
	COMMIT; 
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procUpdateSendPushEmail
DELIMITER //
CREATE PROCEDURE `procUpdateSendPushEmail`(
	IN `reqPushEmailId` INT,
	IN `reqPushEmailSend` VARCHAR(50)
)
BEGIN
	update tbl_push_email set tbl_push_email.send=reqPushEmailSend where tbl_push_email.id=reqPushEmailId;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procUpdateSendPushNotif
DELIMITER //
CREATE PROCEDURE `procUpdateSendPushNotif`(
	IN `reqPushNotifId` INT,
	IN `reqPushNotifSend` VARCHAR(50)
)
BEGIN
	update tbl_push_notif set tbl_push_notif.send=reqPushNotifSend where tbl_push_notif.id=reqPushNotifId;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procUpdateStatusIde
DELIMITER //
CREATE PROCEDURE `procUpdateStatusIde`(
	IN `reqIdeId` INT,
	IN `reqStatusIde` VARCHAR(50)
,
	IN `mentorId` INT

)
BEGIN
	START TRANSACTION;
	UPDATE tbl_ide set tbl_ide.`status`=reqStatusIde where tbl_ide.id=reqIdeId;
	UPDATE tbl_group_ide set tbl_group_ide.mentor_id=mentorId where tbl_group_ide.ide_id=reqIdeId;
	COMMIT;
END//
DELIMITER ;

-- Dumping structure for procedure bison_db.procUpdateStatusSharing
DELIMITER //
CREATE PROCEDURE `procUpdateStatusSharing`(
	IN `reqSharingId` INT,
	IN `reqSharingStatus` VARCHAR(50)
)
BEGIN
	START TRANSACTION;
	UPDATE tbl_sharing set tbl_sharing.`status`=reqSharingStatus where tbl_sharing.id=reqSharingId;
	COMMIT;
END//
DELIMITER ;

-- Dumping structure for table bison_db.tbl_ebook
CREATE TABLE IF NOT EXISTS `tbl_ebook` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uploader_id` int(11) NOT NULL DEFAULT '0',
  `attachments` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `FK_tbl_ebook_tbl_users` (`uploader_id`),
  CONSTRAINT `FK_tbl_ebook_tbl_users` FOREIGN KEY (`uploader_id`) REFERENCES `tbl_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table bison_db.tbl_ebook: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_ebook` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_ebook` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_forum_ide
CREATE TABLE IF NOT EXISTS `tbl_forum_ide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ide_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `komen` text NOT NULL,
  `attachments` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table bison_db.tbl_forum_ide: ~1 rows (approximately)
/*!40000 ALTER TABLE `tbl_forum_ide` DISABLE KEYS */;
INSERT INTO `tbl_forum_ide` (`id`, `ide_id`, `user_id`, `komen`, `attachments`, `created_date`, `updated_date`) VALUES
	(1, 78, 11, 'assalamualaikum', '', '2020-03-18 13:46:55', '2020-03-18 13:46:55');
/*!40000 ALTER TABLE `tbl_forum_ide` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_forum_sharing
CREATE TABLE IF NOT EXISTS `tbl_forum_sharing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sharing_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `komen` text NOT NULL,
  `attachments` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Dumping data for table bison_db.tbl_forum_sharing: ~0 rows (approximately)
/*!40000 ALTER TABLE `tbl_forum_sharing` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_forum_sharing` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_group_ide
CREATE TABLE IF NOT EXISTS `tbl_group_ide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ide_id` int(11) NOT NULL,
  `applicant_id` int(11) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `mentor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tbl_group_ide_tbl_ide` (`ide_id`),
  KEY `FK_tbl_group_ide_tbl_users` (`applicant_id`),
  CONSTRAINT `FK_tbl_group_ide_tbl_ide` FOREIGN KEY (`ide_id`) REFERENCES `tbl_ide` (`id`),
  CONSTRAINT `FK_tbl_group_ide_tbl_users` FOREIGN KEY (`applicant_id`) REFERENCES `tbl_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=latin1;

-- Dumping data for table bison_db.tbl_group_ide: ~4 rows (approximately)
/*!40000 ALTER TABLE `tbl_group_ide` DISABLE KEYS */;
INSERT INTO `tbl_group_ide` (`id`, `ide_id`, `applicant_id`, `member_id`, `mentor_id`) VALUES
	(125, 75, 11, NULL, 21),
	(126, 76, 11, NULL, NULL),
	(127, 77, 11, NULL, 21),
	(128, 78, 11, NULL, 21);
/*!40000 ALTER TABLE `tbl_group_ide` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_group_sharing
CREATE TABLE IF NOT EXISTS `tbl_group_sharing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sharing_id` int(11) NOT NULL,
  `applicant_id` int(11) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `mentor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tbl_group_ide_tbl_ide` (`sharing_id`),
  KEY `FK_tbl_group_ide_tbl_users` (`applicant_id`),
  CONSTRAINT `tbl_group_sharing_ibfk_1` FOREIGN KEY (`sharing_id`) REFERENCES `tbl_sharing` (`id`),
  CONSTRAINT `tbl_group_sharing_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `tbl_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Dumping data for table bison_db.tbl_group_sharing: ~9 rows (approximately)
/*!40000 ALTER TABLE `tbl_group_sharing` DISABLE KEYS */;
INSERT INTO `tbl_group_sharing` (`id`, `sharing_id`, `applicant_id`, `member_id`, `mentor_id`) VALUES
	(113, 62, 11, NULL, 21),
	(114, 63, 11, NULL, 21),
	(115, 64, 11, NULL, 21),
	(116, 65, 11, NULL, 21),
	(117, 66, 11, NULL, 21),
	(118, 67, 11, NULL, 21),
	(119, 68, 11, NULL, 21),
	(120, 69, 11, NULL, 21),
	(121, 70, 11, NULL, 21);
/*!40000 ALTER TABLE `tbl_group_sharing` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_ide
CREATE TABLE IF NOT EXISTS `tbl_ide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(50) NOT NULL DEFAULT '',
  `latar_belakang` text NOT NULL,
  `tujuan` text NOT NULL,
  `cost_benefit_analysis` text NOT NULL,
  `attachments` text NOT NULL,
  `progress` int(11) NOT NULL DEFAULT '0',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'menunggu rso',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=latin1;

-- Dumping data for table bison_db.tbl_ide: ~4 rows (approximately)
/*!40000 ALTER TABLE `tbl_ide` DISABLE KEYS */;
INSERT INTO `tbl_ide` (`id`, `judul`, `latar_belakang`, `tujuan`, `cost_benefit_analysis`, `attachments`, `progress`, `created_date`, `updated_date`, `status`) VALUES
	(75, 'tes1', 'tes1', 'tes1', 'cst1', '', 100, '2020-02-28 09:03:08', '2020-03-18 10:48:24', 'menunggu mentor'),
	(76, 'tes2', 'tes2', 'tes2', 'cst2', '', 0, '2020-02-28 09:03:18', '2020-03-18 10:48:27', 'menunggu rso'),
	(77, 'tes3', 'tes3', 'tes3', 'cst3', '', 0, '2020-02-28 09:03:38', '2020-03-18 10:48:30', 'menunggu mentor'),
	(78, 'PLTS Baru', 'Go Green', 'Go Green', 'Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green.', 'bsi-ide-mswb-1584506881105-arsitektur aplikasi.jpeg,bsi-ide-03so-1584506881106-Capture.PNG,', 100, '2020-03-18 11:48:01', '2020-03-18 13:47:43', 'diskusi');
/*!40000 ALTER TABLE `tbl_ide` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_push_email
CREATE TABLE IF NOT EXISTS `tbl_push_email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `subject` text,
  `text` text,
  `html` text,
  `attachments` text,
  `send` varchar(50) NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  KEY `FK_tbl_push_email_tbl_users` (`user_id`),
  CONSTRAINT `tbl_push_email_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Dumping data for table bison_db.tbl_push_email: ~12 rows (approximately)
/*!40000 ALTER TABLE `tbl_push_email` DISABLE KEYS */;
INSERT INTO `tbl_push_email` (`id`, `user_id`, `subject`, `text`, `html`, `attachments`, `send`) VALUES
	(4, 21, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : tes1, latar_belakang : tes1, Tujuan : tes1, Pengaju : Reza Adisetiaaa', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : tes1, latar_belakang : tes1, Tujuan : tes1, Pengaju : Reza Adisetiaaa', 'undefined', 'true'),
	(5, 31, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : tes1, latar_belakang : tes1, Tujuan : tes1, Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : tes1, latar_belakang : tes1, Tujuan : tes1, Pengaju : Reza Adisetiaaa', 'undefined', 'true'),
	(6, 32, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : tes1, latar_belakang : tes1, Tujuan : tes1, Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : tes1, latar_belakang : tes1, Tujuan : tes1, Pengaju : Reza Adisetiaaa', 'undefined', 'true'),
	(7, 21, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green., Pengaju : Reza Adisetiaaa', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green., Pengaju : Reza Adisetiaaa', 'undefined', 'false'),
	(8, 31, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green., Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green., Pengaju : Reza Adisetiaaa', 'undefined', 'false'),
	(9, 32, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green., Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Dengan biaya pembangunan 20jt, hemat pengeluaran listri 100jt per tahun nya. Plus go green., Pengaju : Reza Adisetiaaa', 'undefined', 'false'),
	(10, 21, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'undefined', 'false'),
	(11, 31, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'undefined', 'false'),
	(12, 32, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'undefined', 'false'),
	(13, 21, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'Anda ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'bsi-ide-mswb-1584506881105-arsitektur aplikasi.jpeg,bsi-ide-03so-1584506881106-Capture.PNG,', 'false'),
	(14, 31, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'bsi-ide-mswb-1584506881105-arsitektur aplikasi.jpeg,bsi-ide-03so-1584506881106-Capture.PNG,', 'false'),
	(15, 32, 'Pilih Mentor Ide Oleh RSO - Bali Smart Innovation', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'Ayah Budi ditunjuk oleh RSO untuk menjadi mentor. Judul : PLTS Baru, Latar Belakang : Go Green, Tujuan : Go Green, Pengaju : Reza Adisetiaaa', 'bsi-ide-mswb-1584506881105-arsitektur aplikasi.jpeg,bsi-ide-03so-1584506881106-Capture.PNG,', 'false');
/*!40000 ALTER TABLE `tbl_push_email` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_push_notif
CREATE TABLE IF NOT EXISTS `tbl_push_notif` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `token` text NOT NULL,
  `message` text NOT NULL,
  `send` varchar(50) NOT NULL DEFAULT 'false',
  PRIMARY KEY (`id`),
  KEY `FK_tbl_push_email_tbl_users` (`user_id`),
  CONSTRAINT `tbl_push_notif_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Dumping data for table bison_db.tbl_push_notif: ~2 rows (approximately)
/*!40000 ALTER TABLE `tbl_push_notif` DISABLE KEYS */;
INSERT INTO `tbl_push_notif` (`id`, `user_id`, `token`, `message`, `send`) VALUES
	(1, 31, 'token1', 'message1', 'true'),
	(2, 21, 'token2', 'message2', 'true');
/*!40000 ALTER TABLE `tbl_push_notif` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_sharing
CREATE TABLE IF NOT EXISTS `tbl_sharing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(50) NOT NULL DEFAULT '',
  `progress` int(11) NOT NULL DEFAULT '0',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attachments` text NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'menunggu jadwal',
  `jadwal` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- Dumping data for table bison_db.tbl_sharing: ~9 rows (approximately)
/*!40000 ALTER TABLE `tbl_sharing` DISABLE KEYS */;
INSERT INTO `tbl_sharing` (`id`, `judul`, `progress`, `created_date`, `attachments`, `updated_date`, `status`, `jadwal`) VALUES
	(62, 'sharing1', 0, '2020-02-28 09:03:55', '', '2020-02-28 09:35:05', 'ditutup', '2020-02-28 09:05:31'),
	(63, 'sharing2', 0, '2020-02-28 09:04:00', '', '2020-02-28 09:04:00', 'menunggu jadwal', NULL),
	(64, 'sharing3', 0, '2020-02-28 09:04:04', '', '2020-02-28 09:04:04', 'menunggu jadwal', NULL),
	(65, 'sharing 4', 0, '2020-02-28 14:28:11', '', '2020-02-28 14:28:11', 'menunggu jadwal', NULL),
	(66, 'sharing 4', 0, '2020-02-28 14:29:26', '', '2020-02-28 14:29:26', 'menunggu jadwal', NULL),
	(67, 'sharing 4', 0, '2020-02-28 14:30:22', '', '2020-02-28 14:30:22', 'menunggu jadwal', NULL),
	(68, 'sharing 4', 0, '2020-02-28 14:31:44', '', '2020-02-28 14:31:44', 'menunggu jadwal', NULL),
	(69, 'sharing 4', 0, '2020-02-28 14:44:26', '', '2020-02-28 14:44:26', 'menunggu jadwal', NULL),
	(70, 'sharing 4', 0, '2020-02-28 14:45:05', '', '2020-02-28 14:45:33', 'diskusi', '2020-02-28 14:45:27');
/*!40000 ALTER TABLE `tbl_sharing` ENABLE KEYS */;

-- Dumping structure for table bison_db.tbl_users
CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nip` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '202cb962ac59075b964b07152d234b70',
  `name` varchar(50) NOT NULL DEFAULT '',
  `email` text NOT NULL,
  `photo` varchar(50) NOT NULL DEFAULT 'default-user-pic.png',
  `status` text NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

-- Dumping data for table bison_db.tbl_users: ~9 rows (approximately)
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` (`id`, `nip`, `password`, `name`, `email`, `photo`, `status`, `role`, `created_date`, `updated_date`) VALUES
	(11, 'user1', '202cb962ac59075b964b07152d234b70', 'Reza Adisetiaaa', 'rizalfauzirf@yahoo.com', '11.jpeg', 'Bismillahirrohmanirohiim.a', 'user', '2020-02-18 08:14:41', '2020-03-18 20:51:38'),
	(12, 'user2', '202cb962ac59075b964b07152d234b70', 'Budi', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'user', '2020-02-18 08:14:41', '2020-02-29 03:59:38'),
	(13, 'rso', '202cb962ac59075b964b07152d234b70', 'Kakak Budi', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'rso', '2020-02-18 08:14:41', '2020-03-18 13:42:42'),
	(14, 'user3', '202cb962ac59075b964b07152d234b70', 'Teman Budi', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'user', '2020-02-24 08:11:13', '2020-02-29 03:59:41'),
	(21, 'mentor1', '202cb962ac59075b964b07152d234b70', 'Ayah Budi', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'mentor', '2020-02-18 08:14:41', '2020-03-18 13:45:51'),
	(22, 'mentor2', '202cb962ac59075b964b07152d234b70', 'Ibu Budi', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'mentor', '2020-02-18 08:14:41', '2020-02-29 03:59:44'),
	(31, 'admin', '202cb962ac59075b964b07152d234b70', 'Admin', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'admin', '2020-02-18 08:14:41', '2020-02-29 03:59:46'),
	(32, 'admin2', '202cb962ac59075b964b07152d234b70', 'Admin 2', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'admin', '2020-02-28 14:01:19', '2020-02-29 03:59:47'),
	(41, 'manager', '202cb962ac59075b964b07152d234b70', 'Bu Erni', 'rizalfauzirf@yahoo.com', 'default-user-pic.png', '', 'manager', '2020-02-18 08:14:41', '2020-02-29 03:59:49');
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
