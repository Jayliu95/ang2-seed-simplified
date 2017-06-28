var _ = require('lodash');
import * as Q from "q";
import * as mongo from "mongojs";
import {mongoSecret} from "../config";
let db = mongo(mongoSecret.mlabKey, [mongoSecret.collection]);

var service: any = {};

service.getAll = getAll;
service.getById = getById;
service.addPost = addPost;
service.editPost = editPost;
service.deletePost = deletePost;

module.exports = service;

function getAll() {
  var deferred = Q.defer();

  db.posts.find().toArray(function (err, posts) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    // return all posts
    deferred.resolve(posts);
  });

  return deferred.promise;
}

function getById(userId, stockId){
  var deferred = Q.defer();
  db.users.findOne({
    _id: mongo.ObjectId(userId)
  }, function (err, user) {
    if (err) {
      deferred.reject(err.name + ': ' + err.message);
    }

    if (user) {
      if(user['stockPortfolio'] == null){
        deferred.reject("Error: No stock Portfolio");
      }
      var stockObj: any = {};
      for(var index = 0; index < user['stockPortfolio'].length; index++) {
        if (user['stockPortfolio'][index]['stockSymbol'] === stockId) {
          stockObj.push(user['stockPortfolio'][index]);
        }
      }
      console.log(stockObj);
      deferred.resolve(stockObj);
    }
  });
  return deferred.promise;
}

function addPost(req){
  var deferred = Q.defer();
  console.log("adding post");
  console.log(req);
  db.posts.save(req, function(err, result){
    if(err){
      deferred.reject(err.name + ': ' + err.message);
    } else {
      deferred.resolve(result);
    }
  });
  return deferred.promise;
}

function editPost(req){
  var deferred = Q.defer();
  var isUpdated = false;
  db.users.findOne({
    _id: mongo.ObjectId(req._id)
  }, function (err, user) {
    if (err) {
      deferred.reject(err.name + ': ' + err.message);
    }

    if (user) {
      var set:any = {};
      set.stockPortfolio = [];
      if(user['stockPortfolio'] == null){
        deferred.reject("Error: User does not own any stocks!");
      } else {
        set.stockPortfolio = user['stockPortfolio'];
        for(var index = 0; index < user['stockPortfolio'].length; index++) {
          if(user['stockPortfolio'][index]['stockSymbol'] === req.oldStock.stockSymbol) {
            set.stockPortfolio[index] = req.newStock;
            isUpdated = true;
            break;
          }
          if(!isUpdated){
            deferred.reject("Error: stock was not found - update failed!");
          }
        }
      }
      db.users.update(
        {_id: mongo.ObjectId(req._id)},
        {$set: set},
        function(err, doc){
          if(err) deferred.reject(err.name + ": " + err.message);
          console.log(doc);
          deferred.resolve(doc);
        }
      )
    }
  });
  return deferred.promise;

}

function deletePost(userId, stockId) {
  //TODO : current stockId is actually the stock symbol, need to update to actual ID - or create seperate function to do so
  var deferred = Q.defer();
  db.users.findOne({
    _id: mongo.ObjectId(userId)
  }, function (err, user) {
    if (err) {
      deferred.reject(err.name + ': ' + err.message);
    }

    if (user) {
      var set:any = {};
      var isDeleted = false;
      set.stockPortfolio = [];
      if(user['stockPortfolio'] == null){
        deferred.reject("Error: User does not own any stocks!");
      } else {
        set.stockPortfolio = user['stockPortfolio'];
        for(var index = 0; index < user['stockPortfolio'].length; index++) {
          if(user['stockPortfolio'][index]['stockSymbol'] === stockId) {
            set.stockPortfolio.pop(index);
            isDeleted = true;
            break;
          }
        }
        if(!isDeleted){
          deferred.reject("Error: stock was not found - delete failed!");
        }
      }
      db.users.update(
        {_id: mongo.ObjectId(userId)},
        {$set: set},
        function(err, doc){
          if(err) deferred.reject(err.name + ": " + err.message);
          deferred.resolve(doc);
        }
      )
    }
  });
  return deferred.promise;
}

