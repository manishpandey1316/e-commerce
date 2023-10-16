const { ProductRouter } = require("./Routes/Product");
const { BrandRouter } = require("./Routes/Brand");
const { CategoryRouter } = require("./Routes/Category");
const { UserRouter } = require("./Routes/User");
const { AuthRouter } = require("./Routes/Auth");
const { CartRouter } = require("./Routes/Cart");
const { OrderRouter } = require("./Routes/Order");
const { User } = require("./Models/User");
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const cookieParser = require('cookie-parser')
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const crypto = require("crypto");
const {checkAuthenticated,sanatizeUser,cookieExtractor}=require('./services/common')
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY)
const path=require('path');
const { Order } = require("./Models/Order");

const server = express();
//imports

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  
}
main().catch((err) => {
  
});
//db



const endpointSecret = process.env.ENDPOINT_SECRET;

server.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      try{
        const order = Order.findById(paymentIntentSucceeded.metadata.orderId)
        order.paymentStatus="Received"
        order.save()
      }
      catch(err){
        console.log(err);
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
//webhook

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

server.use(passport.initialize()) 
// init passport on every route call.
server.use(passport.session())   
//session

server.use(
  cors({
    exposedHeaders: ["X-Total-count"],
  })
);

server.use(express.static(path.resolve(__dirname,'build')));
server.use(express.json());
server.use(express.urlencoded());
server.use(cookieParser());
server.use("/products",checkAuthenticated(),ProductRouter);
server.use("/brands", checkAuthenticated(),BrandRouter);
server.use("/categories",checkAuthenticated(),CategoryRouter);
server.use("/users", checkAuthenticated(),UserRouter);
server.use("/auth", AuthRouter);
server.use("/carts", checkAuthenticated(),CartRouter);
server.use("/orders",checkAuthenticated(), OrderRouter);


server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'build','index.html'));
})
//middlewares



server.post("/create-payment-intent", async (req, res) => {
  const { total,orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
      orderId
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
//stripe payment intent


passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return done(null, {message:"user doesn't exist"});
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
          
          if(err) {return done(null,err)}
          if(!crypto.timingSafeEqual(user.password, hashedPassword)) {return done(null, {message:"invalid password"});}
          // if passwords match return user
          return done(null, sanatizeUser(user));
        })
       
      } catch (error) {
      
        return done(error, false);
      }
    }
  )
);


var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;
passport.use('jwt',new JWTStrategy(opts, async function(jwt_payload, done) {
  try{
    const user= await User.findById( jwt_payload.id) 
        if (user) {
            return done(null, sanatizeUser(user));
        } else {
            return done(null, false);
            // or you could create a new account
        }
      }
      catch(err)
      {
          return done(err, false);
      }
      
    }))


//strategy



passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    
    cb(null, sanatizeUser(user));
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    
    return cb(null, user);
  });
});



server.listen(process.env.PORT);
