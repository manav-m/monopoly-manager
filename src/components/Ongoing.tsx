import React, { useState } from 'react';
import { SwapHoriz } from '@mui/icons-material';
import { Button, Chip, Grid, IconButton, TextField } from '@mui/material';
import PlayerList from './PlayerList';
import { Players } from '../types';

const suggestions = [10, 20, 50, 100, 200];

interface OngoingProps {
  players: Players;
  createTransfer: (from: string, to: string, amount: number) => void;
}

const Ongoing = ({ players, createTransfer }: OngoingProps) => {
  const [from, setFrom] = useState(players[0].id);
  const [to, setTo] = useState(players[0].id);
  const [amount, setAmount] = useState<number | undefined>();

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setAmount(Number(event.target.value));
  };

  const applySuggestion = (suggestion: number) => () => {
    setAmount(suggestion);
  };

  const transfer = () => {
    if (from !== to && amount) {
      createTransfer(from, to, amount);
    }
  };

  const swap = () => {
    setTo(from);
    setFrom(to);
  };

  const handlePlayerSelect = (id: string, type: string) => () => {
    if (type === 'from') {
      setFrom(id);
    } else if ((type = 'to')) {
      setTo(id);
    }
  };

  return (
    <div className="app-container">
      <Grid className="app-main" container spacing={0}>
        <IconButton className="swap-button" onClick={swap}>
          <SwapHoriz />
        </IconButton>
        <Grid container item xs={12} md={4} className="column" spacing={0}>
          <Grid
            item
            xs={12}
            className="column-title"
            flexDirection="column"
            justifyContent="center"
          >
            From
          </Grid>
          <Grid className="column-main" item xs={12}>
            <PlayerList
              type="from"
              players={players}
              from={from}
              to={to}
              handleSelection={handlePlayerSelect}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} md={4} className="column" spacing={0}>
          <Grid
            item
            xs={12}
            className="column-title column-title-mid"
            flexDirection="column"
            justifyContent="center"
          >
            To
          </Grid>
          <Grid className="column-main column-main-mid" item xs={12}>
            <PlayerList
              type="to"
              players={players}
              from={from}
              to={to}
              handleSelection={handlePlayerSelect}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} md={4} className="column" spacing={0}>
          <Grid
            item
            xs={12}
            className="column-title"
            flexDirection="column"
            justifyContent="center"
          >
            Value
          </Grid>
          <Grid className="column-main" item xs={12}>
            <div className="input-container">
              <TextField
                variant="standard"
                name="amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleAmountChange}
                fullWidth
              />
            </div>
            <div className="suggestion-list">
              {suggestions.map(suggestion => (
                <Chip
                  onClick={applySuggestion(suggestion)}
                  label={suggestion}
                />
              ))}
            </div>
            <div className="transfer-button-container">
              <Button className="transfer-button" onClick={transfer}>
                Transfer
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Ongoing;
