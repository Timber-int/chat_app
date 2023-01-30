const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoute');
const messageRoute = require('./routes/messageRoute');

const app = express();
require('dotenv').config();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoute);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`DB connection successfully`);
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

