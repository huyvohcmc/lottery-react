import React, { Component } from 'react';
import { Container, Header, Button, Divider, Confirm } from 'semantic-ui-react';
import web3 from './web3';
import lottery from './lottery';
import StepGroup from './components/StepGroup';
import StatisticWrapper from './components/StatisticWrapper';
import HeaderWrapper from './components/HeaderWrapper';
import Footer from './components/Footer';
import { MessageProcessing, MessageStatusWrapper } from './components/Message';
import { etherToWei, weiToEther, formatAddress, isEmpty } from './utils';

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
    this.setState({ open: false });

    const accounts = await web3.eth.getAccounts();

    if (weiToEther(await web3.eth.getBalance(accounts[0])) < AMOUNT_TO_ENTER) {
      this.setState({
        message: {
          status: 'negative',
          header: 'Transaction rejected',
          content:
            'You do not have enough ether to join. Please buy some ether to use this app.',
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
          header: `Player #${await lottery.methods
            .winnerIndex()
            .call()} has won ${weiToEther(prizePool)} ether!`,
          content: `Please check your wallet, ${formatAddress(
            await lottery.methods.winner().call(),
          )}.`,
        },
      });
    } catch (error) {
      this.setState({ message: {} });
      console.log(error.message);
    }
  };

  renderMessage = message => {
    if (!isEmpty(message)) {
      return message.status ? (
        <MessageStatusWrapper {...message} />
      ) : (
        <MessageProcessing {...message} />
      );
    }
    return null;
  };

  open = () => this.setState({ open: true });

  close = () => this.setState({ open: false });

  render() {
    return (
      <Container>
        <HeaderWrapper />
        <Divider />
        <Header
          as="h3"
          style={{ margin: '1em 0em' }}
          content="The Rule Is Simple:"
        />
        <StepGroup amountToEnter={AMOUNT_TO_ENTER} />
        <StatisticWrapper
          players={this.state.players.length}
          prizePool={weiToEther(this.state.lotteryBalance)}
        />
        <Divider />
        <div style={{ margin: '2em 0em' }}>
          <Header
            as="h3"
            content={<p>Spend {AMOUNT_TO_ENTER} ether to enter the lottery</p>}
            style={{ margin: '1em 0em' }}
          />
          <Button
            primary
            content="Enter Lottery"
            icon="add circle"
            onClick={this.open}
            style={{ marginRight: 15 }}
          />
          <Confirm
            open={this.state.open}
            content={`You will give the lottery ${AMOUNT_TO_ENTER} ether to enter.`}
            onCancel={this.close}
            onConfirm={this.onEnterContract}
          />
          <Button
            secondary
            content="Pick a Winner"
            icon="ethereum"
            onClick={this.onClickPickWinner}
          />
          {this.renderMessage(this.state.message)}
        </div>
        <Divider />
        <Footer
          style={{ margin: '2em 0em' }}
          managerAddress={formatAddress(this.state.manager)}
        />
      </Container>
    );
  }
}

export default App;
