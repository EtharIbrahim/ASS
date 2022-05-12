const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const mongoose = require('mongoose');
const config = require('./config/keys');
const path = require('path');
const bodyParser = require('body-parser');
var session = require('express-session');
const BookRouter = require('./routes/bookRoutes');
const app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "seckwqwkj3r3290r301r903irkfjqkef230r31pfklkf2404flkelfk2et042tiofewokret",
    cookie: {
        secure: false,
        httpOnly: false
    }
}));

/******************************************MiddleWares  ********************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/users', userRoutes);
app.use('/books', BookRouter);

/******************************************MongoDb Connection********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') { // For running frontend if you are hosting both frontend and backend on the server. The server will serve the static build file in frontend/build
    app.use(express.static('./frontend/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));

    });
}

app.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));