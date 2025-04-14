const express = require('express');
const mongoose = require('mongoose');
const dontenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth.js');

dontenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('yes it connected');

    app.listen(process.env.PORT, () => {
        console.log(`yes server is running`);
    });
})

.catch((error) => {
    console.error('MDB is failed',error.message)
});