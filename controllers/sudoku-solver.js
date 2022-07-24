class SudokuSolver {

  validate(puzzleString) {
    const validated = {
      valid: true,
      error: null
    };
    if (puzzleString.length !== 81) {
      validated.valid = false;
      validated.error = 'Expected puzzle to be 81 characters long';
      return validated;
    }
    const matchInvalidCharacters = puzzleString.match(/[^\d|\.]/gi);
    if (matchInvalidCharacters !== null) {
      validated.valid = false;
      validated.error = 'Invalid characters in puzzle';
      return validated;
    }
    return validated;
  }

  validateCoordinate(coord) {
    if (coord.length !== 2 || coord.includes('0')) {
      return false;
    }
    if (coord.search(/[j-z]/gi) > -1) {
      return false;
    }
    if (coord.search(/[a-z]{2,}|\d{2,}/gi) > -1) {
      return false;
    }
    if (coord.search(/\W/gi) > -1) {
      return false;
    }
    return true;
  }

  getBoardAsArray(puzzleString) {
    const board = [];
    const splitString = puzzleString.split('');
    while (splitString.length) {
      board.push(splitString.splice(0, 9));
    }
    return board;
  }

  parseCoordinate(coord) {
    const rows = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9
    };
    const rowNum = rows[coord.slice(0, 1).toUpperCase()];
    return { row: rowNum, col: +coord.slice(1) };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.getBoardAsArray(puzzleString);
    const cell = board[row][column];
    if (cell === value || !board[row].includes(value)) {
      return true;
    }
    return false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.getBoardAsArray(puzzleString);
    const cell = board[row][column];
    const columnValues = board.map(row => row[column]);
    if (cell === value || !columnValues.includes(value)) {
      return true;
    }
    return false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.getBoardAsArray(puzzleString);
    const cell = board[row][column];
    const grid = [];
    // get values of the 3x3 grid/region that the coordinate belongs to
    const gridRowStart = Math.floor(row / 3) * 3;
    const gridColStart = Math.floor(column / 3) * 3;
    for (let i = gridRowStart; i < gridRowStart + 3; i++) {
      for (let j = gridColStart; j < gridColStart + 3; j++) {
        grid.push(board[i][j]);
      }
    }
    if (cell === value || !grid.includes(value)) {
      return true;
    }
    return false;
  }

  getEmptyCells(board) {
   return board.reduce((empties, row, rowIndex) => {
     for (let i = 0; i < row.length; i++) {
       if (row[i] === '.') {
         empties.push([rowIndex, i])
       }
     }
     return empties;
   }, []);
  }

  unsolvablePuzzle(board) {
    let currentRowNumbers = [];
    let currentColNumbers = [];
    let currentGridNumbers = [];
    board.forEach((row) => {
      const filteredRow = row.filter(c => c !== '.')
      currentRowNumbers.push(filteredRow);
    });
    for (let i = 0; i < 9; i++) {
      currentColNumbers.push(board.map(row => row[i]).filter(cell => cell !== '.'));
    }
    for (let boardRow = 0; boardRow < 9; boardRow +=3) {
      for (let boardCol = 0; boardCol < 9; boardCol += 3) {
        let grid = [];
        for (let gridRow = 0; gridRow < 3; gridRow++) {
          for (let gridCol = 0; gridCol < 3; gridCol++) {
            if (board[boardRow + gridRow][boardCol + gridCol] !== '.') {
              grid.push(board[boardRow + gridRow][boardCol + gridCol]);
            }
          }
        }
        currentGridNumbers.push(grid)
      }
    }
    const duplicateRowNums = this.checkForDuplicates(currentRowNumbers);
    const duplicateColNums = this.checkForDuplicates(currentColNumbers);
    const duplicateGridNums = this.checkForDuplicates(currentGridNumbers);
    if (duplicateRowNums || duplicateColNums || duplicateGridNums) {
      return true;
    }
    return false;
  }

  checkForDuplicates(arr) {
    let duplicates = false;
    let counter = 0;
    while(counter < arr.length) {
      if (new Set(arr[counter]).size !== arr[counter].length) {
        duplicates = true;
        break;
      }
      counter++;
    }
    return duplicates;
  }

  solve(puzzleString) {
    let currentBoard = this.getBoardAsArray(puzzleString);
    const puzzleIsUnsolvable = this.unsolvablePuzzle(currentBoard);
    if (puzzleIsUnsolvable) {
      return '';
    }
    const emptyCellReferences = this.getEmptyCells(currentBoard);
    for (let i = 0; i < emptyCellReferences.length;) {
      const row = emptyCellReferences[i][0];
      const column = emptyCellReferences[i][1];
      let value = currentBoard[row][column] === '.' ? '1' : (+currentBoard[row][column] + 1).toString();
      let numberIsValid = false;
      while(!numberIsValid && +value <= 9) {
        let newPuzzleString = '';
        currentBoard.forEach(function(row) {
          newPuzzleString += row.join('');
        });
        const checkRow = this.checkRowPlacement(newPuzzleString, row, column, value);
        const checkCol = this.checkColPlacement(newPuzzleString, row, column, value);
        const checkRegion = this.checkRegionPlacement(newPuzzleString, row, column, value);
        if (checkRow && checkCol && checkRegion) {
          numberIsValid = true;
          currentBoard[row][column] = value;
          i++;
        } else {
          value = (+value + 1).toString();
        }
      }
      if (!numberIsValid) {
        currentBoard[row][column] = '.';
        i--;
      }
    }
    let boardSolution = '';
    currentBoard.forEach((row) => {
      boardSolution += row.join('');
    });
    return boardSolution
  }
}

module.exports = SudokuSolver;