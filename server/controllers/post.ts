var express = require('express');
var router = express.Router();
var postService = require('../services/post.service');

//routes
router.get('/', getAllPosts);
router.get('/:_id', getPostById);
router.post('/', addPost);
router.put('/:id', editPost);
router.delete('/:_id', deletePost);

module.exports = router;

function getAllPosts(req, res){
  var url = req['baseUrl'].split('/');
  postService.getAll(url[3])
    .then(function (users) {
      res.send(users);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function getPostById(req, res){
  console.log("getting by id");
  console.log(req.params.id);
  postService.getBySymbol(req.params.id)
    .then(function (user) {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function addPost(req, res){
  console.log(req.body);
  postService.addPost(req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function editPost(req, res){
  console.log(req.body);
  postService.editPost(req.body)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function deletePost(req, res){
  var url = req['baseUrl'].split('/');
  postService.deletePost(url[3], req.params._id)
    .then(function (user) {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}
