import React, { Component } from 'react';
import { Container, Button, Divider } from 'semantic-ui-react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { etherToWei, weiToEther, formatAddress } from './utils';
import Header from './Header';
import { MessageProcessing, MessageStatusWrapper } from './Message';

const AMOUNT_TO_ENTER = 0.01; // Should have retrieve this value from the lottery

class App extends Component {
  state = {
    manager: '',
    players: [],
    lotteryBalance: '',
    message: {},
  };

  baseState = this.state;

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, lotteryBalance });
  }

  onEnterContract = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    if (weiToEther(await web3.eth.getBalance(accounts[0])) < AMOUNT_TO_ENTER) {
      this.setState({
        message: {
          status: 'negative',
          header: 'Transaction rejected',
          content: 'You do not have enough ether to join. Please buy some ether to use this app.',
        },
      });
      return;
    }

    this.setState({
      message: {
        header: 'Just a few seconds',
        content: 'We are processing your transaction...',
      },
    });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: etherToWei(AMOUNT_TO_ENTER.toString()),
    });

    this.setState({
      manager: await lottery.methods.manager().call(),
      players: await lottery.methods.getPlayers().call(),
      lotteryBalance: await web3.eth.getBalance(lottery.options.address),
      message: {
        status: 'positive',
        header: 'You have been entered to the lottery!',
        content: `Your ID is ${this.state.players.length}.`,
      },
    });
  };

  onClickPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    if (accounts[0] !== this.state.manager) {
      this.setState({
        message: {
          status: 'warning',
          header: 'Transaction rejected',
          content: 'You are not authorized to perfom this transaction.',
        },
      });
      return;
    }

    const prizePool = this.state.lotteryBalance;

    this.setState({
      message: {
        header: 'Just a few seconds',
        content: 'We are processing your transaction...',
      },
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({
      ...this.baseState,
      message: {
        status: 'positive',
        header: 'We have found a winner!',
        content: `Player with ID #${await lottery.methods.winnerIndex().call()} has won ${weiToEther(
          prizePool,
        )} ether.`,
      },
    });
  };

  isEmpty = obj => Object.keys(obj).length === 0;

  renderMessage = message => {
    if (!this.isEmpty(message)) {
      return message.status ? <MessageStatusWrapper {...message} /> : <MessageProcessing {...message} />;
    }
    return null;
  };

  render() {
    return (
      <Container>
        <Header />
        <div>
          <p>The Rule Is Simple</p>
          <ul>
            <li>You enter the lottery round with {AMOUNT_TO_ENTER} ether</li>
            <li>The system will randomly chooses a player to be the winner</li>
            <li>The winner wins the prize pool of that round</li>
          </ul>
        </div>
        <p>
          Compete with {this.state.players.length} people to win {weiToEther(this.state.lotteryBalance)} ether!
        </p>
        <h3>Spend {AMOUNT_TO_ENTER} ether to enter the lottery</h3>
        <div>
          <Button primary content="Enter Lottery" icon="add circle" onClick={this.onEnterContract} />
          <Button secondary content="Pick a Winner" icon="ethereum" onClick={this.onClickPickWinner} />
        </div>
        {this.renderMessage(this.state.message)}
        <Divider />
        <p>
          Click here to view{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://rinkeby.etherscan.io/address/0x2502FA8f3e8d258cb64CD9eb48230F24C5822a0c">
            lottery contract's details
          </a>
        </p>
        <p>Contract is managed by {formatAddress(this.state.manager)}</p>
      </Container>
    );
  }
}

export default App;
