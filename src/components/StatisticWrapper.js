import React from 'react';
import { Statistic } from 'semantic-ui-react';

const StatisticWrapper = ({ players, prizePool }) => {
  const items = [
    { key: 'players', label: 'Players', value: players.toString() },
    { key: 'ether', label: 'Ether', value: prizePool.toString() }
  ];

  return <Statistic.Group items={items} />;
};

export default StatisticWrapper;
