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
   
exports.orderConfirmationMail= ({orderDetails})=>
{
   const address=orderDetails.deliveryAddress
   const items=orderDetails.orderedProducts
   const html=`<!DOCTYPE html>
   <html>
   <head>
       <title>Order Receipt</title>
       <style>
           body {
               font-family: Arial, sans-serif;
           }
           .container {
               max-width: 600px;
               margin: 0 auto;
               padding: 20px;
               border: 1px solid #ccc;
               border-radius: 5px;
           }
           table {
               width: 100%;
               border-collapse: collapse;
           }
           th, td {
               border: 1px solid #ccc;
               padding: 8px;
               text-align: left;
           }
           th {
               background-color: #f2f2f2;
           }
       </style>
   </head>
   <body>
       <div class="container">
           <h2>Order Receipt</h2>
           <p><strong>Delivery Address:</strong></p>
           
        *   <p>
               ${address.fullName}<br>
               ${address.street}<br>
               ${address.city}, ${address.state}, ${address.postalCode}<br>
               Phone: (123) 456-7890
           </p>
   
           <table>
               <thead>
                   <tr>
                       <th>order.</th>
                       <th>Quantity</th>
                       <th>Price per Item</th>
                       <th>Total</th>
                   </tr>
               </thead>
               <tbody>
               ${items.map(item=>(
                  `<tr>
                       <td>${item.product.title}</td>
                       <td>${item.quantity}</td>
                       <td>${item.product.price}</td>
                       <td>${item.product.price*item.quantity}</td>
                   </tr>`
                   ))}
               </tbody>
               <tfoot
                   <tr>
                       <td colspan="2"><strong>Total Items:</strong></td>
                       <td></td>
                       <td><strong>${orderDetails.totalItems}</strong></td>
                   </tr>
                   <tr>
                       <td colspan="2"><strong>Total Amount:</strong></td>
                       <td></td>
                       <td><strong>${orderDetails.total}</strong></td>
                </tr>
            </tfoot>
        </table>
    </div>
</body>
</html>
   `
return html
}