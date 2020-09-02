const database = require('../database/database');
const dbName = database.dbName;
const ObjectID = require('mongodb').ObjectID;
const url = require('url');
const fs = require('fs');
const Nexmo = require('nexmo');
const dotenv = require('dotenv');
dotenv.config();
const NEXMO_API_KEY = process.env.NEXMO_API_KEY;
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET;
const NEXMO_BRAND_NAME = process.env.NEXMO_BRAND_NAME;
var verifyRequestId  = null;
// const BusBoy = require('busboy');
const path = require('path');
// const doctors = database.doctors;
const client = database.client;
const assert = require('assert');
const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET
},{
    debug:true
});

function home(req,res){
    var {searchFor,location} = req.body;
    if(!searchFor || !location)
        return res.send({status:400,err:'All the fields are required'});
    searchFor = searchFor.split(":");
    req.session.searchFor = searchFor[0];
    req.session.search = searchFor[1];
    req.session.location = location;
    res.redirect('/doctor');
}

var userId = null;

// =============================================================================================================================================
// start of Validation functions
function validateContent(ob){
    for(var key in ob){
        if(ob[key].trim() === "")
            return false;
    }
    return true;
}
function validateImgAddress(imgAddress){
    if(imgAddress && imgAddress.trim())
        return true;
    else
        return false;
}
function validMobileNumber(number){
    if(number.length != 12 || isNaN(parseInt(number)))
        return false;
    else
        return true;
}
// end
// ==============================================================================================================================================


// ===============================================================================================================================================
// login Methods
function loginWithOtp(req,res){
    var {mobileNumber} = req.body;
    //if "/loginWithOtp" was accessed with mobileNumber = null, and mobileNumber is already saved in session variable, this means the user requested to resend the otp
    if(req.session.mobileNumber && !mobileNumber){
        req.session.otpSentAgainMsg = 'An OTP has been sent to your registered mobile number again.';
        mobileNumber = req.session.mobileNumber.toString();
    }
    else{
        req.session.mobileNumber = mobileNumber;
    }

    var stringRepMobile = '91'+mobileNumber.substr(mobileNumber.length-10);
    
    if(!validMobileNumber(stringRepMobile)){
        console.log('not valid ');
        res.redirect('/login');
    }
    else{

        mobileNumber = stringRepMobile;
        req.session.mobileNumber = mobileNumber;
    
        client.connect(function(err,client){
            assert.equal(err,null);
            const db = client.db(dbName);
            const namespace = db.collection('users');
            const user = namespace.findOne({mobileNumber});
            user.then(result=>{
                if(result){
                    mobileNumber = parseInt(mobileNumber);
                    userId = result._id;//to use after login, in verifyOtp route to save it in session;
                    nexmo.verify.request({
                        number:mobileNumber,
                        brand:NEXMO_BRAND_NAME,
                        next_event_wait: 60,
                        pin_expiry: 60
                    },(err,result)=>{
                        if(err)
                            console.log("Error while sending otp");
                        else{
                            verifyRequestId = result.request_id;
                        }
                    })
                    req.session.otpSentMsg = "An OTP has been sent to your registered mobile number";
                    res.redirect('/enterOtp');
                }
                else{
                    req.session.userNotFoundMsg = "User not found, Please check your credentials or signUp!";
                    console.log('usernot fund ');
                    res.redirect('/login');
                }
            }).catch(err=>{
                console.log("Error occured",err);
                req.session.error = "Something Went Wrong!";
                res.redirect('/login');
            })
        });
    }
}



function verifyOtp(req,res){
    var {otp} = req.body;
    var changePassword = req.query.changePassword;
    console.log(changePassword);
    if(!otp){
        req.session.otpErrorMsg = "Please enter the otp";
        if(changePassword){
            res.redirect(`/enterOtp/?changePassword=${changePassword}`);
        }
        else{
            res.redirect('/enterOtp');
        }
    }
    else{
        nexmo.verify.check({
            request_id: verifyRequestId,
            code: otp
        },(err,result)=>{
            if(err){
                req.session.otpErrorMsg = 'Error while verifying the otp';
                res.redirect(`/enterOtp/?changePassword=${changePassword}`);
            }
            else{
                if(result.status == 0){
                    if(changePassword){
                        res.redirect('/changePassword');
                    }
                    else{
                        req.session.userId = userId;
                        var isDoctor = false;
                        if(result.doctor)
                            isDoctor = true;
                        req.session.user = {
                            name:result.name,
                            mobileNumber:result.mobileNumber,
                            imgAddress:result.imgAddress,
                            userId:result._id,
                            isDoctor
                        }
                        req.session.mobileNumber = null;
                        req.session.signUpOrLogin = "Login Successfull!";
                        res.redirect('/');
                    }
                }
                else{
                    req.session.errorMsg = "Something went wrong, Please try again!";
                    if(changePassword)
                        res.redirect('/login/?method=email');
                    else
                        res.redirect('/login');
                }
            }
        });

        //you need to remove the below section
        /////////////////////////////////////
        // if(changePassword){
        //     res.redirect('/changePassword');
        // }
        // else{
        //     req.session.userId = userId;
        //     req.session.mobileNumber = null;
        //     req.session.signUpOrLogin = "Login Successfull!";
        //     res.redirect('/');
        // }
        /////////////////////////////////////
    }
}


