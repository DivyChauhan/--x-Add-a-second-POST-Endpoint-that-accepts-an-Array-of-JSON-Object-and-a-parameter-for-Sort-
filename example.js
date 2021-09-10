const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const positions = [
    { position: '1' },
    { position: '2' },
    { position: '3' },
    { position: '4' },
];

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to my first API'
    });
});

app.post('/api/positions', (req, res) => {
    res.send(req.body.reverse())
});

app.post('/api/positions/posts', (req, res) => {
    res.send(req.body.sort((a, b) => {
        return a.position - b.position
    }))
});

// end point protected route with jwt token
app.get('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.send(
                positions
            );
        }
    });
});

app.post('/api/login', (req, res) => {
    // Mock user

    jwt.sign({}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server Started'));