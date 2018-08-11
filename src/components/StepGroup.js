import React from 'react';
import { Icon, Step } from 'semantic-ui-react';

const StepGroup = ({ amountToEnter }) => (
  <Step.Group style={{ margin: '0px 0px' }}>
    <Step>
      <Icon name="user plus" />
      <Step.Content>
        <Step.Title>Enter</Step.Title>
        <Step.Description>Spend {amountToEnter} ether to enter the lottery</Step.Description>
      </Step.Content>
    </Step>
    <Step>
      <Icon name="random" />
      <Step.Content>
        <Step.Title>Pick Winner</Step.Title>
        <Step.Description>A winner will be picked randomly</Step.Description>
      </Step.Content>
    </Step>
    <Step>
      <Icon name="ethereum" />
      <Step.Content>
        <Step.Title>Prize Pool</Step.Title>
        <Step.Description>The winner wins all ethers of that round</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
);

export default StepGroup;
