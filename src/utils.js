import web3 from './web3';

export const etherToWei = value => web3.utils.toWei(value, 'ether');

export const weiToEther = value => web3.utils.fromWei(value, 'ether');

export const formatAddress = address => address.slice(0, 7) + '...';
