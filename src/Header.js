import React from 'react';
import { Card } from 'semantic-ui-react';

const items = [
  {
    header: 'LOTTERY CONTRACT',
    description: (
      <p>
        Download browser extension <a href="https://github.com/MetaMask/metamask-extension">Metamask</a> to use this app
      </p>
    ),
    fluid: true,
  },
];

const Header = () => <Card.Group items={items} />;

export default Header;
