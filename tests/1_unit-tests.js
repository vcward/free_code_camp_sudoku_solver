const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const Puzzles = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {
  suite('Check validity of puzzle', function() {
    test('Logic handles a valid puzzle string of 81 characters', function() {
      const validated = solver.validate(Puzzles.puzzlesAndSolutions[0][0]);
      assert.isObject(validated, 'validate should return an object');
      assert.property(validated, 'valid', 'validate object should contain property valid');
      assert.property(validated, 'error', 'validate object should contain property error');
      assert.isTrue(validated.valid, 'valid property should return true for a valid puzzle');
    });

    test('Logic handles a puzzle string with invalid characters', function() {
      const validated = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37F');
      assert.isObject(validated, 'validate should return an object');
      assert.property(validated, 'valid', 'validate object should contain property valid');
      assert.property(validated, 'error', 'validate object should contain property error');
      assert.isNotTrue(validated.valid, 'valid property should return false for a valid puzzle');
      assert.equal(validated.error, 'Invalid characters in puzzle', 'error property should return the error message');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function() {
      const validated = solver.validate('1.5..2.84..63.12.7.2..5.....9..1.');
      assert.isObject(validated, 'validate should return an object');
      assert.property(validated, 'valid', 'validate object should contain property valid');
      assert.property(validated, 'error', 'validate object should contain property error');
      assert.isNotTrue(validated.valid, 'valid property should return false for a valid puzzle');
      assert.equal(validated.error, 'Expected puzzle to be 81 characters long', 'error property should return the error message');
    });
  });

  suite('Check coordinate/value placement', function() {
    test('Logic handles a valid row placement', function() {
      const checkRow = solver.checkRowPlacement(Puzzles.puzzlesAndSolutions[0][0], 0, 0, '1');
      assert.isTrue(checkRow, 'valid row placement should return true');
    });

    test('Logic handles an invalid row placement', function() {
      const checkRow = solver.checkRowPlacement(Puzzles.puzzlesAndSolutions[0][0], 0, 0, '5');
      assert.isNotTrue(checkRow, 'invalid row placement should return false');
    });

    test('Logic handles a vaild column placement', function() {
      const checkCol = solver.checkColPlacement(Puzzles.puzzlesAndSolutions[0][0], 1, 0, '5');
      assert.isTrue(checkCol, 'valid column placement should return true');
    });

    test('Logic handles an invalid column placement', function() {
      const checkCol = solver.checkColPlacement(Puzzles.puzzlesAndSolutions[0][0], 1, 0, '1');
      assert.isNotTrue(checkCol, 'invalid column placement should return false');
    });

    test('Logic handles a vaild region placement', function() {
      const checkRegion = solver.checkRegionPlacement(Puzzles.puzzlesAndSolutions[0][0], 1, 0, '4');
      assert.isTrue(checkRegion, 'valid region placement should return true');
    });

    test('Logic handles an invaild region placement', function() {
      const checkRegion = solver.checkRegionPlacement(Puzzles.puzzlesAndSolutions[0][0], 1, 0, '5');
      assert.isNotTrue(checkRegion, 'invalid region placement should return false');
    });
  });

  suite('Test puzzle solver', function() {
    test('Valid puzzle strings pass the solver', function() {
      const solvePuzzle = solver.solve(Puzzles.puzzlesAndSolutions[0][0]);
      assert.isString(solvePuzzle, 'result should be a string');
    });

    test('Invalid puzzle strings fail the solver', function() {
      const solvePuzzle = solver.solve('115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
      assert.isString(solvePuzzle, 'result should be a string');
      assert.equal(solvePuzzle, '', 'result should be an empty string');
    });

    test('Sovler return the expected solution', function() {
      const solvePuzzle = solver.solve(Puzzles.puzzlesAndSolutions[0][0]);
      assert.isString(solvePuzzle, 'result should be a string');
      assert.equal(solvePuzzle, Puzzles.puzzlesAndSolutions[0][1], 'result should equal the solution');
    });
  });
});
