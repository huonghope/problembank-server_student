var express = require('express');
var router = express.Router();
var docker = require('../modules/docker-run');
const db = require('../modules/db-connection');
const sql = require('../sql');
const jwt = require('jsonwebtoken')
const fileController = require('../modules/file-controller');
const SHA256 = require('../modules/hashSHA256')

const { injectUerforAPI } = require('../modules/check-login-middleware')

router.post('/authRedirect',  async function (req, res, next){
	const { userId } = req.body;
	try {
		const [rows] = await db.query(sql.user.getUserById, [userId]);
		if(rows.length == 1)
		{
			req.session.username = rows[0].username;
			req.session.login = 'login';
			req.session.save(() => {
				const token = jwt.sign({ _user: rows }, process.env.TOKEN);
					let role = "student";
					let roleId = rows[0].roleId;
					switch (roleId) {
						case 1:
							role = "admin"
							break;
						case 2:
							role = "user"
							break;
						default:
							role = undefined
							break;
					}
					res.header('auth-token', token).send({
						result: true,
						jwt: token,
						role: role,
						message: "해당하는 유저를 확인 정상"
					});
				});
		}else{
			res.status(401).send({
				result: false,
				data: [],
				message: `해당하는 사용자의 정보가 없음.`
			})
		}
	} catch (error) {
		console.log('Get last access api: ' + error)
		res.status(401).send({
			result: false,
			data: [],
			message: `해당하는 사용자의 정보가 없음`
		})
	}
})
// check user for authentication
router.post('/auth', injectUerforAPI, async function (req, res, next) {
	try {
		const [rows] = await db.query(sql.user.getUserById, [req.user._user[0].id]);
		let role = "student";
		if(rows.length !== 0){

			let roleId = rows[0].roleId;
			switch (roleId) {
				case 1:
					role = "admin"
					break;
				case 2:
					role = "user"
					break;
				default:
					role = undefined
					break;
			}
		}
		res.status(200).send({
			result: true,
			roleId: rows[0].roleId,
			role: role,
			data: req.user._user[0],
			message: '사용자 정보',
			isAuth: true
		})
	} catch (error) {
		console.log(error)
		res.status(401).send({
			result: false,
			data: [],
			message: '사용자 정보 인증 실패',
			isAuth: false
		})
	}
})
module.exports = router;