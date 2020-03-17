const getPages = require('../controllers/getControllers');
const postPages = require('../controllers/postControllers');
const express = require('express');
const router = express.Router();

//get routes
router.route('/').get(getPages.home);
router.route('/doctor').get(getPages.doctor);
router.route('/hospitals').get(getPages.hospital);
router.route('/doctorDetail').get(getPages.doctorDetail);
router.route('/login').get(getPages.login);
//post routes
router.route('/login').post(postPages.login);

module.exports = router;