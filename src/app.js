const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/html/index.html');
});
app.get('/doctor',(req,res)=>{
    res.sendFile(__dirname+"/html/doctor.html");
})
app.use(express.static(__dirname));
app.listen(3000,()=>{
    console.log('Server started running on port 3000');
});
module.exports = app;