import express from 'express';
import { posts } from '../data/posts.mjs';
import error from '../utilities/error.mjs';
let router = express.Router();

// @route:  GET api/posts
// @desc    Gets all posts
// @access: Public
router.get('/', (req, res) => {
  const links = [
    {
      href: 'posts/:id',
      rel: ':id',
      type: 'GET',
    },
  ];

  res.json({ posts, links });
});

// @route:  POST api/posts
// @desc    Creates one post
// @access: Public
router.post('/', (req, res, next) => {
  //If has all needed data, create new post
  if (req.body.userId && req.body.title && req.body.content) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
    };

    posts.push(post);
    res.json(posts[posts.length - 1]);
  } else next(error(400, 'Insufficient Data')); // Else send error
});

// @route:  GET api/posts/:id
// @desc    Gets one post
// @access: Public
router.get('/:id', (req, res, next) => {
  const links = [
    {
      href: `/${req.params.id}`,
      rel: '',
      type: 'PATCH',
    },
    {
      href: `/${req.params.id}`,
      rel: '',
      type: 'DELETE',
    },
  ];

  let post = posts.find((p) => p.id == req.params.id);

  if (post) res.json({ post, links });
  else next();
});

// @route:  PATCH api/posts/:id
// @desc    Updates one post
// @access: Public
router.patch('/:id', (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      for (const key in req.body) {
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

// @route:  DELETE api/posts/:id
// @desc    Delete one post
// @access: Public
router.delete('/:id', (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1);
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

// @route:  GET api/posts/user/:userid
// @desc    Get all user posts
// @access: Public
router.get('/user/:userId', (req, res, next) => {
  let all = [];

  posts.forEach((p) => {
    if (p.userId == req.params.userId) {
      let copy = p;

      all.push(copy);
    }
  });

  if (all.length > 0) res.json({ all });
  else next(error(400, 'User Doesnt exist or no Posts by user'));
});

export default router;
