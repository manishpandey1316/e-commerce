const passport = require("passport");
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