const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3005;


function userCheckMiddleware (req, res, next) {
    let username = req.headers['username'];
    let password = req.headers['password'];
    if(!username || !password) {
        const err = new Error('Username and password are required');
        err.status = 400;
        console.error(err.message);
        next(err);
    }
    else if (username === 'aijaz' && password === 'password123') {
         return next();
    }
}

function kidneyCheckMiddleware (req, res, next) {
    let noOfKidneys = req.body.noOfKidneys;
    if (!noOfKidneys) {
        return res.status(400).send('Number of kidneys is required');
    }
    if(noOfKidneys > 0 && noOfKidneys <= 2) {
        return next();
    }   
}

function heartCheckMiddleware (req, res, next) {
    let heartBpm = req.query.heartBpm;
    if (!heartBpm) {
        return res.status(400).send('Heart BPM is required');
    }
    else
        return next();
}

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



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});                                                                                                                         