// Code inspired (but not copied) from: (https://www.codefellows.org/blog/sudoku-solver-from-scratch-in-javascript-tdd-style-a-tutorial/) 
var inputTableSize;
var board = [];

function saveEmptyPositions (board) {
	var emptyPosition = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (board[i][j] == 0) {
				emptyPosition.push([i,j]);
			}
		}
	}
	return emptyPosition;
}

function checkRow (board, row, value) {
	for (var i = 0; i < board[row].length; i++) {
		if (board[row][i] == value) {
			return false;
		}
	}
	return true;
}

function checkColumn (board, column, value) {
	for (var i = 0; i < board.length; i++) {
		if (board[i][column] == value) {
			return false;
		}
	}
	return true;
}

function checkSquare (board, row, column, value) {
	var squareSide = Math.sqrt(board.length);
	var squareStartRow = ~~(row/squareSide) * squareSide;
	var squareStartColumn = ~~(column/squareSide) * squareSide;
	
	for (var i = squareStartRow; i < squareStartRow+squareSide; i++) {
		for (var j = squareStartColumn; j < squareStartColumn+squareSide; j++) {
			if (board[i][j] == value) {
				return false;
			}
		}
	}
	return true;
}

function checkValue (board, row, column, value) {
	return checkRow (board, row, value) && checkColumn (board, column, value) && checkSquare (board, row, column, value);
}

function solvePuzzle (board, emptyPosition) {
	for (var i=0; i<emptyPosition.length;) {
		try {
			var row = emptyPosition[i][0];
			var column = emptyPosition[i][1];
		}
		catch (TypeError) {
			document.write("No solution for this puzzle!");
			break;
		}
		var found = false;
		for (var j = board[row][column]; j < board.length + 1; j++) {
			if (checkValue(board, row, column, j) && j>0) {
				board[row][column] = j;
				found = true;
				break;
			}
		}
		if (!found) {
			board[row][column] = 0;
			i --;
		}
		else {
			i++;
		}
	}
	return board;
}


// https://stackoverflow.com/a/15164958
function renderTable(tableData, tableName) {
  var table = document.getElementById(tableName);
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
	  if (cellData > 0) {
		cell.appendChild(document.createTextNode(cellData));
	  }
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

function renderInputTable (tableSize, tableName) {
	var table = document.getElementById(tableName);
	table.innerHTML = "";
	document.getElementById("solved").innerHTML = "";
	var tableBody = document.createElement("tbody");
	inputTableSize = tableSize;
	for (var i=0; i< tableSize; i++) {
		var row = document.createElement("tr");
		for (var j = 0; j < tableSize; j++) {
			var cell = document.createElement("td");
			var input = document.createElement("input");
			input.size = 1;
			input.type = "number";
			input.name = i + ":" + j;
			input.min = 1;
			input.max = tableSize;
			cell.appendChild(input);
			row.appendChild(cell);
		}
		tableBody.appendChild(row);
	}
	table.appendChild(tableBody);
	
}

function parseInput() {
	board = [];
	var form = document.forms["inputTable"];
	for (var i=0; i<inputTableSize; i++) {
		board.push([]);
		for (var j = 0; j< inputTableSize; j++) {
			var cell = form[i + ":" + j].value;
			if (cell >= 1) {
				board[i].push(parseInt(cell));
			}
			else {
				board[i].push(0);
			}
		}
	}
}

function solveSudoku () {
	parseInput();
	solvePuzzle (board, saveEmptyPositions (board));
	renderTable(board, "solved"); 
}
