const express = require('express');

const router = express.Router();

const db = require('../data/db');

//Returns an array of all the post objects contained in the database.
//any url that begins  with /api/posts
router.get('/', (req, res) => {
  db.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' });
    });
});

//any url that begins with /api/posts/:id
//Returns the post object with the specified id.
router.get('/:id', (req, res) => {
  const postID = req.params.id;
  db.findById(postID)
    .then(post => {
      console.log(post);
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(400)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved.' });
    });
});

//Returns an array of all the comment objects associated with the post with the specified id.
//any url that begins with /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  const commentID = req.params.id;
  console.log(`from inside of the get request `);
  db.findPostComments(commentID)
    .then(comment => {
      if (comment.length > 0) {
        res.status(200).json(comment);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

//Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
  const postBody = req.body;
  if (!postBody.title || !postBody.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
    db.insert(postBody)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        });
      });
  }
});

//Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
  const postId = req.params.id;
  const postBody = req.body;
  if (!postBody.text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  }
  db.findCommentById(postId).then(id => {
    // console.log('FROM THE .then', id);

    if (id.length === 0) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    } else {
      db.insertComment(postBody).then(id => {
        db.findCommentById(id.id)
          .then(newComment => {
            res.status(201).json(newComment);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: 'The posts information could not be retrieved.' });
          });
      });
    }
  });
});

// Updates the post with the specified id using data from the request body.
router.put('/:id', (req, res) => {
  const postId = req.params.id;
  const changes = req.body;
  console.log(postId);
  if (!changes.title || !changes.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
    db.update(postId, changes)
      .then(() => {
        db.findById(postId).then(post => {
          // console.log(post);
          if (post) {
            res.status(200).json(post);
            console.log(post);
          } else {
            res.status(404).json({
              message: 'The post with the specified ID does not exist.'
            });
          }
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: 'The post information could not be modified.' });
      });
  }
});

// router.put('/:id', (req, res) => {
//   const id = req.params.id;
//   const body = req.body;
//   db.update(id, body)
//     .then(update => {
//       res.status(200).json(update);
//     })
//     .catch();
// });
//Removes the post with the specified id and returns the deleted post object.
router.delete('/:id', (req, res) => {
  const deleteId = req.params.id;
  console.log(deleteId);
  db.findById(deleteId).then(post => {
    if (post.length > 0) {
      res.status(200).json(post);

      db.remove(deleteId).catch(err => {
        res.status(500).json({ error: 'The post could not be removed' });
      });
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  });
});

module.exports = router;
