// require('dotenv').config({path:'./.env'}).load();
const dotenv = require('dotenv');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./backend/routes/mainRoutes');
const upload = require('express-fileupload');
const database = require('./backend/database/database');
const client = database.client;
const dbName = database.dbName;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const app = express();

dotenv.config();
app.use(upload());
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client'));
app.use(logger('dev'));
app.use(cookieParser());
app.set('views',__dirname+"/client/views");
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use(session({
    name:'userId',
    secret:"ldsjfowodljlc haierh L",
    resave:false,
    saveUninitialized:false,
    cookie:{path:'/',httpOnly:true,secure:false,maxAge:null}
}));
app.use(getUser);
app.use('/',routes);
app.set('port',process.env.PORT || 4000);
app.listen(app.get('port'),()=>{
    console.log("App started running at "+app.get('port'));
});

function getUser(req,res,next){
    console.log('Server going to get the user');
    if(req.session.userId){
        client.connect(function(err,client){
            assert.equal(err,null);
            client.db(dbName).collection('users').findOne({_id:new ObjectID(req.session ? req.session.userId : null)})
            .then(result => {
                if(result){
                    console.log('server got the user');
                    var isDoctor = false;
                    if(result.doctor)
                        isDoctor = true;
                    req.session.user = {
                        name:result.name,
                        imgAddress:result.imgAddress,
                        mobileNumber:result.mobileNumber,
                        userId:result._id,
                        isDoctor
                    }
                }
                else{
                    res.redirect('/logout');
                }
            })
            .catch(err=>{
                console.log(err);
                res.redirect('/logout');
            });
        });
    }
    next();
}

module.exports = app;