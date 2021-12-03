import { AccountBalance } from '@mui/icons-material';
import { Grid } from '@mui/material';
import React from 'react';
import { Players } from '../types';

interface PlayerListProps {
  players: Players;
  from: string;
  to: string;
  type: 'from' | 'to';
  handleSelection: (id: string, type: 'from' | 'to') => () => void;
}

const PlayerList = ({
  players,
  from,
  to,
  type,
  handleSelection,
}: PlayerListProps) => (
  <Grid container spacing={0} className="player-list">
    {players.map((player, index) => {
      let className = 'player-list-item';
      if (type === 'from' && player.id === from) {
        className += ' highlight-from';
      } else if (type === 'to' && player.id === to) {
        className += ' highlight-to';
      }

      return (
        <Grid
          container
          item
          xs={12}
          spacing={2}
          className={className}
          onClick={handleSelection(player.id, type)}
        >
          <Grid
            item
            xs={2}
            className="index"
            flexDirection="column"
            justifyContent="center"
          >
            {player.bank ? <AccountBalance /> : `#${index}`}
          </Grid>
          <Grid
            item
            xs={8}
            className="name"
            flexDirection="column"
            justifyContent="center"
          >
            {player.name}
          </Grid>
          <Grid
            item
            xs={2}
            className="cash"
            flexDirection="column"
            justifyContent="center"
          >
            {player.bank ? '∞' : player.cash}
          </Grid>
        </Grid>
      );
    })}
  </Grid>
);

export default PlayerList;
