import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={props.className} 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isWinningSquare) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        className={isWinningSquare ? 'square winning-square' : 'square'}
      />
    );
  }

  render() {
    const winScenario = this.props.winScenario;
    const boardRows = [0, 1, 2].map((rowNum) => {
      const boardRow = [0, 1, 2].map((colNum) => {
        const cellNum = 3*rowNum + colNum;
        const isWinningSquare = winScenario && winScenario.includes(cellNum);
        return this.renderSquare(cellNum, isWinningSquare);
      });

      return (
        <div key={rowNum} className="board-row">
          {boardRow}
        </div>
      );
    });

    return (
      <div>
        {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const boardHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentBoardState = boardHistory[boardHistory.length - 1];
    const squares = currentBoardState.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: boardHistory.concat({
        squares: squares,
      }),
      stepNumber: boardHistory.length,
      xIsNext: !this.state.xIsNext,
      sortAsc: false,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSort(evt) {
    this.setState({
      sortAsc: evt.target.checked,
    });
    
  }

  render() {
    const boardHistory = this.state.history;
    const currentBoardState = boardHistory[this.state.stepNumber].squares;
    const {winner, winScenario} = calculateWinner(currentBoardState);
    
    const moves = boardHistory.map((step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to game start';

      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? 'selected' : ''}
          >
            {desc} 
          </button>
        </li>
      )
    });

    if (this.state.sortAsc) {
      moves.reverse();
    }
    
    
    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (this.state.stepNumber === currentBoardState.length) {
      status = 'Draw';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    // let status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={currentBoardState}
            onClick={(i) => this.handleClick(i)}
            winScenario={winScenario}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <label>
              <input type="checkbox" onChange={(evt) => this.handleSort(evt)}/>
              Sort Ascending
            </label>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ======================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const winScenarios = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winScenarios.length; i++) {
    let [a, b, c] = winScenarios[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winScenario: winScenarios[i],
      };
    }
  };
  return {
    winner: null,
    winScenario: null,
  };
}