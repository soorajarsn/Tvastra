const express = require('express');
const compression = require('compression');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./backend/routes/mainRoutes');

const app = express();

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
// console.log('reached');
app.use('/',routes);
// console.log('crossed');
app.set('port',process.env.PORT || 3000);
// console.log('going to init');
app.listen(app.get('port'),()=>{
    console.log("App started running at "+app.get('port'));
});
module.exports = app;