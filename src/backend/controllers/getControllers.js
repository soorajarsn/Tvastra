const database = require('../database/database');
const client = database.client;
const dbName = database.dbName;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
function home(req,res){
    console.log("req.session.user is ",req.session.user);
    if(!req.session.userId){
        res.redirect('/login');
    }
    else{
        const signUpOrLoginSuccess = req.session.signUpOrLogin;
        req.session.signUpOrLogin = null;
        return res.render('index',{
            signUpOrLoginSuccess:signUpOrLoginSuccess,
            user:req.session.user
        });
    }
}
function doctor(req,res){
    // var doctors ;
    // var doctors=[]; 
    // console.log("req.session.user is ",req.session.user);
    client.connect(function(err,client){
        assert.equal(null,err);
        const db = client.db(dbName);
        const collection = "users";
        const namespace = db.collection(collection);
        namespace.find({}).toArray(function(err,result,next){
            assert.equal(null,err);
            // console.log(result);
            // var users = result.filter(user => !user.doctor);
            result = result.filter(user => user.doctor && (typeof user.doctor == 'object'));
            var finalResult = [];
            result.forEach(async r => {
                var dayWiseSlots = {"Monday":[],'Tuesday':[],'Wednesday':[],'Thursday':[],'Friday':[],'Saturday':[],'Sunday':[]};
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var dateWiseSlots = [];
                var dt = new Date();
                var dates = [];
                var dateStrings = [];
                for(var i = 0; i < 14; i++){
                    dates.push(new Date(dt));
                    dt.setDate(dt.getDate()+1);
                }
                dates.forEach(d => {
                    dt = d.getDate();
                    if(dt < 10)
                        dt = '0'+dt;
                    var string = [dt,months[d.getMonth()],d.getFullYear()].join(' ');
                    dateStrings.push(string);
                })
                //getting today and tomorrow;
                var today = new Date();
                var todayDt = today.getDate();
                var tomorrow = new Date();
                tomorrow.setDate(today.getDate()+1);
                tomorrow = new Date(tomorrow);
                var tomorrowDt = tomorrow.getDate();


                if(todayDt < 10)
                    todayDt = '0'+todayDt;
                var todayDateString = [todayDt,months[today.getMonth()],today.getFullYear()].join(' ');

                if(tomorrowDt < 10)
                    tomorrowDt = '0'+tomorrowDt;
                var tomorrowDateString = [tomorrowDt,months[tomorrow.getMonth()],tomorrow.getFullYear()].join(' ');

                if(r.doctor.appointmentDetails){
                    // console.log('going to find');//////////////////////////////////////////////////////////////////////////////////
                    // console.log(dateStrings);
                    var bookedAppointments = {};
                    if(r.doctor.appointmentDetails.booked){
                        r.doctor.appointmentDetails.booked.forEach(booking => {
                            var bookingDate = booking.slot.date;
                            var startTime = booking.slot.timing.timeFrom;
                            var bookingStatus = booking.status;
                            if(bookingStatus == 'booked')
                                if(bookedAppointments[bookingDate]){
                                    bookedAppointments[bookingDate].push(startTime);
                                }
                                else{
                                    bookedAppointments[bookingDate] = [startTime];
                                }
                        });
                    }
                    // console.log('for ',r.name,' booked appointments are',bookedAppointments);
                    sortSchedule(r.doctor.appointmentDetails.schedule).forEach(sch => {
                        var slots = sch.slots.filter(slot => slot.status != 'disabled');
                        // console.log(slots);////////////////////////////////////////////////////////////////////////////////////////////
                        var hospital = sch.hospital;
                        var day = sch.day;
                        var isHospitalAlreadyPresent = false;
                        for(var i = 0; i < dayWiseSlots[day].length; i++)
                            if(dayWiseSlots[day][i].hospital == hospital){
                                isHospitalAlreadyPresent = true;
                                var slots1 = dayWiseSlots[day][i].slots;
                                dayWiseSlots[day][i].slots = [...slots1,...slots];
                            }
                        if(!isHospitalAlreadyPresent)
                            dayWiseSlots[sch.day].push({slots,hospital});
                    });
                    var days = ["Sunday",'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                    
                    // var dateWiseSlots = [];
                    dates.forEach(date => {
                        dt = date.getDate();
                        if(dt < 10)
                            dt = '0'+dt;
                        var dateString = [dt,months[date.getMonth()],date.getFullYear()].join(' ');
                        var filteredSlots = [];                                                 
                        var hospitalAndSlots = [];
                        var noOfSlots = 0;
                        dayWiseSlots[days[date.getDay()]].forEach(slotHospitalObj => {
                            hospital = slotHospitalObj.hospital;
                            filteredSlots = [];
                            //filtering slots that are booked (using date and time for booking that is found previously)
                            slotHospitalObj.slots.forEach(slot => {
                                var slotStartTime = slot.slot.substring(0,8);
                                if(!bookedAppointments[dateString] || !bookedAppointments[dateString].includes(slotStartTime)){
                                    filteredSlots.push(slot.slot.substring(0,8));
                                }
                            });
                            // console.log('After filtering the slots that has been booked for a particular date',' for date ',dateString,' filtered slots are ',filteredSlots);
                            //filtering the slots that has been passed for today;
                            if(dateString == todayDateString){
                                var hours = today.getHours();
                                var mins = today.getMinutes();
                                if(hours < 10)
                                    hours = '0'+hours;
                                if(mins < 10)
                                    mins = '0'+mins;
                                const presentTime = [hours,mins].join(':');
                                filteredSlots = filteredSlots.filter(slot => convertInto24Hour(slot) > presentTime);
                                console.log('The above slots was for today, filtering the slots that have been passed till now',filteredSlots);
                            }
                            noOfSlots += filteredSlots.length;
                            var dividedFiltered = {"Morning":[],"Afternoon":[],"Evening":[]};

                            // console.log("filtered slots for date, ", dateString," and hospital ",hospital," is : ",filteredSlots,' going to divide filtered slots');/////////////////////////////////////////////////////////////////////////
                            
                            //going to divide filtered slots into (morning, afternoon, evening) times
                            filteredSlots.forEach(slot => {
                                if(slot.substring(6,8) == "AM")
                                    dividedFiltered["Morning"].push(slot);
                                else if(slot.substring(6,8) == "PM" && (slot.substring(0,2) == 12 || (slot.substring(0,2) >= '01' && slot.substring(0,2) < '04'))){
                                    dividedFiltered["Afternoon"].push(slot);
                                }
                                else{
                                    dividedFiltered["Evening"].push(slot);
                                }
                            });

                            // console.log("After dividing into : ",dividedFiltered);
                            hospitalAndSlots.push({hospital,slots:dividedFiltered});
                            // console.log({hospital,slots:dividedFiltered});/////////////////////////////////////////////////////////////////////////////
                        });
                        // console.log("Going to set hospitalAndSlots to : ",hospitalAndSlots,' for dateString : ',dateString);
                        if(noOfSlots == 0)
                            noOfSlots = "No Slots Available";
                        else if(noOfSlots == 1)
                            noOfSlots += " Slot Available" ;
                        else
                            noOfSlots += " Slots Available";
                        if(dateString == todayDateString)
                            dateWiseSlots.push({date:"Today",noOfSlots,hospitalAndSlots});
                        else if(dateString == tomorrowDateString)
                            dateWiseSlots.push({date:"Tomorrow",noOfSlots,hospitalAndSlots});
                        else
                            dateWiseSlots.push({date:dateString,noOfSlots,hospitalAndSlots});
                    })
                }
                else{
                    dateWiseSlots = [];
                    dateStrings.forEach(dateString => {
                        if(dateString == todayDateString){
                            dateWiseSlots.push({date:"Today",noOfSlots:"No Slots Available",hospitalAndSlots:[]});
                        }
                        else if(dateString == tomorrowDateString){
                            dateWiseSlots.push({date:"Tomorrow",noOfSlots:"No Slots Available",hospitalAndSlots:[]});
                        }
                        else{
                            dateWiseSlots.push({date:dateString,noOfSlots:"No Slots Available",hospitalAndSlots:[]});
                        }
                    });
                }
                // console.log("Name: ",r.name,"Email: ",r.email,"And finally dateWiseSlots: ",dateWiseSlots);
                // return res.redirect('/doctor',{
                //     user:req.session.userId,
                //     doctors:re
                // })
                r.dateWiseSlots = dateWiseSlots;
            })
            // console.log('result.is :',result,result.dateWiseSlots);  
            // result.forEach(re => {
            //     console.log(re,re.dateWiseSlots);
            // })
            // console.log(result);
            const isAppointmentCancelled = req.session.appointmentCancelled; 
            req.session.appointmentCancelled = null;
            console.log(result);
            var searchFor = req.session.searchFor;
            var search = req.session.search;
            var location = req.session.location;
            req.session.searchFor = null;
            req.session.search = null;
            req.session.location = null;
            return res.render('doctor',{
                user:req.session.user,
                doctors:result,
                appointmentCancelled:isAppointmentCancelled,
                searchFor:searchFor,
                search:search,
                location:location
            });
        })
        // client.close();/
    });
    // return r
}
// doctor();
function hospital(req,res){
    console.log("req.session.user is ",req.session.user);
    client.connect(function(err,client){
        assert.equal(null,err);
        const db = client.db(dbName);
        const collection = 'hospitals';
        const namespace  = db.collection(collection);
        namespace.find({}).toArray(function(err,result,next){
            assert.equal(null,err);
            console.log(result);
            console.log("Going to router the hospital page with above result");
            result = result.filter(e => e.verified != false);
            res.render('hospital',{
                hospitals:result,
                user:req.session.user
            });
        });
    });
    // return res.render('hospital');
}
function doctorDetail(req,res){
    const _id = req.query.id;
    console.log("_id is ",_id);
    client.connect(function(err,client){
        assert.equal(null,err);
        const db = client.db(dbName);
        const collection = 'doctors';
        const namespace = db.collection(collection);
        namespace.find({_id:new ObjectID(_id)}).toArray(function(err,result,next){
            assert.equal(null,err);
            console.log(result);
            console.log('routing the doctor profile page with above result');
            res.render('doctorDetail',{
                doctor:result[0],
                user:req.session.user
            });
        });
    });
    // return res.render('doctorDetail');
}
function login(req,res){
    const method = req.query.method;
    var userNotFoundMsg = req.session.userNotFoundMsg;
    var errorMsg = req.session.errorMsg;
    var passwordChanged = req.session.passwordChanged;

    req.session.userNotFoundMsg = null;
    req.session.errorMsg = null;
    req.session.passwordChanged = null;

    if(method=="email"){
        return res.render('loginWithEmail',{
            userNotFoundMsg: userNotFoundMsg,
            user:req.session.user,
            errorMsg:errorMsg,
            passwordChanged:passwordChanged
        });
    }
    else{
        return res.render('loginWithOtp',{
            userNotFoundMsg: userNotFoundMsg,
            user:req.session.user,
            errorMsg:errorMsg
        });
    }

}
function changePassword(req,res){
    if(req.session.email){
        var passwordError = req.session.passwordError;
        req.session.passwordError = null;
        return res.render('changePassword',{
            passwordError:passwordError,
            user:req.session.user
        });
    }
    else{
        res.status(401).send({err:"Unauthorized"});
    }
}

function enterOtp(req,res){

    var changePassword = req.query.changePassword;
    if(req.session.mobileNumber == null)
        res.status(401).send({err:'Unauthorized'});
    else{
        var msg = req.session.otpErrorMsg;
        var otpSentMsg = req.session.otpSentMsg;
        var otpSentAgainMsg = req.session.otpSentAgainMsg;
        req.session.otpSentAgainMsg = null;
        req.session.otpSentMsg = null;
        req.session.otpErrorMsg = null;
        if(changePassword){
            return res.render('enterOtpChangePassword',{
                msg:msg,
                otpSentMsg: otpSentMsg,
                otpSentAgainMsg: otpSentAgainMsg,
                user:req.session.user
            });
        }
        else{
            return res.render('enterOtp',{
                msg:msg,
                otpSentMsg: otpSentMsg,
                otpSentAgainMsg: otpSentAgainMsg,
                user:req.session.user
            });
        }
    }
}

function slots(req,res){
    return res.render('slots');
}

function signup(req,res){
    var mobileNumberErrorMsg = req.session.mobileNumberErrorMsg,
        emailErrorMsg = req.session.emailErrorMsg,
        errorMsg =req.session.errorMsg;

    req.session.mobileNumberErrorMsg = null;
    req.session.emailErrorMsg = null;
    req.session.errorMsg = null;

    return res.render('signup',{
        errorMsg: errorMsg,
        emailErrorMsg: emailErrorMsg,
        mobileNumberErrorMsg: mobileNumberErrorMsg,
        user:req.session.user
    });
}

function logout(req,res){
    req.session.destroy(err=>{
        if(err){
            console.log('Error logging out: ',err);
            return res.redirect('/');
          }
        //   res.clearCookie('user');
          return res.redirect('/login');
      });
}


function contactUs(req,res){
    return res.render('contact',{
        user:req.session.user
    });
}
function treatment(req,res){
    return res.render('treatment',{
        user:req.session.user
    });
}
// function bookAppointment(req,res){
//     return res.render('bookAppointment',{
//         user:req.session.user
//     });
// }
function about(req,res){
    return res.render('about',{
        user:req.session.user
    });
}
function hospitalDetail(req,res){
    const _id = req.query.id;
    client.connect(function(err,client){
        assert.equal(null,err);
        const db = client.db(dbName);
        const collection = 'hospitals';
        const namespace = db.collection(collection);
        namespace.find({_id:new ObjectID(_id)}).toArray(function(err,result,next){
            assert.equal(null,err);
            res.render('hospitalDetail',{
                hospital:result[0],
                user:req.session.user
            });
        });
    });
    // return res.render('hospitalDetail');
}
function faqs(req,res){
    console.log(req.params.id);
    return res.render('faqs',{
        user:req.session.user
    });
}

function admin(req,res){
    var signUpOrLogin = req.session.signUpOrLogin;
    req.session.signUpOrLogin = null;
    console.log('user:',req.session.user);
    return res.render('admin',{
        signUpOrLoginSuccess:signUpOrLogin,
        user:req.session.user
    });
}
function adminDoctor(req,res){
    client.connect(function(err,client){
        assert.equal(err,null);
        client.db(dbName).collection('users').find({}).toArray(function(err,result,next){
            result = result.filter(user => user.doctor && (typeof user.doctor == 'object'));
            return res.render('adminDoctor',{
                doctors:result,
                user:req.session.user
            });
        });
    });
}
function adminDepartments(req,res){
    return res.render('adminDepartments',{
        user:req.session.user
    });
}
function adminAppointments(req,res){
    return res.render('adminAppointments',{
        user:req.session.user
    });
}
function adminPatients(req,res){
    client.connect(function(err,client){
        assert.equal(err,null);
        client.db(dbName).collection('users').find({})
        .toArray(function(err,result,next){
            assert.equal(err,null);
            result = result.filter(user => !user.doctor);
            var response = [];
            result.forEach(user => {
                
                var add = [];
                if(user.house)
                    add.push(user.house);
                if(user.colony)
                    add.push(user.colony);
                add.push(user.city);
                add.push(user.state);
                add.push(user.country);
                var address = add.join(', ');
                
                var age = new Date().getFullYear() - user.dob.substring(0,4);
                var name = user.name;
                var imgAddress = user.imgAddress;
                var mobileNumber = user.mobileNumber;
                var _id = user._id;
                var id = user.id;
                response.push({address,age,name,imgAddress,mobileNumber,_id,id});
            });
            console.log(response);
            return res.render('adminPatients',{
                user:req.session.user,
                response
            });
        });
    });
    // return res.render('adminPatients',{
    //     user:req.session.user
    // });
}
function adminHospitals(req,res){
    client.connect(function(err,client){
        assert.equal(err,null);
        client.db(dbName).collection('hospitals').find({}).toArray(function(err,result,next){
            assert.equal(err,null);
            return res.render('adminHospital',{
                hospitals:result,
                user:req.session.user
            })
        })
    })
}
function createDoctor(req,res){
    var variables = {
        msg,
        name,
        doctorProfileSpecialization,
        doctorProfileLOT,
        doctorPageExperience,
        doctorProfileExperience,
        doctorPageQualification,
        doctorProfileQualification,
        doctorPageAwards,
        doctorProfileAwards,
        doctorPageLocation,
        doctorProfileLocation,
        avgFees
    } = req.session;
    // console.log(`query object is : ${msg+'\n'+doctorProfileSpecialization+'\n'+doctorPageExperience}`);
    // if(msg){//unset the session variables to null if they are set;
        req.session.msg = null;
        req.session.name = null;
        req.session.doctorProfileSpecialization = null;
        req.session.doctorProfileLOT  = null;
        req.session.doctorPageExperience = null;
        req.session.doctorProfileExperience = null;
        req.session.doctorPageQualification = null;
        req.session.doctorProfileQualification = null;
        req.session.doctorPageAwards = null;
        req.session.doctorProfileAwards = null;
        req.session.doctorPageLocation = null;
        req.session.doctorProfileLocation = null;
        req.session.avgFees = null;
    // }
    // for (var key in query){
    //     req.session[key] = query[key];
    // }
    // console.log("After resetting session variables , query: ");
    return res.render('createDoctor',{
        ...variables
    });
}
function addDoctorFields(req,res){
    var msg = req.session.msg;
    req.session.msg = null;
    res.render('addDoctorFields',{
        user:req.session.user,
        msg:msg
    });
}
function createHospital(req,res){
    var variables = {
        msg,
        name,
        imgAddress,
        specialization,
        hospitalPageTreatments,
        hospitalProfileTreatments,
        doctors,
        noOfBeds,
        infrastructure,
        packag,
        hospitalPageLocation,
        hospitalProfileLocation,
        charge,
        membership
    } = req.session;
    console.log('variables object is ',variables);
    req.session.msg = null;
    req.session.name = null;
    req.session.imgAddress = null;
    req.session.specialization = null;
    req.session.hospitalPageTreatments = null;
    req.session.hospitalProfileTreatments = null;
    req.session.doctors = null;
    req.session.noOfBeds = null;
    req.session.infrastructure = null;
    req.session.packag = null;
    req.session.hospitalPageLocation = null;
    req.session.hospitalProfileLocation = null;
    req.session.charge = null;
    req.session.membership = null;
    return res.render('createHospital',{
        msg,
        name,
        imgAddress,
        specialization,
        hospitalPageTreatments,
        hospitalProfileTreatments,
        doctors,
        noOfBeds,
        infrastructure,
        packag,
        hospitalPageLocation,
        hospitalProfileLocation,
        charge,
        membership
    })
}
function tvastraPlus(req,res){
    console.log("req.session.user is ",req.session.user);
    res.render('tvastraPlus',{
        user:req.session.user
    });
}
function submitYourQuery(req,res){
    console.log("req.session.user is ",req.session.user);
    res.render('submitYourQuery',{
        user:req.session.user
    });
}
function userProfile(req,res){
    const success = req.session.success;
    const error = req.session.error;
    const registered = req.session.alreadyRegistered;
    const invalidFormat = req.session.invalidFormat;
    const invalidOtp = req.session.invalidOtp;
    const updatedNumber = req.session.updatedNumber;
    const otpError = req.session.otpError;
    req.session.alreadyRegistered = null;
    req.session.error = null;
    req.session.success = null;
    req.session.invalidFormat = null;
    req.session.invalidOtp = null;
    req.session.updatedNumber = null;
    req.session.otpError = null;
    client.connect(function(err,client){
        assert.equal(err,null);
        const db = client.db(dbName);
        const namespace = db.collection('users');
        namespace.findOne({_id:new ObjectID(req.query._id)})
        .then(result=>{
            if(result){
                var toBeRendered = 'userProfile';
               if(req.session.admin)
                    toBeRendered = 'adminProfile'                  
                if(result.doctor){
                    db.collection('doctors').findOne({_id:new ObjectID(req.session.userId)})
                    .then(result2=>{
                        if(updatedNumber){
                            var mobileNumber = '91'+updatedNumber;
                            result.mobileNumber = mobileNumber;
                            result2.mobileNumber = mobileNumber;
                            return res.render('userProfile',{
                                user:req.session.user,
                                userData:{...result,...result2},
                                success:success,
                                error:error,
                                alreadyRegistered:registered,
                                invalidFormat:invalidFormat,
                                invalidOtp:invalidOtp,
                                otpError:otpError
                            });
                        }
                        else{
                            console.log('in else');
                            return res.render('userProfile',{
                                user:req.session.user,
                                userData:{...result,...result2},
                                success:success,
                                error:error,
                                alreadyRegistered:registered,
                                invalidFormat:invalidFormat,
                                invalidOtp:invalidOtp,
                                otpError:otpError
                            });
                        }
                        
                    })
                    .catch(err=>{
                        console.log(err);
                        return res.redirect('/logout');
                    })
                }
                else{
                    if(updatedNumber){
                        result.mobileNumber = '91'+updatedNumber;
                    }
                    return res.render(toBeRendered,{
                        user:req.session.user,
                        userData:result,
                        success:success,
                        error:error,
                        alreadyRegistered:registered,
                        invalidFormat:invalidFormat, 
                        invalidOtp:invalidOtp,
                        otpError:otpError
                    });
                }
            }
            else{
                return res.redirect('/logout')
            }
        })
        .catch(err=>{
            console.log(err);
            return res.redirect('/logout');
        });
    });
}
function createSchedule(req,res){
    // const invalidData = req.session.invalidData;
    const invalidTiming = req.session.invalidTiming;
    const shownSlotList = req.session.shownSlotList;//to know if any schedule is viewed and one of the slots is checked/unchecked to disable/enable the slot
    req.session.shownSlotList = null;
    // req.session.invalidData = null;
    req.session.invalidTiming = null;
    client.connect(function(err,client){
        assert.equal(err,null);
        const namespace = client.db(dbName).collection('users');
        namespace.findOne({_id:new ObjectID(req.session.userId)})
        .then(result => {
            if(result.doctor){
                var schedule = [];
                if(result.doctor.appointmentDetails && result.doctor.appointmentDetails.schedule){
                    schedule = result.doctor.appointmentDetails.schedule;
                }
                // console.log(schedule);/
                sortSchedule(schedule);
                // console.log('After sorting, schedule is : ',schedule);
                // console.log(result.doctor.hospitalList);
                return res.render('createSchedule',{
                    user:req.session.user,
                    invalidTiming:invalidTiming,
                    schedule:schedule,
                    hospital:result.doctor.hospitalList.split(','),
                    shownSlotList:shownSlotList
                });
            }
            else{
                return res.status(400).json({Error:"Bad Request"});
            }
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/logout');
        })
    })
    // return res.render("createSchedule",{
    //     user:req.session.user,
    //     invalidData,
    //     invalidTiming,

    // });
}
function sortSchedule(schedule){
    let dayNumber = {"Monday":0,"Tuesday":1,"Wednesday":2,"Thursday":3,"Friday":4,"Saturday":5,"Sunday":6};
    // console.log('going to sort');
    for(var i = 0; i < schedule.length; i++)
        for(var j = 0; j < schedule.length-1-i; j++){
            var day1 = dayNumber[schedule[j].day];
            var day2 = dayNumber[schedule[j+1].day];
            if(day1 > day2 || (day1 == day2 && convertInto24Hour(schedule[j].timing.timeFrom) > convertInto24Hour(schedule[j+1].timing.timeFrom))){
                var temp = schedule[j];
                schedule[j] = schedule[j+1];
                schedule[j+1] = temp;
            }
            // console.log(schedule);
        }
    return schedule;
}
function convertInto24Hour(time12h){
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}
function removeSchedule(req,res){
    const {day,timeFrom,timeTo,hospital} = req.query;
    client.connect(function(err,client){
        assert.equal(err,null);
        client.db(dbName).collection('users').update({_id:new ObjectID(req.session.userId)},{$pull:{"doctor.appointmentDetails.schedule":{day:day,"timing.timeFrom":timeFrom,"timing.timeTo":timeTo}}});
        return res.redirect('/createSchedule');
    });
}
function settings(req,res){
    // const passwordError = req.session.passwordError;
    const passwordChanged = req.session.passwordChanged;
    req.session.passwordChanged = null;
    // req.session.passwordError = null;
    return res.render("settings",{
        user:req.session.user,
        passwordChanged:passwordChanged
    });
}
function appointments(req,res){
    client.connect(function(err,client){
        assert.equal(null,err);
        const namespace = client.db(dbName).collection('users');
        namespace.findOne({_id:new ObjectID(req.session.userId)})
        .then(result => {
            var appointments = [];
            const months = ['January','February','March','April','May','June','July','August','September','August','November','December'];
            const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            if(req.session.user.isDoctor){
                result.doctor.appointmentDetails.booked.forEach(booking => {
                    var doc = {...booking};
                    var dt = booking.slot.date.split(' ');
                    var day = days[new Date(dt[2],months.indexOf(dt[1]),dt[0]).getDay()];
                    doc.slot = {day,date:booking.slot.date,time:booking.slot.timing.timeFrom};
                    doc
                    appointments.push(doc);
                });
            }
            else{
                appointments = result.appointments;
            }
            console.log(appointments);
            sortAppointments(appointments);
            var isAppointmentCancelled = req.session.appointmentCancelled;
            req.session.appointmentCancelled = null;
            return res.render('appointments',{
                user:req.session.user,
                appointments:appointments,
                appointmentCancelled:isAppointmentCancelled
            });
        });
    });
}
function sortAppointments(appointments){
    var length = appointments.length;
    for(var i = 0; i < length; i++){
        for(var j = 0; j < length-i-1; j++){
            if(firstGreater(appointments[j],appointments[j+1])){
                var temp = appointments[j];
                appointments[j] = appointments[j+1];
                appointments[j+1] = temp;
            }
        }
    }
}
function firstGreater(a1,a2){
    const months = ['January','February','March','April','May','June','July','August','September','August','November','December'];
    var [d1,m1,y1] = a1.slot.date.split(' ');
    var [d2,m2,y2] = a2.slot.date.split(' ');
    var t1 = a1.slot.time;
    var t2 = a2.slot.time;
    m1 = months.indexOf(m1);
    m2 = months.indexOf(m2);
    if(y1 > y2)
        return true;
    else if(y1 == y2 && m1 > m2)
        return true;
    else if(y1 == y2 && m1 == m2 && d1 > d2)
        return true;
    else if(y1 == y2 && m1 == m2 && d1 == d2 && convertInto24Hour(t1) > convertInto24Hour(t2))
        return true;
    return false;
}
function confirmAppointment(req,res){
    const bookAppointmentFields = req.session.bookAppointmentFields;
    req.session.bookAppointmentFields = null;
    return res.render('bookAppointment',{
        user:req.session.user,
        ...bookAppointmentFields
    });
}
function rescheduleAppointment(req,res){
    const appointmentId = req.query._id;
    client.connect(function(err,client){
        assert.equal(null,err);
        const db = client.db(dbName);
        const collection = "users";
        const namespace = db.collection(collection);
        namespace.find({"doctor.appointmentDetails.booked._id":new ObjectID(appointmentId)}).toArray(function(err,result,next){
            assert.equal(null,err);
            // console.log(result);
            // var users = result.filter(user => !user.doctor);
            // result = result.filter(user => user.doctor && (typeof user.doctor == 'object'));
            result.forEach(async r => {
                var dayWiseSlots = {"Monday":[],'Tuesday':[],'Wednesday':[],'Thursday':[],'Friday':[],'Saturday':[],'Sunday':[]};
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var dateWiseSlots = [];
                var dt = new Date();
                var dates = [];
                var dateStrings = [];
                for(var i = 0; i < 14; i++){
                    dates.push(new Date(dt));
                    dt.setDate(dt.getDate()+1);
                }
                dates.forEach(d => {
                    dt = d.getDate();
                    if(dt < 10)
                        dt = '0'+dt;
                    var string = [dt,months[d.getMonth()],d.getFullYear()].join(' ');
                    dateStrings.push(string);
                })
                //getting today and tomorrow;
                var today = new Date();
                var todayDt = today.getDate();
                var tomorrow = new Date();
                tomorrow.setDate(today.getDate()+1);
                tomorrow = new Date(tomorrow);
                var tomorrowDt = tomorrow.getDate();


                if(todayDt < 10)
                    todayDt = '0'+todayDt;
                var todayDateString = [todayDt,months[today.getMonth()],today.getFullYear()].join(' ');

                if(tomorrowDt < 10)
                    tomorrowDt = '0'+tomorrowDt;
                var tomorrowDateString = [tomorrowDt,months[tomorrow.getMonth()],tomorrow.getFullYear()].join(' ');

                if(r.doctor.appointmentDetails){
                    // console.log('going to find');//////////////////////////////////////////////////////////////////////////////////
                    // console.log(dateStrings);
                    var bookedAppointments = {};
                    if(r.doctor.appointmentDetails.booked){
                        r.doctor.appointmentDetails.booked.forEach(booking => {
                            var bookingDate = booking.slot.date;
                            var startTime = booking.slot.timing.timeFrom;
                            var bookingStatus = booking.status;
                            if(bookingStatus == 'booked')
                                if(bookedAppointments[bookingDate]){
                                    bookedAppointments[bookingDate].push(startTime);
                                }
                                else{
                                    bookedAppointments[bookingDate] = [startTime];
                                }
                        });
                    }
                    // console.log('for ',r.name,' booked appointments are',bookedAppointments);
                    sortSchedule(r.doctor.appointmentDetails.schedule).forEach(sch => {
                        var slots = sch.slots.filter(slot => slot.status != 'disabled');
                        // console.log(slots);////////////////////////////////////////////////////////////////////////////////////////////
                        var hospital = sch.hospital;
                        var day = sch.day;
                        var isHospitalAlreadyPresent = false;
                        for(var i = 0; i < dayWiseSlots[day].length; i++)
                            if(dayWiseSlots[day][i].hospital == hospital){
                                isHospitalAlreadyPresent = true;
                                var slots1 = dayWiseSlots[day][i].slots;
                                dayWiseSlots[day][i].slots = [...slots1,...slots];
                            }
                        if(!isHospitalAlreadyPresent)
                            dayWiseSlots[sch.day].push({slots,hospital});
                    });
                    var days = ["Sunday",'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                    
                    // var dateWiseSlots = [];
                    dates.forEach(date => {
                        dt = date.getDate();
                        if(dt < 10)
                            dt = '0'+dt;
                        var dateString = [dt,months[date.getMonth()],date.getFullYear()].join(' ');
                        var filteredSlots = [];                                                 
                        var hospitalAndSlots = [];
                        var noOfSlots = 0;
                        dayWiseSlots[days[date.getDay()]].forEach(slotHospitalObj => {
                            hospital = slotHospitalObj.hospital;
                            filteredSlots = [];
                            //filtering slots that are booked (using date and time for booking that is found previously)
                            slotHospitalObj.slots.forEach(slot => {
                                var slotStartTime = slot.slot.substring(0,8);
                                if(!bookedAppointments[dateString] || !bookedAppointments[dateString].includes(slotStartTime)){
                                    filteredSlots.push(slot.slot.substring(0,8));
                                }
                            });
                            // console.log('After filtering the slots that has been booked for a particular date',' for date ',dateString,' filtered slots are ',filteredSlots);
                            //filtering the slots that has been passed for today;
                            if(dateString == todayDateString){
                                var hours = today.getHours();
                                var mins = today.getMinutes();
                                if(hours < 10)
                                    hours = '0'+hours;
                                if(mins < 10)
                                    mins = '0'+mins;
                                const presentTime = [hours,mins].join(':');
                                filteredSlots = filteredSlots.filter(slot => convertInto24Hour(slot) > presentTime);
                                console.log('The above slots was for today, filtering the slots that have been passed till now',filteredSlots);
                            }
                            noOfSlots += filteredSlots.length;
                            var dividedFiltered = {"Morning":[],"Afternoon":[],"Evening":[]};

                            // console.log("filtered slots for date, ", dateString," and hospital ",hospital," is : ",filteredSlots,' going to divide filtered slots');/////////////////////////////////////////////////////////////////////////
                            
                            //going to divide filtered slots into (morning, afternoon, evening) times
                            filteredSlots.forEach(slot => {
                                if(slot.substring(6,8) == "AM")
                                    dividedFiltered["Morning"].push(slot);
                                else if(slot.substring(6,8) == "PM" && (slot.substring(0,2) == 12 || (slot.substring(0,2) >= '01' && slot.substring(0,2) < '04'))){
                                    dividedFiltered["Afternoon"].push(slot);
                                }
                                else{
                                    dividedFiltered["Evening"].push(slot);
                                }
                            });

                            // console.log("After dividing into : ",dividedFiltered);
                            hospitalAndSlots.push({hospital,slots:dividedFiltered});
                            // console.log({hospital,slots:dividedFiltered});/////////////////////////////////////////////////////////////////////////////
                        });
                        // console.log("Going to set hospitalAndSlots to : ",hospitalAndSlots,' for dateString : ',dateString);
                        if(noOfSlots == 0)
                            noOfSlots = "No Slots Available";
                        else if(noOfSlots == 1)
                            noOfSlots += " Slot Available" ;
                        else
                            noOfSlots += " Slots Available";
                        if(dateString == todayDateString)
                            dateWiseSlots.push({date:"Today",noOfSlots,hospitalAndSlots});
                        else if(dateString == tomorrowDateString)
                            dateWiseSlots.push({date:"Tomorrow",noOfSlots,hospitalAndSlots});
                        else
                            dateWiseSlots.push({date:dateString,noOfSlots,hospitalAndSlots});
                    })
                }
                else{
                    dateWiseSlots = [];
                    dateStrings.forEach(dateString => {
                        if(dateString == todayDateString){
                            dateWiseSlots.push({date:"Today",noOfSlots:"No Slots Available",hospitalAndSlots:[]});
                        }
                        else if(dateString == tomorrowDateString){
                            dateWiseSlots.push({date:"Tomorrow",noOfSlots:"No Slots Available",hospitalAndSlots:[]});
                        }
                        else{
                            dateWiseSlots.push({date:dateString,noOfSlots:"No Slots Available",hospitalAndSlots:[]});
                        }
                    });
                }
                // console.log("Name: ",r.name,"Email: ",r.email,"And finally dateWiseSlots: ",dateWiseSlots);
                // return res.redirect('/doctor',{
                //     user:req.session.userId,
                //     doctors:re
                // })
                r.dateWiseSlots = dateWiseSlots;
            })
            // console.log('result.is :',result,result.dateWiseSlots);  
            // result.forEach(re => {
            //     console.log(re,re.dateWiseSlots);
            // })
            console.log(result[0]);
            return res.render('rescheduleAppointment',{
                user:req.session.user,
                doctor:result[0],
                appointmentId
            });
            // return res.render('rescheduleAppointment',{
            //     user:req.session.user,
            //     doctor:result[0]
            // });
        })
        // client.close();/
    });
    // return res.render('rescheduleAppointment',{
    //     user:req.session.user
    // });
}
module.exports={
    home,
    doctor,
    hospital,
    doctorDetail,
    login,
    signup,
    contactUs,
    treatment,
    about,
    hospitalDetail,
    faqs,
    createDoctor,
    createHospital,
    enterOtp,
    logout,
    admin,
    adminDepartments,
    adminAppointments,
    adminPatients,
    tvastraPlus,
    changePassword,
    submitYourQuery,
    addDoctorFields,
    userProfile,
    adminHospitals,
    adminDoctor,
    createSchedule,
    removeSchedule,
    settings,
    appointments,
    confirmAppointment,
    rescheduleAppointment
};