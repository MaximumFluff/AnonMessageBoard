/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

// TODO: implement function to retrieves ID's for delete tests

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('POST /api/threads/:board', function(done) {
        chai.request(server)
          .post('/api/threads/messageBoardTest')
          .send({delete_password: "test", text: "test message"})
          .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('GET /api/threads/:board', function(done) {
        chai.request(server)
          .get('/api/threads/messageBoardTest')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'replies')
            done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('DELETE /api/threads/board', function(done) {
        chai.request(server)
          .delete('/api/threads/messageBoardTest')
          .send({thread_id: '5e91fb9238232369f240cf58', delete_password: 'test'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'success');
            done();
          })
      })

      test('DELETE /api/threads/board IF FAIL', function(done) {
        chai.request(server)
          .delete('/api/threads/messageBoardTest')
          .send({ thread_id: '5e91abf23fc8700f974e9123', delete_password: 'something'})
          .end(function(err, res) {
            assert.equal(res.text, 'incorrect password');
            done();
          })
      })
    });
    
    suite('PUT', function() {
      // TODO: add test for fail condition
      test('PUT /api/threads/board', function(done) {
        chai.request(server)
          .put('/api/threads/messageBoardTest')
          .send({thread_id: '5e91abf23fc8700f974e7773'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'success')
            done();
          })
      })

      test('PUT /api/threads/board IF FAIL', function(done) {
        chai.request(server)
          .put('/api/threads/messageBoardTest')
          .send({thread_id: '9e99abf23fc8700f974e7773'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.notEqual(res.text, 'success')
            done();
          })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('POST /api/replies/board', function(done) {
        chai.request(server)
          .post('/api/replies/messageBoardTest')
          .send({text: 'test reply', delete_password: 'test', thread_id: '5e91abefa883230f5019aefc'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          })
      })
    });
    
    suite('GET', function() {
      test('GET /api/replies/board', function(done) {
        chai.request(server)
          .get('/api/replies/messageBoardTest?thread_id=5e91abefa883230f5019aefc')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'bumped_on');
            assert.property(res.body, 'created_on');
            assert.property(res.body, '_id');
            assert.property(res.body, 'text');
            assert.property(res.body, 'replies');
            done();
          })
      })
    });
    
    suite('PUT', function() {
      test('POST /api/replies/board', function(done) {
        chai.request(server)
          .put('/api/replies/messageBoardTest')
          .send({ thread_id: '5e91abefa883230f5019aefc'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          })
      })
    });
    
    suite('DELETE', function() {
      test('DELETE /api/replies/board', function(done) {
        chai.request(server)
          .delete('/api/replies/messageBoardTest')
          .send({ thread_id: '5e91abefa883230f5019aefc', delete_password: 'test'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
      })
    });
    
  });

});
