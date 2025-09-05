const { error } = require('console');
const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3005;

let requestCount = 0;
let errorCount = 0;

let noOfRequestsPerUser = {};

setInterval(() => {
    noOfRequestsPerUser = {};
}, 15000);

function requestCalculator(req, res, next) {
    requestCount++;
    console.log(`Request Count: ${requestCount}`);
    return next();
}

function rateLimiter(req, res, next) {
    const userId = req.headers['userid'];
    if(!userId) {
        const err = new Error('UserId header is required');
        err.status = 400;
        console.error(err.message);
        return next(err);
    }

    if(!noOfRequestsPerUser[userId])
        noOfRequestsPerUser[userId] = 1;
    else
        noOfRequestsPerUser[userId]++;

    if(noOfRequestsPerUser[userId] > 5) {
        const err = new Error('Too many requests from this user');
        err.status = 429;
        console.error(err.message);
        return next(err);
    }
    return next();
}


function loggingMiddleware(req, res, next) {
    console.log('Response sent for:', req.url);
    const log = `${Date.now()} : ${req.path} : 'New Request Received\n : `;
    fs.appendFile("log.txt", log, (err, data)=> {
        if (err) {
            res.statusCode = 500;
            return res.send("Server error");
        }
    });
    next(); // can omit if it's the last one
}


function userCheckMiddleware (req, res, next) {
    let username = req.headers['username'];
    let password = req.headers['password'];
    if(!username || !password) {
        const err = new Error('Username and password are required');
        err.status = 400;
        console.error(err.message);
        return next(err);
    }
    else if (username === 'aijaz' && password === 'password123') {
         return next();
    }
    else {
        const err = new Error('Invalid username or password');
        err.status = 403;
        console.error(err.message);
        return next(err);
    }
}

function kidneyCheckMiddleware (req, res, next) {
    let noOfKidneys = req.body.noOfKidneys;
    if (!noOfKidneys) {
        const err = new Error('Number of kidneys is required');
        err.status = 400;
        console.error(err.message);
        return next(err);
    }
    if(noOfKidneys > 0 && noOfKidneys <= 2) {
        return next();
    }
    
    const err = new Error('Invalid number of kidneys');
    err.status = 403;
    console.error(err.message);
    next(err);
}

function heartCheckMiddleware (req, res, next) {
    let heartBpm = req.query.heartBpm;
    if (!heartBpm) {
        const err = new Error('Number of kidneys is required');
        err.status = 400;
        console.error(err.message);
        return next(err);
    }
    else
        return next();
}

app.use(loggingMiddleware);
app.use(requestCalculator);
app.use(rateLimiter);
app.use(userCheckMiddleware);


app.post('/kidney', kidneyCheckMiddleware, (req, res) => {
    if(req.body.pH > 3 && req.body.pH < 7) {
        res.status(200).json({
            message: 'The kidney is functioning well',
            pH: `The pH level is ${req.body.pH}`,
            userMsg : `You are fit ${req.headers['username']}`
        });
    }
    else {
        res.status(200).json({
            message: 'The kidney is not functioning well',
            pH: `The pH level ${req.body.pH} not normal range`,
            userMsg : `Take care ${req.headers['username']}`
        });
    }
})


app.post('/heart', heartCheckMiddleware, (req, res) => {
    if(req.query.heartBpm > 60 && req.query.heartBpm < 100) {
        res.status(200).json({
            message: 'The heart is functioning well',
            heartBpm: `The heart BPM is ${req.query.heartBpm}`,
            userMsg : `You are fit ${req.headers['username']}`
        });
    }
    else {
        res.status(200).json({
            message: 'The heart is not functioning well',
            heartBpm: `The heart BPM ${req.query.heartBpm} not normal range`,
            userMsg : `Take care ${req.headers['username']}`
        });
    }
});


app.use((err, req, res, next) => {
    errorCount++;
    console.log(`Error Count: ${errorCount}`);
    return next(err);
    //next();
});


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500       
        }, 
        errorCount
    });
    //next();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});                                                                                                                         