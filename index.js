const express = require('express');
const server = express();
const postRoutes = require('./postRouter/postRouter'); //imports routes

const port = process.env.PORT || 8080;

server.use(express.json());
server.use('/api/posts', postRoutes);

server.get('/', (req, res) => {
  res.send(
    `<h3>https://webapi2postgres.herokuapp.com</h3>, <h3>https://webapi2postgres.herokuapp.com/api/posts</h3> : gives you all posts</h3>`
  );
});

server.listen(port, () => console.log(`\n** server running on port ${port}`));
