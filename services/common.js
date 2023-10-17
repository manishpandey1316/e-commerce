const passport = require("passport");
const nodemailer = require("nodemailer");
exports.sanatizeUser=(user)=>
{
   return {id:user.id,role:user.role}
}

exports.checkAuthenticated=()=>
{
   return passport.authenticate('jwt',{session:false})

}
exports.cookieExtractor = function(req) {
   var token = null;
   if (req && req.cookies) {
       token = req.cookies['jwt'];
   }
   
   return token;
};

exports.createMail= async  ({email,subject,html})=>
{
  
 var smtpTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure:false,
      auth: {
          user: "itsmanih25@gmail.com",
          pass: process.env.MAIL_PASSWORD
      }
      
  });
 
  const info = await smtpTransport.sendMail({
   from: '"ecommerce" <itsmanih25@gmail.com>', // sender address
   to: email, // list of receivers
   subject: subject, // Subject line
   html: html, // html body
 });

  return info
}
   