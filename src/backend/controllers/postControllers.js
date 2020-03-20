function login(req,res){
    const {mobileNumber,otp} = req.body;
    if(!(mobileNumber && otp))
        return res.render('login',{
            msg:"Please enter correct details"
        });
    else{
        res.redirect('/');
    }
}
function signup(req,res){
    res.redirect('/');
}
module.exports = { 
    login:login,
    signup
};