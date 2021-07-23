import React from 'react';
import PropTypes from 'prop-types';
import { Event } from 'react-socket-io';

class App extends React.Component {
  static contextTypes = {
    socket: PropTypes.object.isRequired
  }

  state = {
    game: {},
    name: '',
    points: 0,
    words: [],
    timeLeft: 0
  }

  componentDidMount(){
    console.log("Context: ", this.context);
  }
  
  onWords = (question) => {
    console.log("New question: ", question);

    if(!question){
      alert("There are no new new words");
    }
    else{
      const hint = question['hint'];
      this.setState({showHint: false, hint, question: question['word'].toUpperCase()});
    }
  }
  
  onTime = (timeLeft) => {
    console.log("Time in: ", timeLeft);
    this.setState({timeLeft});
  }
  
  onGameChanged = (game) => {
    console.log("Game changed", game);
    this.setState({game, canHint: false});
  }

  onRequestHint = (game) => {
    this.context.socket.emit('hint', this.state.team);
    this.setState({showHint: true});
  }

  onBuzz = () => {
    this.setState({canHint: true});
    this.context.socket.emit('buzz', this.state.team);
  }

  render() {
    const { currentWords, timeLeft, team, question } = this.state;
    return (
      <div id="mainApp" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Event event='game-changed' handler={this.onGameChanged} />
        <Event event='new-question' handler={this.onWords} />
        <Event event='time' handler={this.onTime} />

        {/* <div id="timeLeft">
          { timeLeft }
        </div> */}

        {/* <div id="wordsList">
          { timeLeft > 0 && 
            currentWords.map(w => <h1 className={w.played ? 'played' : ''}>{w.word}</h1>)
          }
          
          { timeLeft < 1 && 
            <div id="timeUp">
              <h1>Time's Up</h1>
              <p>Waiting for next Turn</p>
            </div>
          }
        </div> */}
        
        { !team && (
          <div id="wordsList">
            <p>Select your team</p>
            <h1 onClick={() => this.setState({team: 'A'})}>Team A</h1>
            <h1 onClick={() => this.setState({team: 'B'})}>Team B</h1>
          </div>
        ) }

        { team && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: 'center', textAlign: "center"}}>
            <span style={{fontSize: "2rem", wordSpacing: "2rem", color: "white", textTransform: "uppercase"}}>
              { question && question.length && question.replace(/[aeiou]/gi, '_') }
            </span>

            <div style={{marginTop: "2rem", fontSize: "1rem", color: "white"}}>
              { question && question.length && 
                <div>
                  Hint: { this.state.showHint ? this.state.hint : '' }
                </div>
              }
            </div>
            

            <button id="joinerBtn" className="round-btn"
              onClick={this.onBuzz}
            >
              BUZZ
            </button>

            { question && question.length && this.state.canHint &&
              <button style={{marginTop: "2rem"}} onClick={this.onRequestHint}>
                Show Hint
              </button>
            }
          </div>
        ) }
      </div>
    );
  }
}

export default App;
