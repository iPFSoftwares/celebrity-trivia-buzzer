import React from 'react';
import { Socket } from 'react-socket-io';
import Setup from './Setup';
import App from './App';

// const uri = 'http://192.168.8.100:5000';
const options = { transports: ['websocket'] };

class AppContainer extends React.Component {
  state = {
    uri: null,
    started: false
  };

  findIP(){
    return new Promise(r => {var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}});
  }

  getStarted = async (uri) => {
    this.openFullscreen(document.getElementById("root"))
    // window.screen.orientation.lock("portrait-primary");
    
    try {
      // const ip = await this.findIP();
      // const uri = 'http://' + ip + ':5000';
      this.setState({uri});
      console.log("URI set: ", uri);
    } catch (error) {
      console.error("Error setting up: ", error);
      alert("Error setting up: " + error.message);
    }
  }

  openFullscreen = (elem) => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    else{
      console.log("Not elligible for full screen");
    }
  }
  
  render() {
    return (
      <React.Fragment>
        {
          this.state.uri !== null &&
            <Socket uri={this.state.uri} options={options}> 
              <App />
            </Socket>
        }

        {
          this.state.uri === null &&
            <Setup onStartClicked={ this.getStarted} />
        }
      </React.Fragment>
    );
  }
}

export default AppContainer;
