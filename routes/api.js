'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        res.json({
          error: 'Required field(s) missing'
        });
        return;
      }
      const isValidPuzzle = solver.validate(puzzle);
      if (!isValidPuzzle.valid) {
        res.json({
          error: isValidPuzzle.error
        });
        return;
      }
      if (isNaN(+value) || value < 1 || value > 9) {
        res.json({
          error: 'Invalid value'
        });
        return;
      }
      if (!solver.validateCoordinate(coordinate)) {
        res.json({
          error: 'Invalid coordinate'
        });
        return;
      }
      const coord = solver.parseCoordinate(coordinate);
      const checkResponse = { valid: true }
      if (!solver.checkRowPlacement(puzzle, coord.row - 1, coord.col - 1, value)) {
        checkResponse.valid = false;
        (checkResponse.conflict ??= []).push('row');
      }
      if (!solver.checkColPlacement(puzzle, coord.row - 1, coord.col - 1, value)) {
        checkResponse.valid = false;
        (checkResponse.conflict ??= []).push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, coord.row - 1, coord.col - 1, value)) {
        checkResponse.valid = false;
        (checkResponse.conflict ??= []).push('region');
      }
      res.json(checkResponse);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        res.json({
          error: 'Required field missing'
        });
        return;
      }
      const isValidPuzzle = solver.validate(puzzle);
      if (!isValidPuzzle.valid) {
        res.json({
          error: isValidPuzzle.error
        });
        return;
      }
      const solution = solver.solve(puzzle);
      if (!solution) {
        res.json({
          error: 'Puzzle cannot be solved'
        });
        return;
      }
      res.json({
        solution: solver.solve(puzzle)
      });
    });
};
