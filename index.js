const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const helmet = require('helmet');
const serverTimingMiddleware = require('server-timing-header');
const expressStaticGzip = require("express-static-gzip");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

console.log(process.env.NODE_ENV);

// middleware

app.use(require('express-status-monitor')());
app.use(helmet.hidePoweredBy({ setTo: 'foo' })); 
app.disable('x-powered-by')
app.use(helmet());
app.use(helmet.hidePoweredBy())
app.use(express.json()) //allows access req.body
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(serverTimingMiddleware({sendHeaders: (process.env.NODE_ENV !== 'production')}));
app.use('/', expressStaticGzip('./client/build'));

app.use(express.static(path.join(__dirname, './server/views/images')));

app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'hbs');


// simple invalid JWT handling 
// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//       res.status(401).json({"verified": false});
//     }
//   });


// routes
app.use("/", require("./server/routes/jwtAuth"));

app.use("/password-reset", require("./server/routes/passwordReset"));

app.use("/recipes", require("./server/api/recipes"));

app.use("/journals", require("./server/api/journals"));

app.use("/shots", require("./server/api/shots"));


// check production or dev env
if (process.env.NODE_ENV === "production"){
  //Server send
  app.use(express.static(path.join(__dirname, './client/build')));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html.gz"));
  })
}


// listening...
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}....`)
    // process.send('ready')
});

// // pm2
// process.on('SIGINT', function() {
//   db.stop(function(err) {
//     process.exit(err ? 1 : 0)
//   })
// })

// process.on('message', function(msg) {
//   if (msg == 'shutdown') {
//     console.log('Closing all connections...')
//     setTimeout(function() {
//       console.log('Finished closing connections')
//       process.exit(0)
//     }, 1500)
//   }
// })