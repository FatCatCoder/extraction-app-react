const express = require("express");
const app = express();
const process = require('process');
const path = require("path");
const cors = require("cors");
const helmet = require('helmet');
const serverTimingMiddleware = require('server-timing-header');
// const expressStaticGzip = require("express-static-gzip");
const PORT = process.env.PORT || 5000;
require("dotenv").config();


// -- middleware -- //

app.use(require('express-status-monitor')());
app.use(helmet());
app.use(express.json()) //allows access req.body
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(serverTimingMiddleware({sendHeaders: (process.env.NODE_ENV !== 'production')}));
// app.use('/', expressStaticGzip('./client/build'));
app.use(express.static(path.join(__dirname, './server/views/images')));
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'hbs');



// -- API routes -- //

app.use("/admin", require("./server/routes/admin"));

app.use("/api", require("./server/api/jwtAuth"));

app.use("/api/password-reset", require("./server/api/passwordReset"));

app.use("/api/recipes", require("./server/api/recipes"));

app.use("/api/journals", require("./server/api/journals"));

app.use("/api/shots", require("./server/api/shots"));

app.get('/api/underattack', (req, res) => {
  console.log('Under attack!');
  res.send('Under attack!');
})

// listening...
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}....`)
    process.send('ready')
});
