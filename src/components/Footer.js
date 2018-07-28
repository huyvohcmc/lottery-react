import React from 'react';
import { Icon } from 'semantic-ui-react';

const Footer = ({ style, managerAddress }) => (
  <div style={style}>
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
    <p>Contract is managed by {managerAddress}</p>
    <p>
      <Icon name="github" />
      <a href="https://github.com/huyvohcmc/lottery-react" target="_blank" rel="noopener noreferrer">
        View Source Code
      </a>
    </p>
  </div>
);

export default Footer;
