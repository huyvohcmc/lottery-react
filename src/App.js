import React, { Component } from 'react';
import { Container, Header, Button, Divider, Confirm, Icon } from 'semantic-ui-react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { etherToWei, weiToEther, formatAddress } from './utils';
// import Header from './Header';
import { MessageProcessing, MessageStatusWrapper } from './Message';
import StepGroup from './Step';
import StatisticWrapper from './StatisticWrapper';

const AMOUNT_TO_ENTER = 0.01; // Should have retrieve this value from the lottery

class App extends Component {
  state = {
    manager: '',
    players: [],
    lotteryBalance: '',
    message: {},
    open: false,
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

    this.setState({ open: false });

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

    try {
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
    } catch (error) {
      this.setState({ message: {} });
      console.log(error.message);
    }
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

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });

      this.setState({
        ...this.baseState,
        message: {
          status: 'positive',
          header: `Player #${await lottery.methods.winnerIndex().call()} has won ${weiToEther(prizePool)} ether!`,
          content: `Please check your wallet, ${formatAddress(await lottery.methods.winner().call())}.`,
        },
      });
    } catch (error) {
      this.setState({ message: {} });
      console.log(error.message);
    }
  };

  isEmpty = obj => Object.keys(obj).length === 0;

  renderMessage = message => {
    if (!this.isEmpty(message)) {
      return message.status ? <MessageStatusWrapper {...message} /> : <MessageProcessing {...message} />;
    }
    return null;
  };

  open = () => this.setState({ open: true });

  close = () => this.setState({ open: false });

  style = {
    h1: {
      marginTop: '1em',
    },
    h3: {
      margin: '1em 0em 2em',
    },
    enterButton: {
      marginRight: 20,
    },
  };

  render() {
    return (
      <Container>
        <Header as="h1" content="LOTTERY CONTRACT" style={this.style.h1} />
        <Header
          as="h3"
          content={
            <p>
              * Download browser extension{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/MetaMask/metamask-extension">
                Metamask
              </a>{' '}
              to use this app
            </p>
          }
          style={this.style.h3}
        />
        <Divider />
        <Header as="h3" content="The Rule Is Simple:" />
        <StepGroup amountToEnter={AMOUNT_TO_ENTER} />
        <StatisticWrapper players={this.state.players.length} prizePool={weiToEther(this.state.lotteryBalance)} />
        <Divider />
        <Header as="h3" content={<p>Spend {AMOUNT_TO_ENTER} ether to enter the lottery</p>} style={this.style.h3} />
        <div>
          <Button
            primary
            content="Enter Lottery"
            icon="add circle"
            onClick={this.open}
            style={this.style.enterButton}
          />
          <Confirm
            open={this.state.open}
            content={`You will give the lottery ${AMOUNT_TO_ENTER} ether to enter.`}
            onCancel={this.close}
            onConfirm={this.onEnterContract}
          />
          <Button secondary content="Pick a Winner" icon="ethereum" onClick={this.onClickPickWinner} />
        </div>
        {this.renderMessage(this.state.message)}
        <Divider />
        <p>
          View{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://rinkeby.etherscan.io/address/0x2502FA8f3e8d258cb64CD9eb48230F24C5822a0c">
            Lottery Contract's Details
          </a>{' '}
          on Rinkeby Etherscan
        </p>
        <p>Contract is managed by {formatAddress(this.state.manager)}</p>
        <p>
          <Icon name="github" />
          <a href="https://github.com/huyvohcmc/lottery-react" target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </p>
      </Container>
    );
  }
}

export default App;