function loginWithEmail(req,res){
    var {email,password} = req.body;
    email = email.trim();
    password = password.trim();

    
    //if the mobileNumber is saved among session variables then we won't be able to ensure whether users have access permission to the router /enterOtp; 
    // in case if he request the otp first, and then switch to this method of login
    if(req.session.mobileNumber)
        req.session.mobileNumber = null;

    if(!email || !password){
        res.redirect('/login/?method=email');
    }

    client.connect(function(err,client){
        assert.equal(err,null);
        const db = client.db(dbName);
        const namespace = db.collection('users');
        namespace.findOne({email,password})
        .then(result=>{
            if(result){
                req.session.userId = result._id;
                var isDoctor = false;
                if(result.doctor)
                    isDoctor = true;
                req.session.user = {
                    name:result.name,
                    mobileNumber:result.mobileNumber,
                    imgAddress:result.imgAddress,
                    userId:result._id,
                    isDoctor
                }
                if(result.email == "admin@admin.com"){
                    req.session.admin = true;
                    return res.redirect('/admin');
                }
                // else if(result.doctor){
                //     // db.collection('doctors').findOne({_id:new ObjectID(req.session.userId)})
                //     // .then(result => {
                //     //     if(result){
                //     //         res.redirect('/doctor');
                //     //     }
                //     //     else{
                //     //         res.redirect('/addDoctorFields');
                //     //     }
                //     // })
                //     // .catch(err => {
                //     //     console.log(err);
                //     //     res.redirect('/logout');
                //     // });
                //     if(result.doctor == true)
                //         return res.redirect('/addDoctorFields');
                //     else
                //         return res.redirect('/addDoctorFields');
                // }
                else{
                    req.session.signUpOrLogin = "Login Successfull!";
                    res.redirect('/');
                }
            }
            else{
                req.session.userNotFoundMsg = "User not found, Please check your credentials or SignUp!";
                res.redirect('/login/?method=email');
            }
        })
        .catch(err=>{
            req.session.errorMsg = "Something went wrong, Please try again!"
            res.redirect('/login/?method=email');
        });
    });
}

// end login methods
// ==============================================================================================================================================
//Password Change
function forgetPassword(req,res){
    const {email} = req.body;
    if(!email.trim()){
        req.redirect('/login/?method=email');
    }
    else{
        client.connect(function(err,client){
            assert.equal(err,null);
            const db = client.db(dbName);
            const namespace = db.collection('users');
            namespace.findOne({email})
            .then(result=>{
                if(result){
                    var mobileNumber = result.mobileNumber;
                    nexmo.verify.request({
                        number:mobileNumber,
                        brand:NEXMO_BRAND_NAME,
                        next_event_wait: 60,
                        pin_expiry: 60
                    },(err,result)=>{
                        if(err)
                            console.log("Error while sending otp");
                        else{
                            verifyRequestId = result.request_id;
                        }
                    })
                    req.session.otpSentMsg = "An OTP has been sent to your registered mobile number";
                    req.session.mobileNumber = mobileNumber;
                    req.session.email = email.trim();
                    res.redirect('/enterOtp/?changePassword=true');
                }
                else{
                    req.session.userNotFoundMsg = "User not found, Please check your credentials or SignUp!";
                    res.redirect('/login/?method=email');
                }
            })
        })
    }
}

function changePassword(req,res){
    var {password,confirmPassword} = req.body;
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    if(!password || !confirmPassword || password != confirmPassword){
        req.session.passwordError = true;
        res.redirect('/changePassword');
    }
    else{
        client.connect(function(err,client){
            assert.equal(err,null);
            const db = client.db(dbName);
            const namespace = db.collection('users');
            database.updateOne(namespace,{email:req.session.email},{password:password});
            req.session.passwordChanged = true;
            req.session.email = null;
            res.redirect('/login/?method=email');
        });
    }
}


