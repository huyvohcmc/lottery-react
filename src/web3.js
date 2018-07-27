import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and Metamask is running
  const web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server or the user don't use Metamask
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/59c05e5eb5a444ed8fcae6ecc34f24ff');
}

export default web3;
