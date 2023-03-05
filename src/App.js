import React from "react";
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause ,faSync, faMinus,faPlus} from '@fortawesome/free-solid-svg-icons';



class App extends React.Component {
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false
  }
  
  constructor(props) {
    super(props);
    this.loop = undefined;
    this.audio = new Audio('https://www.myinstants.com/media/sounds/anime-wow.mp3');
  }
  
  componentWillUnmount() {
    clearInterval(this.loop);
  }
  
  handlePlayPause = () => {
    const { isPlaying } = this.state;
    
    if(isPlaying) {
      clearInterval(this.loop);
      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      });
      
      this.loop = setInterval(() => {
        const { 
          clockCount, 
          currentTimer, 
          breakCount, 
          sessionCount
        } = this.state;
        
        if(clockCount === 0) {
          this.setState({
            currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',
            clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
          });
          
          this.audio.play();
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
      }, 1000);
    }
 }
  
  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying: false
  });
  
  clearInterval(this.loop);
    
  this.audio.pause();
  this.audio.currentTime = 0;
}
  
  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    
    minutes = minutes < 10 ? ('0'+minutes) : minutes;
    seconds = seconds < 10 ? ('0'+seconds) : seconds;
    
    return `${minutes}:${seconds}`;
  }
  
  handleLengthChange = (count, timerType) => {
    const { 
      sessionCount, 
      breakCount, 
      isPlaying, 
      currentTimer
    } = this.state;
    
    let newCount;
    
    if(timerType === 'session') {
      newCount = sessionCount + count;
    } else {
      newCount = breakCount + count;
    }
    
    
    if(newCount > 0 && newCount < 61 && !isPlaying)  {
      this.setState({
        [`${timerType}Count`]: newCount
      });
          
      if(currentTimer.toLowerCase() === timerType) {
        this.setState({
          clockCount: newCount * 60
        })
      }
    }
  }
 

  
  render () {
    const { 
      breakCount,
      sessionCount,
      clockCount,
      currentTimer,
      isPlaying
    } = this.state;
    
    const breakProps = {
      title: 'Break',
      count: breakCount,
      handleDecrease: () => this.handleLengthChange(-1, 'break'),
      handleIncrease: () => this.handleLengthChange(1, 'break')
    }
    const sessionProps = {
      title: 'Session',
      count: sessionCount,
      handleDecrease: () => this.handleLengthChange(-1, 'session'),
      handleIncrease: () => this.handleLengthChange(1, 'session')
    }
    
    return (
      <div>
      <div className="flex">
        <SetTimer {...breakProps} />
        <SetTimer {...sessionProps} />
      </div>
        
       <p id="topic-int">25+5 clock</p>
      <div className="clock-container">
        <h1 id="timer-label">{currentTimer}</h1>
        <span id="time-left">{this.convertToTime(clockCount)}</span>
        
        <div className="flex">
          <button id="start_stop" onClick={this.handlePlayPause}>
            <i className={`fas fa-${isPlaying ? 'pause': 'play'}`} />
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
        <button id="reset" onClick={this.handleReset}>
          <i className="fas fa-sync" />
          <FontAwesomeIcon icon={faSync} />
        </button>
       </div>
      </div>
      <p>Designed and coded by :<br/>Mahesh</p>
    </div>
    );
  } 
}

const SetTimer = (props) => {
  const id = props.title.toLowerCase();
  
  return (
  <div className="timer-container">
    <h2 id={`${id}-label`}>
      {props.title} Length
    </h2>
    <div className="flex actions-wrapper">
      <button id={`${id}-decrement`} onClick={props.handleDecrease}>
        <i className="fas fa-minus" />
       <FontAwesomeIcon icon={faMinus} />
      </button>
      
      <span id={`${id}-length`}>{props.count}</span>
      
      <button id={`${id}-increment`} onClick={props.handleIncrease}>
       <i className="fas fa-plus" />
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  </div>
  );
}

export default App;


