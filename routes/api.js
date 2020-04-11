/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {
  app
    .route('/api/threads/:board')
    .post((req, res) => {
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        const timestamp = new Date().getTime();
        const myObj = {
          text: req.body.text,
          delete_password: req.body.delete_password,
          replies: [],
          reported: false,
          created_on: timestamp,
          bumped_on: timestamp,
        };
        db.collection(req.params.board).insertOne(myObj, (err, res) => {
          if (err) throw err;
        });
        db.close();
        res.redirect(`/b/${req.params.board}`);
      });
    })
    .get((req, res) => {
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        db.collection(req.params.board).find((err, result) => {
          if (err) throw err;
          result.toArray((err, threads) => {
            if (err) throw err;
            const filteredThreads = threads
              .sort((a, b) => a.bumped_on - b.bumped_on)
              .slice(0, 10)
              .map((item) => {
                return {
                  bumped_on: item.bumped_on,
                  created_on: item.created_on,
                  _id: item._id,
                  text: item.text,
                  replies: item.replies.reverse().slice(0, 3),
                };
              });
            db.close();
            res.send(filteredThreads);
          });
        });
      });
    })
    .delete((req, res) => {
      const { thread_id, delete_password } = req.body;
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        db.collection(req.params.board).deleteOne(
          { _id: new ObjectId(thread_id), delete_password },
          (err, obj) => {
            if (err || obj.result.n === 0) {
              res.send('incorrect password');
              db.close();
            }
            else {
              res.send('success');
              db.close();
            }
          }
        );
      });
    })
    .put((req, res) => {
      const { thread_id } = req.body;
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        db.collection(req.params.board).updateOne(
          { _id: new ObjectId(thread_id) },
          { $set: { reported: true } },
          (err, obj) => {
            if (err) throw err;
            res.send('success');
            db.close();
          }
        );
      });
    });

  app
    .route('/api/replies/:board')
    .post((req, res) => {
      const { text, thread_id, delete_password } = req.body;
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        const newTime = new Date().getTime();
        const myObj = {
          text,
          _id: new ObjectId(),
          created_on: newTime,
          delete_password,
          reported: false,
        };
        db.collection(req.params.board).updateOne(
          { _id: new ObjectId(thread_id) },
          { $push: { replies: myObj }, $set: { bumped_on: newTime } },
          (err, done) => {
            if (err) throw err;
            db.close();
            res.redirect(`/b/${req.params.board}/${thread_id}`);
          }
        );
      });
    })
    .get((req, res) => {
      const { thread_id } = req.query;
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        db.collection(req.params.board).findOne(
          { _id: new ObjectId(thread_id) },
          (err, done) => {
            if (err) throw err;
            const obj = {
              bumped_on: done.bumped_on,
              created_on: done.created_on,
              _id: done._id,
              text: done.text,
              replies: done.replies,
            };
            res.send(obj);
            db.close();
          }
        );
      });
    })
    .delete((req, res) => {
      const { reply_id, thread_id, delete_password } = req.body;
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        db.collection(req.params.board).updateOne(
          {
            _id: new ObjectId(thread_id),
            'replies._id': new ObjectId(reply_id),
            'replies.delete_password': delete_password,
          },
          { $set: { 'replies.$.text': '[deleted]' } },
          (err, done) => {
            if (err) return res.send('incorrect password');
            res.send('success');
            db.close();
          }
        );
      });
    })
    .put((req, res) => {
      const { thread_id, reply_id } = req.body;
      MongoClient.connect(process.env.DB, (err, db) => {
        if (err) throw err;
        db.collection(req.params.board).updateOne(
          {
            _id: new ObjectId(thread_id),
            'replies._id': new ObjectId(reply_id),
          },
          {
            $set: {'replies.$.reported': true}
          },
          (err, done) => {
            if (err) throw err;
            res.send('success');
            db.close();
          }
        )
      })
    });
};
