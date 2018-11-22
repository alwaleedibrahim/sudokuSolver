/*
	
	function names are inspired from https://www.codefellows.org/blog/sudoku-solver-from-scratch-in-javascript-tdd-style-a-tutorial/
*/

// Initializing variables 
var inputTableSize;

// Board is a 2D array
var board = [];

function saveEmptyPositions (board) {
	/*
		board: 2D array with zeros for empty squareSide
		return 2D array with row and column numbers for each empty place 
	*/
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
	/*
		board: 2D array
		row: the number of row in which value will be placed
		value: a number that will be placed in the row
		return false if there's a matching in the row, otherwise true
	*/
	for (var i = 0; i < board[row].length; i++) {
		if (board[row][i] == value) {
			return false;
		}
	}
	return true;
}

function checkColumn (board, column, value) {
	/*
		board: 2D array
		column: the number of column in which value will be placed
		value: a number that will be placed in the column
		return false if there's a matching in the column, otherwise true
	*/
	
	for (var i = 0; i < board.length; i++) {
		if (board[i][column] == value) {
			return false;
		}
	}
	return true;
}

function checkSquare (board, row, column, value) {
	/*
		board: 2D array
		row : the number of row in which value will be placed
		column: the number of column in which value will be placed
		value: a number that will be placed in the square
		return false if there's a matching in the square, otherwise true
	*/
	
	// calculate the length of square side
	var squareSide = Math.sqrt(board.length);
	// calculate the row/column in which the square starts
	// dividing row/column by square side and floor the result and multiply by square side
	var squareStartRow = ~~(row/squareSide) * squareSide;
	var squareStartColumn = ~~(column/squareSide) * squareSide;
	
	// check the value within the square
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
	/*
		board: 2D array
		row : the number of row in which value will be placed
		column: the number of column in which value will be placed
		value: a number that will be placed in the square
		return false if there's a matching in the row, column or square, otherwise true
	*/
	return checkRow (board, row, value) && checkColumn (board, column, value) && checkSquare (board, row, column, value);
}

function solvePuzzle (board, emptyPosition) {
	/*
		board: 2D array
		emptyPosition: 2D array
		return solved board
	*/
	
	// for each elment in emptyPosition
	for (var i=0; i<emptyPosition.length;) {
		
		// if there's no previous position to be changed and still no the solution, the puzzle is impossible
		try {
			var row = emptyPosition[i][0];
			var column = emptyPosition[i][1];
		}
		catch (TypeError) {
			document.write("No solution for this puzzle!");
			break;
		}
		var found = false;
		
		// for each number < board length
		for (var j = board[row][column]; j < board.length + 1; j++) {
			
			// if the value passed the check
			if (checkValue(board, row, column, j) && j>0) {
				// assign the value to the board
				board[row][column] = j;
				
				// declare that a correct value has been found
				found = true;
				
				// break from loop (move to the next empty position)
				break;
			}
		}
		
		// if the loop ended without finding a correct value
		if (!found) {
			// empty current position
			board[row][column] = 0;
			
			// step backward (change the value of previous empty position)
			// refere to try catch block above, if there's no previous empty position to be changed, the puzzle is impossible
			i --;
		}
		else {
			// else move the next empty position
			i++;
		}
	}
	return board;
}


// From StackOverFlow https://stackoverflow.com/a/15164958
function renderTable(tableData, tableName) {
	/*
		tableData: 2D array
		tableName: tableId
		render HTML table represents the solved board
	*/
	var table = document.getElementById(tableName);
	table.innerHTML = "";
	var tableBody = document.createElement('tbody');
	// itrate over table data and attach each elment to a table cell, and append cells to rows
	tableData.forEach(function(rowData) {
		var row = document.createElement('tr');

		rowData.forEach(function(cellData) {
			var cell = document.createElement('td');
			if (cellData > 0) {
				cell.appendChild(document.createTextNode(cellData));
			}
			row.appendChild(cell);
		});
	// append row to table body
	tableBody.appendChild(row);
	});
	
	// append table body to table and table to document
	table.appendChild(tableBody);
	document.body.appendChild(table);
}
// End code from StackOverFlow

function renderInputTable (tableSize, tableName) {
	/*
		tableSize: number, length of row
		tableName: table id
		render HTML table with input field in each cell
	*/
	
	// get table
	var table = document.getElementById(tableName);
	
	// empty table, in case there are data from previous attemps
	table.innerHTML = "";
	document.getElementById("solved").innerHTML = "";
	var tableBody = document.createElement("tbody");
	inputTableSize = tableSize;
	
	// render a table with input field in each cell
	for (var i=0; i< tableSize; i++) {
		var row = document.createElement("tr");
		for (var j = 0; j < tableSize; j++) {
			var cell = document.createElement("td");
			var input = document.createElement("input");
			input.size = 1;
			input.type = "number";
			// set input name to indicate cell row and column
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
	/*
		take data from input table, parse it and push it to board
	*/
	
	// clear board
	board = [];
	var form = document.forms["inputTable"];
	for (var i=0; i<inputTableSize; i++) {
		board.push([]);
		for (var j = 0; j< inputTableSize; j++) {
			// get data from form based on row and column position
			var cell = form[i + ":" + j].value;
			if (cell >= 1) {
				board[i].push(parseInt(cell));
			}
			// in case of empty input, push 0
			else {
				board[i].push(0);
			}
		}
	}
}

function solveSudoku () {
	/*
		take input puzzle, solve it and render a solved table 
	*/
	parseInput();
	solvePuzzle (board, saveEmptyPositions (board));
	renderTable(board, "solved"); 
}
