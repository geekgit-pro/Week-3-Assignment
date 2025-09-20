const express = require('express');
const app = express();
const errorBuilder = require('./util/errorBuilder');

const adminRouter = require('./routes/adminRoute');


const port = 3000;

app.use('/admin', adminRouter);

app.use(errorBuilder.errorHandler)


app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});