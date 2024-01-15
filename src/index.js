const express = require('express');
const rateLimit = require('express-rate-limit');
const {createProxyMiddleware} = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();


const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(limiter);

app.use('/flightservice' , createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE, 
    changeOrigin:true, 
    pathRewrite: {'^/flightservice' : '/'}
}));

app.use('/bookingservice', createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE, 
    changeOrigin:true, 
    pathRewrite: {'^/bookingservice' : '/'}
}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});


/**
 * METhod - 1
 *  localhost:3000/api/v1/flights - one way is to expose this IP to the client, which we dont want to do 
 * 
 * Method - 2
 * 
 *  user -----> localhost:5000  ------>  localhost:3000/api/v1/flights (Flights service)
 *                      |
 *                      |
 *                      -------------->  localhost:4000/api/v1/bookings (Booking service)
 *  
 *  localhost:5000/bookingService/api/v1/bookings --> forward it to booking service
 *  localhost:5000/flightService/api/v1/flights  --->  forward it to flights service
 * 
 */