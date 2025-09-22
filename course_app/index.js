const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const errorBuilder = require('./util/errorBuilder');

const adminRouter = require('./routes/adminRoute');
const userRouter = require('./routes/userRoute');




const port = 3000;

app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.use(errorBuilder.errorHandler)


app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});