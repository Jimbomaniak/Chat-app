let path = require('path');
let bodyParser = require('body-parser');
let express = require('express');
let app = express();
let http = require('http').Server(app);

let messages = [];
let users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index-xhr.html'))
});
app.get('/services/chat_ajax.js', (req, res) => {
  res.sendFile(__dirname + '/services/chat_ajax.js')
});


app.post('/users', (req, res) => {
    users.push(req.body);
    res.end();
});

app.post('/messages', (req, res) => {
    if (messages.length > 100) {
        messages.shift();
    }
    messages.push(req.body);
    res.end();
});

app.get('/chat-data', (req, res) => {
    res.json({
        users: users,
        messages: messages,
    })
});

app.delete('/user/del', (req, res) => {
    users.splice(users.findIndex(user => user.userNick === req.body.nick), 1);
});

http.listen(3030, () => {
    console.log('Running on port: 3030');
});

// --- Over 100 messages test helper ---
// for (let i=0; i < 99; i++){
//     messages.push({
//         nickname: 'Filler',
//         text: `${i}`,
//         createdAt: new Date(),
//     });
// }
