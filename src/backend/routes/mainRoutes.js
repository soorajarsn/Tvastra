const getPages = require('../controllers/getControllers');
const postPages = require('../controllers/postControllers');
const auth = require('../middlewares/redirect');
const express = require('express');
const router = express.Router();

//get routes
router.route('/').get(auth.redirectAddDoctor,auth.redirectAdmin,getPages.home);
router.route('/home').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.home);
// router.route('/doctor').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.doctor);
router.route('/doctor').get(getPages.doctor);
// router.route('/home').get(getPages.home);
// router.route('/').get(getPages.home);
router.route('/hospitals').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.hospital);
router.route('/doctorDetail').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.doctorDetail);
router.route('/login').get(auth.redirectHome,getPages.login);
router.route('/signup').get(auth.redirectHome,getPages.signup);
router.route('/contactUs').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.contactUs);
router.route('/treatment').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.treatment);
// router.route('/bookAppointment').get(getPages.bookAppointment);
router.route('/about').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.about);
router.route('/hospitalDetail').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.hospitalDetail);
router.route('/faqs').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.faqs);
router.route('/createDoctor').get(getPages.createDoctor);
router.route('/createHospital').get(getPages.createHospital);
router.route('/enterOtp').get(getPages.enterOtp);
router.route('/logout').get(auth.redirectLogin,getPages.logout);
router.route('/tvastraPlus').get(auth.redirectLogin,auth.redirectAddDoctor,getPages.tvastraPlus);
router.route('/changePassword').get(getPages.changePassword);
router.route('/submitYourQuery').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.submitYourQuery);
router.route('/addDoctorFields').get(auth.redirectDoctorOrLogin,auth.redirectAdmin,getPages.addDoctorFields);
router.route('/userProfile').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.userProfile);
router.route('/createSchedule').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.createSchedule);
router.route('/removeSchedule').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.removeSchedule);
router.route('/settings').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.settings);
router.route('/appointments').get(auth.redirectLogin,auth.redirectAdmin,auth.redirectAddDoctor,getPages.appointments);
router.route('/confirmAppointment').get((req,res,next)=>{
    if(!req.session.bookAppointmentFields){
        res.redirect('/doctor');
    }
    else{
        next();
    }
},getPages.confirmAppointment);
router.route('/rescheduleAppointment').get(auth.redirectLogin,getPages.rescheduleAppointment);

router.route('/admin').get(auth.authAdmin,getPages.admin);
router.route('/admin/doctors').get(auth.authAdmin,getPages.adminDoctor);
router.route('/admin/departments').get(auth.authAdmin,getPages.adminDepartments);
router.route('/admin/appointments').get(auth.authAdmin,getPages.adminAppointments);
router.route('/admin/patients').get(auth.authAdmin,getPages.adminPatients);
router.route('/admin/hospitals').get(auth.authAdmin,getPages.adminHospitals);
router.route('/admin/userProfile').get(auth.authAdmin,getPages.userProfile);

//post routes
router.route('/').post(postPages.home);
router.route('/loginWithOtp').post(postPages.loginWithOtp);
router.route('/loginWithEmail').post(postPages.loginWithEmail);
router.route('/verifyOtp').post(postPages.verifyOtp);
router.route('/signup').post(postPages.signup);
router.route('/addDoctorFields').post(postPages.addDoctorFields);
// router.route('/createHospital').post(postPages.createHospital);
router.route('/forgetPassword').post(postPages.forgetPassword);
router.route('/changePassword').post(postPages.changePassword);
router.route('/updateMobileNumber').post(postPages.updateMobileNumber);
router.route('/updateMobileNumber/verifyOtp').post(postPages.verifyOtpToUpdateMobile);
router.route('/updateProfile').post(postPages.updateProfile);
router.route('/verifyHospital').post(postPages.verifyHospital);
router.route('/createSchedule').post(postPages.createSchedule);
router.route('/disableSchedule').post(postPages.disableSchedule);
router.route('/disableSlot').post(postPages.disableSlot);
router.route('/settings').post(postPages.settings);
router.route('/bookSlot').post(postPages.bookSlot);
router.route('/bookAppointment').post(postPages.bookAppointment);
router.route('/cancelAppointment').post(postPages.cancelAppointment);
router.route('/rescheduleAppointment').post(postPages.rescheduleAppointment);
module.exports = router;