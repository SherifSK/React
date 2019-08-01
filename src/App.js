import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';

class App extends Component {

  componentWillMount(){
    this.loadBlockchainData();
  }

  
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const network = await web3.eth.net.getNetworkType();
    console.log("network:", network);
    const accounts = await web3.eth.getAccounts()
    console.log("account:", accounts[0])
    this.setState({ account: web3.eth.accounts[0]})
  }

  constructor(props) {
    super(props)
    this.state = { account: '' }
  }


  render() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
        <p>Your account: {this.state.account}</p>
      </div>
    );
  }
}

export default App;
