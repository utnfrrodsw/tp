const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

const routerApi = require('./routes');

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

/*app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.json({ message: 'Invalid Credentials '});
    }
}) */

routerApi(app);

app.listen(port, () => {
    console.log('Port =>> ', port);
});