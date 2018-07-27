import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { etherToWei, weiToEther } from './utils';

class App extends Component {
  state = {
    manager: '',
    players: [],
    lotteryBalance: '',
    message: '',
  };

  baseState = this.state;

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, lotteryBalance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    if (weiToEther(await web3.eth.getBalance(accounts[0])) < 0.01) {
      this.setState({ message: 'Not enough ether to join' });
      return;
    }

    this.setState({ message: 'Processing transaction...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: etherToWei('0.01'),
    });

    this.setState({
      manager: await lottery.methods.manager().call(),
      players: await lottery.methods.getPlayers().call(),
      lotteryBalance: await web3.eth.getBalance(lottery.options.address),
      message: `You have been entered to the lottery! Your ID is ${this.state.players.length}.`,
    });
  };

  onClickPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    if (accounts[0] !== this.state.manager) {
      this.setState({ message: 'You are not authorized to perform this operation' });
      return;
    }

    const prizePool = this.state.lotteryBalance;

    this.setState({ message: 'Processing transaction...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({
      ...this.baseState,
      message: `Player with ID #${await lottery.methods.winnerIndex().call()} has won ${weiToEther(prizePool)} ether!`,
    });
  };

  render() {
    return (
      <div>
        <h1>Lottery Contract</h1>
        <h3>
          Download browser extension <a href="https://github.com/MetaMask/metamask-extension">MetaMask</a> to use this
          app
        </h3>
        <div>
          <p>The Rule Is Simple</p>
          <ul>
            <li>You enter the lottery round with 0.01 ether</li>
            <li>The system will randomly chooses a player to be the winner</li>
            <li>The winner wins the prize pool of that round</li>
          </ul>
        </div>
        <p>
          Compete with {this.state.players.length} people to win {weiToEther(this.state.lotteryBalance)} ether!
        </p>
        <form onSubmit={this.onSubmit}>
          <h3>Spend 0.01 ethers to enter the lottery</h3>
          <button>Enter</button>
        </form>
        <h3>Let's pick a winner!</h3>
        <button onClick={this.onClickPickWinner}>Pick a winner</button>
        <h3>{this.state.message}</h3>
        <p>Contract is managed by {this.state.manager}</p>
      </div>
    );
  }
}

export default App;
