const express = require('express');
const app = express();

const adminRouter = require('./routes/adminRoute');

const port = 3000;

app.use('/admin', adminRouter);


app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});