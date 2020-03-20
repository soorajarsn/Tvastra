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
router.route('/signup').get(getPages.signup);
router.route('/contactUs').get(getPages.contactUs);
router.route('/treatment').get(getPages.treatment);
//post routes
router.route('/login').post(postPages.login);
router.route('/signup').post(postPages.signup);
module.exports = router;