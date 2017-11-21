const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const Pusher = require('pusher');
const env = require('./src/env')

const pusher = new Pusher({
    appId: env.REACT_APP_PUSHER_APP_ID,
    key: env.REACT_APP_PUSHER_KEY,
    secret: env.REACT_APP_PUSHER_SECRET,
    cluster: 'us2',
    encrypted: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/message/send', (req, res) => {
    pusher.trigger( 'private-reactchat', 'messages', {
        message: req.body.message,
        username: req.body.username
    });
    res.sendStatus(200);
});

app.post('/pusher/auth', (req, res) => {
    console.log('POST to /pusher/auth');
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
