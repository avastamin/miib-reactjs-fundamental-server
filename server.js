
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/posts', (req, res) => {
  let options = {
    root: __dirname + '/data/'
  };

  const fileName = 'posts.json';
  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
  });
});

app.post('/api/posts/add', (req, res) => {
  let jsonFile = __dirname + '/data/posts.json';
  let newPost = req.body;
  console.log('Adding new post:', newPost);
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let posts = JSON.parse(data);
    posts.push(newPost);
    let postsJson = JSON.stringify(posts, null, 2);
    fs.writeFile(jsonFile, postsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      // You could also respond with the database json to save a round trip
      res.sendStatus(200);
    });
  });
});

//
app.post('/api/post/delete', (req, res) => {
    let jsonFile = __dirname + '/data/posts.json';
  let id = req.body.id;
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let posts = JSON.parse(data);
    let index = posts.findIndex(post => post.id == id);
    posts.splice(index, 1);

    let postsJson = JSON.stringify(posts, null, 2);

    fs.writeFile(jsonFile, postsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

const server = app.listen(3001, () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
