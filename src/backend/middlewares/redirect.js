const database = require('../database/database');
const dbName = database.dbName;
const client = database.client;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const redirectLogin = (req,res,next)=>{
    console.log(req.session.userId);
    if(!req.session.userId){
        res.redirect('/login');
    }
    else   
        next();
}
const redirectAdmin = (req,res,next) => {
    if(req.session.admin)
        res.redirect('/admin');
    else
        next();
}
const redirectHome = (req,res,next)=>{
    if(req.session.userId)
        res.redirect('/');
    else
        next();
}

const authAdmin = (req,res,next)=>{
    if(!req.session.admin)
        res.redirect('/login?method=email');
    else
        next();        
}

const redirectDoctorOrLogin = (req,res,next) => {
    if(req.session.userId){
        client.connect(function(err,client){
            assert.equal(null,err);
            const db = client.db(dbName);
            db.collection('users').findOne({_id:new ObjectID(req.session.userId)})
            .then(result =>{
                if(result){
                    if(result.doctor){
                        if(result.doctor == true)
                            next();
                        else
                            return res.redirect('/doctor');
                    }
                    else{
                        return res.redirect('/');
                    }
                }
                else{
                    return res.redirect('/logout');
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('/logout');
            });
        });
    }
    else{
        res.redirect('/login');
    }
}

const redirectAddDoctor = (req,res,next) => {
    if(req.session.userId){
        client.connect(function(err,client){
            assert.equal(null,err);
            const db = client.db(dbName);
            db.collection('users').findOne({_id:new ObjectID(req.session.userId)})
            .then(result => {
                if(result){
                    if(result.doctor){
                        if(result.doctor == true)
                            return res.redirect('/addDoctorFields');
                        else
                            next();
                    }
                    else{
                        next();
                    }
                }
                else{
                    res.redirect('/logout');
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('/logout');
            });
        })
    }
    else{
        res.redirect('/login');
    }
}

module.exports = {
    redirectLogin,
    redirectHome,
    authAdmin,
    redirectDoctorOrLogin,
    redirectAddDoctor,
    redirectAdmin
}