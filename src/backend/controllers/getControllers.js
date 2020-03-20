function home(req,res){
    return res.render('index');
}
function doctor(req,res){
    return res.render('doctor');
}
function hospital(req,res){
    return res.render('hospital');
}
function doctorDetail(req,res){
    return res.render('doctorDetail');
}
function login(req,res){
    return res.render('login');
}
function signup(req,res){
    return res.render('signup');
}
function contactUs(req,res){
    return res.render('contact');
}
function treatment(req,res){
    return res.render('treatment');
}
module.exports={
    home:home,
    doctor:doctor,
    hospital:hospital,
    doctorDetail:doctorDetail,
    login:login,
    signup,
    contactUs,
    treatment
};