const express = require('express');
const server = express();
const postRoutes = require('./postRouter/postRouter'); //imports routes

const port = 8080;

server.use(express.json());
server.use('/api/posts', postRoutes);

server.get('/', (req, res) => {
  res.send(`<h1>Hello from server 8080</h1>`);
});

server.listen(port, () => console.log(`\n** server running on port ${port}`));
