import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

export const MessageProcessing = ({ header, content }) => (
  <Message icon>
    <Icon name="circle notched" loading />
    <Message.Content>
      <Message.Header>{header}</Message.Header>
      <p>{content}</p>
    </Message.Content>
  </Message>
);

export const MessageStatusWrapper = ({ status, header, content }) => (
  <Message
    positive={status === 'positive'}
    warning={status === 'warning'}
    negative={status === 'negative'}
  >
    <Message.Header>{header}</Message.Header>
    <p>{content}</p>
  </Message>
);
