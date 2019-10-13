import React from 'react';
import { Header } from 'semantic-ui-react';

const style = {
  h1: {
    marginTop: '1em'
  },
  h3: {
    margin: '1em 0em'
  }
};

const HeaderWrapper = () => (
  <div>
    <Header as="h1" content="LOTTERY CONTRACT" style={style.h1} />
    <Header
      as="h3"
      content={
        <p>
          * Download browser extension{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/MetaMask/metamask-extension"
          >
            Metamask
          </a>{' '}
          to use this app
        </p>
      }
      style={style.h3}
    />
  </div>
);

export default HeaderWrapper;