// ================================================================================================================================================
// start of signup 
// var ID = null;
function signup(req,res){
    const reqBody = {
        name,
        email,
        password,
        confirmPassword,
        gender,
        dob,
        mobileNumber,
        city,
        state,
        country,
        doctor
    } = req.body;

    const mobileNumberErrorMsg = "The number is already registered!";
    const emailErrorMsg = "This email is already registered!";
    const errorMsg = "Something went wrong, Please try again";
    // console.log(reqBody);
    var valid = validateContent(reqBody);


    if(password != confirmPassword){
        valid = false;
    }
    

    if(!valid){
        res.redirect('/signup');
    }
    else{
        client.connect(function(err,client){
            assert.equal(null,err);
            const db = client.db(dbName);
            const namespace = db.collection('users');
            
            var stringRepMobile = '91'+mobileNumber.substring(mobileNumber.length-10);
            mobileNumber = stringRepMobile;

            namespace.findOne({mobileNumber:mobileNumber})
            .then(result=>{
                
                if(result){
                    req.session.mobileNumberErrorMsg = mobileNumberErrorMsg;
                    res.redirect('/signup');                   
                }
                else{
                    namespace.findOne({email:email})
                    .then(result => {
                        if(result){
                            req.session.emailErrorMsg = emailErrorMsg;
                            res.redirect('/signup');
                        }
                        else{
                            // generateId();
                            var doc = {
                                name:name.trim(),
                                email:email.trim(),
                                password:password.trim(),
                                gender:gender.trim(),
                                dob:dob.trim(),
                                mobileNumber:mobileNumber,
                                city:city.trim(),
                                state:state.trim(),
                                country:country.trim(),
                                imgAddress:'../assets/no-user-img.png'
                            }
                            if(doctor){
                                doc.doctor = true;
                            }
                            namespace.insertOne(
                                doc, 
                                function(err, r) {
                                    assert.equal(null, err);
                                    assert.equal(1, r.insertedCount);
                                    namespace.findOne({email:email.trim()})
                                    .then(result=>{
                                        if(result){
                                            req.session.userId = result._id;
                                            req.session.signUpOrLogin = "SignUp Successfull!";
                                            generateId(client,result._id);
                                            var isDoctor = false;
                                            if(result.doctor)
                                                isDoctor = true;
                                            req.session.user = {
                                                name:result.name,
                                                mobileNumber:result.mobileNumber,
                                                imgAddress:result.imgAddress,
                                                userId:result._id,
                                                isDoctor
                                            }
                                            if(result.email == "admin@admin.com"){
                                                req.session.admin = true;
                                                return res.redirect('/admin');
                                            }
                                            else if(doctor){
                                                res.redirect('/addDoctorFields');
                                            }
                                            else{
                                                res.redirect('/');
                                            }
                                        }
                                        else{
                                            req.session.errorMsg = errorMsg;
                                            res.redirect('/login?method=email');
                                        }
                                    })
                                    .catch(err=>{
                                        req.session.errorMsg = errorMsg;
                                        res.redirect('/logout');
                                    });
                                });
                        }
                    });
                }
            })
            .catch(err=>{
                req.session.errorMsg = errorMsg;
                res.redirect('/signup');
            });
            
        });
    }
}
function generateId(client,_id){
    var ID = Math.floor(Math.random()*100000)+1;
    ID = '0000'+ID.toString();
    ID = ID.substring(ID.length-5);
    console.log('Generated Id',ID);
    client.db(dbName).collection('users').findOne({id:ID})
    .then(res => {
        if(res)
            return generateId(client,_id);
        else 
            database.updateOne(client.db(dbName).collection('users'),{_id:new ObjectID(_id)},{id:ID});
    })
    .catch(err=>{
        console.error(err);
        return res.redirect('/logout');
    })
}
// signup end
// =============================================================================================================================================================

