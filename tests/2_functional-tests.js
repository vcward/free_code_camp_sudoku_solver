const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const Puzzles = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Tests for /api/solve', function() {
    test('solve a puzzle with valid puzzle string: POST req', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: Puzzles.puzzlesAndSolutions[0][0] })
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'solution', 'response contains solution property');
          assert.equal(res.body.solution, Puzzles.puzzlesAndSolutions[0][1], 'solution property should equal solution of the puzzle')
          done();
        });
    });

    test('solve a puzzle with missing puzzle string: POST req', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response contains error property');
          assert.equal(res.body.error, 'Required field missing', 'error should return error message')
          done();
        });
    });

    test('solve a puzzle with invalid characters: POST req', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37F'})
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response contains error property');
          assert.equal(res.body.error, 'Invalid characters in puzzle', 'error should return error message');
          done();
        });
    });

    test('solve a puzzle with incorrect length: POST req', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3'})
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response contains error property');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'error should return error message');
          done();
        });
    });

    test('solve a puzzle that cannot be solved: POST req', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response contains error property');
          assert.equal(res.body.error, 'Puzzle cannot be solved', 'error should return error message');
          done();
        });
    });
  });

  suite('Tests for /api/check', function() {
    test('check a puzzle placement with all fields: POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '6'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'valid', 'response object should have property valid');
          assert.isTrue(res.body.valid, 'valid value should be true');
          done();
        });
    });

    test('check a puzzle placement with a single conflict : POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '1'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'valid', 'response object should have property valid');
          assert.isNotTrue(res.body.valid, 'valid value should be false');
          assert.property(res.body, 'conflict', 'response object should have property valid');
          assert.equal(res.body.conflict.length, 1, 'conflict should be an array of length 1');
          done();
        });
    });

    test('check a puzzle placement with multiple conflicts : POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '2'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'valid', 'response object should have property valid');
          assert.isNotTrue(res.body.valid, 'valid value should be false');
          assert.property(res.body, 'conflict', 'response object should have property valid');
          assert.equal(res.body.conflict.length, 2, 'conflict should be an array of length 1');
          done();
        });
    });

    test('check a puzzle placement with all conflicts : POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '5'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'valid', 'response object should have property valid');
          assert.isNotTrue(res.body.valid, 'valid value should be false');
          assert.property(res.body, 'conflict', 'response object should have property valid');
          assert.equal(res.body.conflict.length, 3, 'conflict should be an array of length 1');
          done();
        });
    });

    test('check a puzzle placement with missing required fields : POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          coordinate: 'A2',
          value: '5'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response object should have property valid');
          assert.equal(res.body.error, 'Required field(s) missing', 'error should have error message');
          done();
        });
    });

    test('check a puzzle placement with invalid characters : POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: 'F.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '5'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response object should have property valid');
          assert.equal(res.body.error, 'Invalid characters in puzzle', 'error should have error message');
          done();
        });
    });

    test('check a puzzle placement with incorrect length : POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '5'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response object should have property valid');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'error should have error message');
          done();
        });
    });

    test('check a puzzle placement with invalid placement coordinate: POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'Z2',
          value: '5'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response object should have property valid');
          assert.equal(res.body.error, 'Invalid coordinate', 'error should have error message');
          done();
        });
    });

    test('check a puzzle placement with invalid placement value: POST req', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'Z2',
          value: 'N'
        })
        .end(function(error, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is an object');
          assert.property(res.body, 'error', 'response object should have property valid');
          assert.equal(res.body.error, 'Invalid value', 'error should have error message');
          done();
        });
    });
  });
});

