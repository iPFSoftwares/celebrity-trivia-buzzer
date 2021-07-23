import React, { Component } from 'react';
import Picker from "./picker";
import ScanQr from "./scanqr";

import './setup.css';

class Setup extends Component {
    state = {
        joinGame: false,
        ip: "192.168.1.179:5000"
    }

    componentWillMount(){
        this.start();
    }

    async start(){
        // const ip = await this.findIP();
        const ip = "192.168.1.179";
        console.log("ip", ip);
        this.setState({ip: ip + ":5000"});
    }

    findIP(){
        return new Promise(r => {var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}});
    }

    toggleJoin = () => {
        // const joinGame = this.state.joinGame;
        // this.setState({joinGame: !joinGame})
        this.props.onSetUri();
    }

    render() {
        return (
            <div id="setupScreen">
                { !this.state.joinGame && 
                    <div>
                        <label>Enter Game Link:</label>
                        <input value={this.state.ip} onChange={(e) => this.setState({ip: e.target.value})} />
                        <button id="joinerBtn" onClick={() => this.props.onStartClicked(this.state.ip) } className="round-btn">
                            JOIN GAME
                        </button>
                    </div>
                }

                { this.state.joinGame &&
                    <React.Fragment>
                        <ScanQr onSetUri={ (uri) => this.props.onSetUri(uri) } />
                
                        <div className="tabs">
                            <button className="active" onClick={this.toggleJoin}>
                                CANCEL
                            </button>
                        </div>
                    </React.Fragment>
                }

                {/* <div className="actions">
                    {
                        this.state.tab === 0 &&
                        (
                            <Picker/>
                        )
                    }
                    {
                        this.state.tab === 1 &&
                        (
                            <ScanQr onSetUri={ (uri) => this.props.onSetUri(uri) } />
                        )
                    }
                </div>  */}
                {/* <div className="tabs">
                    <button className={this.state.tab === 0 ? 'active' : ''} onClick={ () => this.setState({tab: 0})}>
                        DURATION
                    </button>
                    <span></span>
                    <button className={this.state.tab === 1 ? 'active' : ''} onClick={ () => this.setState({tab: 1})}>
                        CONNECT
                    </button>
                </div> */}
            </div>
        );
    }
}

export default Setup;
