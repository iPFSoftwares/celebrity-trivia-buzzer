import React, { Component } from "react";
import QrReader from "react-qr-reader";
 
class ScanQr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 300,
      result: "No result"
    };
    this.handleScan = this.handleScan.bind(this);
  }
  handleScan(data) {
    if (data) {
      this.setState({
        result: data
      });

      this.props.onSetUri(data);
    }
  }
  handleError(err) {
    console.error(err);
  }
  render() {
    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "100vw" }}
        />

        <p style={{ marginTop: '40px', fontSize: '22px', textAlign: 'center', color: '#fff' }}>
          Scan provided qr to join game
        </p>
      </div>
    );
  }
}

export default ScanQr;