function addDoctorFields(req,res){

    client.connect(function(err,client){
        assert.equal(null,err);
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // db.collection('doctors');
        const reqBody = {
            about,
            speciality,
            treatmentList,
            hospitalList,
            qualification,
            location,
            yearsOfExperience,
            avgFees,
        } = req.body;   
        const {awards,achievements} = req.body;
        console.log(reqBody);
        var imgFile,imgAddress;
        var valid = validateContent(reqBody);
        if(!valid){ 
            console.log("validation failed");
            req.session.msg = "You're not allowed leave the areas blank";
            res.redirect('/addDoctorFields');
        }
        else{
            console.log("data validated");
            if(req.files){
                const file = req.files.profileImg;
                const mimetype = file.mimetype;
                if(mimetype === 'image/png' || mimetype === 'image/jpeg'){
                    console.log(file);
                    imgFile = file.name;
                    imgAddress = `../assets/${imgFile}`;
                    file.mv(path.join(__dirname,`../../client/assets/${imgFile}`),function(err){
                        if(err){
                            console.log('Error occured while saving the file : ',err);
                            imgAddress = '../assets/no-img.png';
                        }
                    });
                }
                else{
                    return res.status(400).json({msg:"Bad file uploaded as image"});
                }
            }
            else{
                imgAddress = '../assets/no-img.png';
            }
            console.log('final img address is, imgAddress : ',imgAddress);
            const namespace = db.collection('users');
            // db.collection('users').findOne({_id:new ObjectID(req.session.userId)})
            // .then(result => {
                // if(result){
                    var hospitals = [];
                    hospitalList.split(',').forEach(hospital => {
                        var hospitalDoc = {
                            name:hospital,
                            specialization:speciality,
                            treatments:treatmentList,
                            location:'N/A',
                            noOfBeds:1,
                            imgAddress:'../assets/no-img-hospital.jpeg',
                            verified:false
                        }
                        hospitals.push(hospitalDoc);
                        // database.insertOne(db.collection('hospitals'),hospitalDoc);
                    });
                    addHospitals(client,hospitals);
                    // var _id = new ObjectID(result._id);
                    // database.updateOne(db.collection('users'),{_id},{imgAddress});
                    doc = {
                        doctor:{
                            about,
                            speciality,
                            treatmentList,
                            hospitalList,
                            awards,
                            qualification,
                            location,
                            achievements,
                            yearsOfExperience,
                            avgFees,
                        },
                        imgAddress
                    }
                    database.updateOne(namespace,{_id:new ObjectID(req.session.userId)},doc);
                    res.redirect('/doctor');
                // }
                // else{
                    // res.redirect('/logout');
                // }
            // })
            // .catch(err => {
                // console.log(err);
                // res.redirect('/logout');
            // });
        }
    });
}
function addHospitals(client,hospitals){
    var namespace = client.db(dbName).collection('hospitals')
    hospitals.forEach(hospital => {
        namespace.findOne({name:hospital.name})
        .then(result=>{
            if(!result){
                database.insertOne(namespace,hospital);
            }
        })
        .catch(err=>{
            console.error(err);
            return res.redirect('/logout');
        });
    });
}
var updatedNumber = null;
function updateMobileNumber(req,res){
    // res.json({
    //     status:'success'
    // });
    var mobileNumber = req.body.number;
    mobileNumber = '91'+mobileNumber;
    console.log(mobileNumber);
    var valid = validMobileNumber(mobileNumber);
    if(valid){
        client.connect(function(err,client){
            const db = client.db(dbName);
            db.collection('users').findOne({mobileNumber:mobileNumber})
            .then(result=>{
                console.log(result);
                if(result){
                    req.session.alreadyRegistered = true;
                    return res.redirect('/userProfile');
                }
                else{
                    console.log('going to sent otp');
                    req.session.success = true;// comment it
                    updatedNumber = mobileNumber.substring(2);//comment it
                    // nexmo.verify.request({
                        // number:mobileNumber,
                    //     brand:NEXMO_BRAND_NAME,
                    //     next_event_wait: 60,
                    //     pin_expiry: 60
                    // },(err,result)=>{
                    //     if(err){
                    //         console.log("Error while sending otp");
                                // req.session.error = true;
                            // return res.redirect('/userProfile');
                    //     }
                    //     else{
                    //         verifyRequestId = result.request_id;
                                // updatedNumber = mobileNumber.substring(2);
                                // req.session.success = true;
                            // return res.redirect('/userProfile')
                    //     }
                    // });
                    // ========comment below
                    return res.redirect('/userProfile');
                }
            })
            .catch(err=>{
                console.log(err);
                return res.redirect('/logout');
            })
        })
    }
    else{
        req.session.invalidFormat = true;
        return res.redirect('/userProfile');
    }
}
function verifyOtpToUpdateMobile(req,res){
    const {otp} = req.body;
    // nexmo.verify.check({
    //         request_id: verifyRequestId,
    //         code: otp
    //     },(err,result)=>{
    //         if(err){
    //             req.session.otpError = 'Error while verifying the otp';
                    // req.session.success = true;
    //             res.redirect('/userProfile');
    //         }
    //         else{
    //             if(result.status == 0){
    //                 console.log('verified');
                        // req.session.updatedNumber = updatedNumber;
    //                 return res.redirect('/userProfile');
    //             }
    //             else{
                        // req.session.invalidOtp = true;
                        // req.session.success = true;
    //                 return res.redirect('/userProfile');
    //             }
    //         }
    //     });
    // ==================comment below
    req.session.updatedNumber = updatedNumber;
    return res.redirect('/userProfile')
}
function updateProfile(req,res){
    var  {
        name,
        mobileNumber,
        email,
        gender,
        dob,
        city,
        state,
        country
    } = req.body;
    var {timezone,house,colony} = req.body;
    var _id = req.query.id;
    var validContent = validateContent({name,mobileNumber,email,gender,dob,city,state,country});
    mobileNumber = '91'+mobileNumber;
    const validMobile = validMobileNumber(mobileNumber);
    console.log(validContent,validMobile);
    if(validContent && validMobile){
        client.connect(function(err,client){
            assert.equal(err,null);
            const db = client.db(dbName);
            db.collection('users').findOne({_id:new ObjectID(_id)})
            .then(result=>{
                var doc = {
                    name,mobileNumber,email,gender,dob,city,state,country,timezone,house,colony
                }
                var imgAddress = null;
                if(req.files){
                    const file = req.files.profileImg;
                    const mimetype = file.mimetype;
                    if(mimetype === 'image/png' || mimetype === 'image/jpeg'){
                        console.log(file);
                        imgFile = file.name;
                        imgAddress = `../assets/${imgFile}`;
                        file.mv(path.join(__dirname,`../../client/assets/${imgFile}`),function(err){
                            if(err){
                                console.log('Error occured while saving the file : ',err);
                            }
                        });
                    }
                }
                if(imgAddress){
                    doc.imgAddress = imgAddress;
                }
                if(result.doctor){
                    var {
                        speciality,
                        treatmentList,
                        hospitalList,
                        qualification,
                        yearsOfExperience,
                        awards,
                        location,
                        avgFees
                    } = req.body;
                    validContent = validateContent({
                        speciality,
                        treatmentList,
                        hospitalList,
                        qualification,
                        yearsOfExperience,
                        awards,
                        location,
                        avgFees
                    } ); 
                    if(validContent){
                        var doctorDoc = {
                            speciality,
                            treatmentList,
                            hospitalList,
                            qualification,
                            yearsOfExperience,
                            awards,
                            location,
                            avgFees
                        }
                        // if(imgAddress){
                        //     doc.imgAddress = imgAddress;
                        //     // doctorDoc.imgAddress = imgAddress;
                        // }
                        doc.doctor = doctorDoc;
                        database.updateOne(db.collection('users'),{_id:new ObjectID(_id)},doc);
                        console.log('going to update');
                        // database.updateOne(db.collection('doctors'),{_id:new ObjectID(_id)},doctorDoc);
                        return res.redirect('/userProfile/?_id='+_id);
                    }
                    else{
                        return res.status(400).send("Invalid form data");
                    }
                }
                else{
                    // if(imgAddress){
                    //     doc.imgAddress = imgAddress;
                    // }
                    database.updateOne(db.collection('users'),{_id:new ObjectID(_id)},doc);
                    console.log('going to update');
                    if(req.session.admin)
                        return res.redirect(`/admin/userProfile?_id=${_id}`);
                    else
                        return res.redirect('/userProfile/?_id='+_id);
                }
            })
        });
    }
    else{
        return res.status(400).send("Invalid form data");
    }
}
function verifyHospital(req,res){
    var _id = req.query.id;
    const {
        name,
        speciality,
        treatmentList,
        doctors,
        noOfBeds,
        infrastructure,
        package,
        location,
        charge,
        membership,
    } = req.body;
    // console.log(reqBody);
    // var haveImgAddress=false;
    var imgFile;
    var imgAddress;
    var valid = validateContent({
        name,
        speciality,
        treatmentList,
        doctors,
        noOfBeds,
        infrastructure,
        package,
        location,
        charge,
        membership,
    });
    // req.session.name = name;
    // req.session.imgAddress = imgAddress;
    // req.session.specialization = specialization;
    // req.session.hospitalPageTreatments = hospitalPageTreatments;
    // req.session.hospitalProfileTreatments = hospitalProfileTreatments;
    // req.session.doctors = doctors;
    // req.session.infrastructure = infrastructure;
    // req.session.packag = packag;
    // req.session.hospitalPageLocation = hospitalPageLocation;
    // req.session.hospitalProfileLocation = hospitalProfileLocation;
    // req.session.charge = charge;
    // req.session.membership = membership;
    // req.session.noOfBeds = noOfBeds;
    if(!valid){
        return res.status(400).json({Failure:'Invalid Data'});
    }
    else{
        console.log('data Validated');
        if(req.files){
            const file = req.files.imgFile;
            const mimetype = file.mimetype;
            if(mimetype === 'image/png' || mimetype === 'image/jpeg'){
                console.log(file);
                imgFile = file.name;
                imgFile = imgFile.split('.')[0] + Math.round(Math.random()*100000)+`.${imgFile.slice((imgFile.lastIndexOf('.') - 1 >>> 0 ) +2)}`
                imgAddress = `../assets/${imgFile}`;
                console.log('going to move the file : path',path.join(__dirname,`../../client/assets/${imgFile}`));
                file.mv(path.join(__dirname,`../../client/assets/${imgFile}`),function(err){
                    if(err){
                        console.log('Error occured while saving the file : ',err);
                        throw err;
                    }
                });
            }
        }
        console.log('final img address is, imgAddress : ',imgAddress);
        location = location.split(',').join(', ');
        var doc = {
            name,
            specialization:speciality,
            treatments:treatmentList,
            doctors,
            noOfBeds,
            infrastructure,
            package,
            location,
            charge,
            membership,
            verified:true
        }
        if(imgAddress)
            doc.imgAddress = imgAddress;
        console.log('going to create hospital database, and Doc is :',doc);
        var query = {_id:new ObjectID(_id)};
        client.connect(function(err,client){
            assert.equal(null,err);
            const db = client.db(dbName);
            const collection = 'hospitals';
            const namespace = db.collection(collection);
            database.updateOne(namespace,query,doc);
        })
        return res.redirect('/admin/hospitals');
        
    }
}
function createSchedule(req,res){
    var {day,hospital,timeFrom,timeTo,interval} = req.body;
    const valid = validateContent({day,hospital,timeFrom,timeTo,interval});
    interval = parseInt(interval);
    console.log({day,hospital,timeFrom,timeTo,interval});
    // console.log( convertInto12Hour(timeFrom));
    // console.log(convertInto12Hour(timeTo));
    console.log(req.query._id);
    if(valid){
        const _id = new ObjectID(req.query._id);
        client.connect(function(err,client){
            assert.equal(err,null);
            const db = client.db(dbName);
            const namespace = db.collection('users');
            namespace.findOne({_id})
            .then(result => {
                var schedule = [];
                if(result.doctor && result.doctor.appointmentDetails && result.doctor.appointmentDetails.schedule){
                    schedule = result.doctor.appointmentDetails.schedule;
                }
                if(result.doctor){
                    var validTiming = validateTimings(schedule.filter(sch => sch.day == day),{timeFrom,timeTo});
                    console.log('Is Timings valid : ',validTiming);
                    timeFrom = convertInto12Hour(timeFrom);
                    timeTo = convertInto12Hour(timeTo);
                    if(validTiming){
                        var slots = createSlots(timeFrom,timeTo,interval);
                        // schedule.push({
                        //     day,
                        //     timing:{timeFrom,timeTo},
                        //     hospital,
                        //     slots:slots,
                        //     interval
                        // });
                        // var doc = {"doctor.appointmentDetails.schedule":schedule};
                        // console.log(doc);
                        // database.updateOne(namespace,{_id},doc);
                        console.log(slots);
                        namespace.updateOne({_id:new ObjectID(req.session.userId)},{$push:{"doctor.appointmentDetails.schedule":{
                                day,
                                timing:{timeFrom,timeTo},
                                hospital,
                                slots:slots,
                                interval
                            }
                        }});
                        return res.redirect('/createSchedule');
                    }
                    else{
                        req.session.invalidTiming = true;
                        return res.redirect('/createSchedule');
                    }
                }
                else{
                    return res.status(400).send({error:"Bad Request"});
                }
            }).catch(err => {
                console.log(err);
                return res.redirect('/logout');
            });
        });
    }
    else{
        // req.session.invalidData = true;
        return res.status(400).json({Error:"All the fields are required"});
    }
    // return res.redirect('/createSchedule');
}
function validateTimings(schedule,newTimings){
    var valid = true;
    schedule.forEach(sch => {
        var timeFrom = convertInto24Hour(sch.timing.timeFrom);
        var timeTo = convertInto24Hour(sch.timing.timeTo);
        // var newTimeFrom = convertInto24Hour(newTimings.from)
        // var newTimeTo = convertInto24Hour(newTimings.to);
        var newTimeFrom = newTimings.timeFrom;
        var newTimeTo = newTimings.timeTo;
        console.log(timeFrom,timeTo,newTimeFrom,newTimeTo);
        console.log(newTimeFrom >= timeFrom && newTimeFrom < timeTo );
        console.log(newTimeTo > timeFrom && newTimeTo <= timeTo);
        if(newTimeFrom >= timeFrom && newTimeFrom <= timeTo)
            valid = false;
        else if(newTimeTo > timeFrom && newTimeTo <= timeTo)
            valid = false;
    });
    return valid;
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
function convertInto12Hour(time24h){
    var [hour,min] = time24h.split(':');
    console.log(hour,min);
    var modifier = '';
    if(hour == 0){
        hour = 12;
        modifier = "AM";
    }
    else if(hour < 12)
        modifier = "AM";
    else if(hour == 12)
        modifier = "PM";
    else{
        hour -= 12;
        if(hour < 10)
            hour = '0'+hour;
        modifier = "PM";
    }
    return `${hour}:${min} ${modifier}`;
}
function createSlots(timeFrom,timeTo,interval){
    var hoursToAdd = parseInt(interval/60);
    var minsToAdd = parseInt(interval%60);
    var modifier = timeFrom.substring(6,8);
    var start = timeFrom;
    var slots = [];
    while(convertInto24Hour(start) < convertInto24Hour(timeTo)){
        var hh = parseInt(start.substring(0,2));
        var mm = parseInt(start.substring(3,5));
        hh = parseInt(hh)+hoursToAdd;
        mm = parseInt(mm)+minsToAdd;
        if(mm >= 60){
            mm = mm - 60;
            hh = hh+1;
            if(hh == 12){
                if(modifier == "PM")
                    break;
                modifier == 'AM' ? modifier = 'PM' : modifier = 'AM';
            }
            else if(hh == 13){
                hh = 1;
            }
        } 
        if(hh < 10)
            hh = '0'+hh.toString();
        if(mm < 10)
            mm = '0'+mm.toString();
        end = `${hh}:${mm} ${modifier}`;
        console.log(modifier);
        slots.push({slot:[start,end].join('-'),status:'active'});
        start = end;
    }
    return slots;
}
function disableSchedule(req,res){
    const {day,timeFrom,timeTo,disabled} = req.body;
    console.log({day,timeFrom,timeTo,disabled});
    client.connect(async function(err,client){
        const namespace = client.db(dbName).collection('users');
        if(disabled){
            await namespace.updateOne(
                {_id:new ObjectID(req.session.userId),"doctor.appointmentDetails.schedule.day":day,"doctor.appointmentDetails.schedule.timing.timeFrom":timeFrom,"doctor.appointmentDetails.schedule.timing.timeTo":timeTo},
                {$set:{"doctor.appointmentDetails.schedule.$.status":"disabled"}}
                );
            namespace.updateMany({_id:new ObjectID(req.session.userId)},
            {$set:{"doctor.appointmentDetails.schedule.$[i].slots.$[].status":"disabled"}},
            {
                arrayFilters:[{"i.day":day,"i.timing.timeFrom":timeFrom,"i.timing.timeTo":timeTo}],
                multi:true
            });
        }
        else{
            await namespace.updateOne(
                {_id:new ObjectID(req.session.userId),"doctor.appointmentDetails.schedule.day":day,"doctor.appointmentDetails.schedule.timing.timeFrom":timeFrom,"doctor.appointmentDetails.schedule.timing.timeTo":timeTo},
                {$set:{"doctor.appointmentDetails.schedule.$.status":"active"}}
                );
            namespace.updateMany({_id:new ObjectID(req.session.userId)},
            {$set:{"doctor.appointmentDetails.schedule.$[i].slots.$[].status":"active"}},
            {
                arrayFilters:[{"i.day":day,"i.timing.timeFrom":timeFrom,"i.timing.timeTo":timeTo}],
                multi:true
            });
        }
        return res.redirect('/createSchedule');
    });
}
function disableSlot(req,res){
    const {day,timeFrom,timeTo,disabled,slot} = req.body;
    console.log({day,timeFrom,timeTo,disabled});
    client.connect(async function(err,client){
        const namespace = client.db(dbName).collection('users');
        if(disabled){
            await namespace.updateOne(
                {_id:new ObjectID(req.session.userId)},
                {$set:{"doctor.appointmentDetails.schedule.$[i].slots.$[j].status":"disabled"}},
                {
                    arrayFilters:[{"i.day":day,"i.timing.timeFrom":timeFrom,"i.timing.timeTo":timeTo},{"j.slot":slot}]
                }
                );
        }
        else{
            await namespace.updateOne(
                {_id:new ObjectID(req.session.userId),"doctor.appointmentDetails.schedule.day":day,"doctor.appointmentDetails.schedule.timing.timeFrom":timeFrom,"doctor.appointmentDetails.schedule.timing.timeTo":timeTo},
                {$set:{"doctor.appointmentDetails.schedule.$.status":"active"}}
                );
            await namespace.updateOne(
                {_id:new ObjectID(req.session.userId)},
                {$set:{"doctor.appointmentDetails.schedule.$[i].slots.$[j].status":"active"}},
                {
                    arrayFilters:[{"i.day":day,"i.timing.timeFrom":timeFrom,"i.timing.timeTo":timeTo},{"j.slot":slot}]
                }
                );
        }
        req.session.shownSlotList = [day,timeFrom.split(' ').join(''),timeTo.split(' ').join('')].join('-');
        return res.redirect('/createSchedule');
    });
}
function settings(req,res){
    var {password,confirmPassword} = req.body;
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    if(!password || !confirmPassword || password != confirmPassword){
        return res.status(400).json({Error:"Both fields, password and confirmPassword are required!"});
    }
    else{
        client.connect(function(err,client){
            assert.equal(err,null);
            const db = client.db(dbName);
            const namespace = db.collection('users');
            database.updateOne(namespace,{_id:ObjectID(req.session.userId)},{password:password});
            req.session.passwordChanged = true;
            res.redirect('/settings');
        });
    }
}
function bookSlot(req,res){
    const {date,time,email,hospital} = req.body;
    client.connect(function(err,client){
        assert.equal(null,err);
        var db = client.db(dbName);
        db.collection('users').findOne({_id:new ObjectID(req.session.userId)})
        .then(result => {
            db.collection('users').findOne({email})
            .then(result2 => {
                db.collection('hospitals').findOne({name:hospital})
                .then(result3 => {
                    return res.render('bookAppointment',{
                        user:req.session.user,
                        doctor:{
                            name:result2.name,
                            hospital,
                            treatments:result2.doctor.treatmentList,
                            qualification:result2.doctor.qualification,
                            email:result2.email,
                            imgAddress:result2.imgAddress
                        },
                        hospital:{
                            name:result3.name,
                            location:result3.location,
                            imgAddress:result3.imgAddress
                        },
                        name:result.name,
                        mobileNumber:result.mobileNumber,
                        email:result.email,
                        date,
                        time,
                        bookingStatus:false,
                        appointmentId:null
                    });
                })
            })
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/doctor');
        })
    })
}
function bookAppointment(req,res){
    var {forWhome,name,mobileNumber,patientMobileNumber,patientEmail,doctorEmail,hospitalName,date,time,doctorName,treatments,qualification,location,doctorImage,hospitalImage} = req.body;
    validContent = validateContent({forWhome,name,mobileNumber,patientMobileNumber,patientEmail});
    mobileNumber = '91'+mobileNumber.substring(mobileNumber.length-10);
    patientMobileNumber = '91'+patientMobileNumber.substring(patientMobileNumber.length-10);
    console.log(!validateContent,!validMobileNumber(mobileNumber),!validMobileNumber(patientMobileNumber));
    if(!validContent || !validMobileNumber(mobileNumber) || !validMobileNumber(patientMobileNumber))
        return res.status(400).json({Error:"Bad Request"});
    const _id = new ObjectID();
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var day;
    if(date == "Today"){
        var d = new Date();
        dt = d.getDate();
        if(dt < 10)
            dt = '0'+dt;
        day = days[d.getDay()];
        date = [dt,months[d.getMonth()],d.getFullYear()].join(' ');
    }
    else if(date == "Tomorrow"){
        var d = new Date(new Date().setDate(new Date().getDate()+1));
        console.log(d);
        dt = d.getDate();
        if(dt < 10)
            dt = '0'+dt;
        day = days[d.getDay()];
        date = [dt,months[d.getMonth()],d.getFullYear()].join(' ');
    }
    else{
        var d = date.split(' ');
        var dt = new Date(d[2],months.indexOf(d[1]),d[0]);
        day = days[dt.getDay()];
    }
    var doctorDoc = {
        _id,
        slot:{date,timing:{timeFrom:time}},
        patientMobile: patientMobileNumber,
        userMobile:mobileNumber,
        hospital:hospitalName,
        status:'booked'
    }
    var patientDoc = {
        _id,
        doctor:{name:doctorName,email:doctorEmail},
        slot:{day,date,time},
        hospital:hospitalName,
        status:'booked'
    }
    client.connect(function(err,client){
        assert.equal(err,null);
        const namespace = client.db(dbName).collection('users');
        namespace.findOne({"appointment.doctor.email":doctorEmail,"appointments.slot.date":date,"appointments.slot.time":time})
        .then(result => {
            if(!result){
                namespace.updateOne({email:doctorEmail},{$push:{"doctor.appointmentDetails.booked":doctorDoc}});
                namespace.updateOne({mobileNumber},{$push:{"appointments":patientDoc}});
                req.session.bookAppointmentFields = {
                    doctor:{
                        name:doctorName,
                        hospital:hospitalName,
                        treatments,
                        qualification,
                        email:doctorEmail,
                        imgAddress:doctorImage
                    },
                    hospital:{
                        name:hospitalName,
                        location,
                        imgAddress:hospitalImage
                    },
                    name,
                    mobileNumber:mobileNumber.substring(2),
                    patientEmail,
                    date,
                    time,
                    bookingStatus:true,
                    appointmentId:_id
                }
                // return res.render('bookAppointment',{
                //     user:req.session.user,
                    
                // });
                return res.redirect('/confirmAppointment');
            }
        })
    });
    // console.log(doctorDoc);
    // console.log(patientDoc);
   
}
function cancelAppointment(req,res){
    const _id = new ObjectID(req.query._id);
    const page = req.query.page;
    console.log(_id);
    client.connect(function(err,client){
        assert.equal(err,null);
        const namespace = client.db(dbName).collection('users');
        namespace.updateOne({"appointments._id":_id},{$set:{"appointments.$.status":"cancelled"}});
        // updateOne({"appointments._id":_id},{$set:{"appointments.$.status":"cancelled"}})
        namespace.updateOne({"doctor.appointmentDetails.booked._id":_id},{$set:{"doctor.appointmentDetails.booked.$.status":"cancelled"}});
        req.session.appointmentCancelled = true;
        if(page == 'appointments'){
            return res.redirect('/appointments')
        }  
        else{
            return res.redirect('/doctor')
        }
    });
}
async function rescheduleAppointment(req,res){
    const _id = new ObjectID(req.query._id);
    const {date,time,email,hospital} = req.body;
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dt = date.split(' ');
    var day = days[new Date(dt[2],months.indexOf(dt[1]),dt[0]).getDay()];
    console.log(_id);
    // console.log(client);
    // client.connect((err,client)=>console.log(client.db(dbName).collection('users')));
    // console.log(client.db(dbName).collection('users'));
    const namespace = client.db(dbName).collection('users');
    namespace.updateOne({"appointments._id":_id},{$set:{"appointments.$.slot.day":day,"appointments.$.slot.date":date,"appointments.$.slot.time":time}});
    namespace.updateOne({"doctor.appointmentDetails.booked._id":_id},{$set:{"doctor.appointmentDetails.booked.$.slot.date":date,"doctor.appointmentDetails.booked.$.slot.timing.timeFrom":time}});
    namespace.findOne({"appointments._id":_id})
    .then(result => {
        namespace.findOne({email})
        .then(result2=>{
            client.db(dbName).collection('hospitals').findOne({name:hospital})
            .then(result3 => {
                req.session.bookAppointmentFields = {
                    doctor:{
                        name:result2.name,
                        hospital,
                        treatments:result2.doctor.treatmentList,
                        qualification:result2.doctor.qualification,
                        email,
                        imgAddress:result2.imgAddress
                    },
                    hospital:{
                        name:hospital,
                        location:result3.location,
                        imgAddress:result3.imgAddress
                    },
                    name:result.name,
                    mobileNumber:result.mobileNumber.substring(2),
                    patientEmail:null,
                    date,
                    time,
                    bookingStatus:true,
                    appointmentId:_id
                }
                res.redirect('/confirmAppointment');
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/appointments');
    });
    // res.end();
    // client.connect()
}
module.exports = {
    home, 
    loginWithOtp,
    loginWithEmail,
    signup,
    verifyOtp,
    forgetPassword,
    changePassword,
    addDoctorFields,
    updateMobileNumber,
    verifyOtpToUpdateMobile,
    updateProfile,
    verifyHospital,
    createSchedule,
    disableSchedule,
    disableSlot,
    settings,
    bookSlot,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment
};
`MultiOrgan Transplant, Orthopadic Surgery, Infertility Treatments, Dentistry, Cardiology, Cancer, Neurology, Chemotherapy, Blood Transfusion, Paliative Care, Immunotherapy, Vaccine therapy `