import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { Ongoing } from './components';
import {
  Button,
  Container,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Input,
  AppBar,
} from '@mui/material';
import produce from 'immer';
import DeleteIcon from '@mui/icons-material/Delete';
import { GameState, STATES } from './types';
import './App.css';
import { Logout } from '@mui/icons-material';

const DEFAULT_STARTING_CASH = 1500;
const MAX_PLAYER_COUNT = 15;

const defaultState = {
  players: [
    {
      id: nanoid(),
      name: 'Bank',
      cash: 100000,
      bank: true,
    },
    {
      id: nanoid(),
      name: 'p1',
      cash: DEFAULT_STARTING_CASH,
    },
    {
      id: nanoid(),
      name: 'p2',
      cash: DEFAULT_STARTING_CASH,
    },
    {
      id: nanoid(),
      name: '',
      cash: DEFAULT_STARTING_CASH,
      new: true,
    },
  ],
  startingCash: DEFAULT_STARTING_CASH,
  state: STATES.INIT,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  const { players, startingCash, state } = gameState;

  const handleStartingCashChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const updatedStartingCash = Number(event.target.value);
    setGameState(
      produce(gameState, draft => {
        draft.startingCash = updatedStartingCash;
        draft.players.forEach(player => {
          player.cash = updatedStartingCash;
        });
      })
    );
  };

  const handleNameChange =
    (playerId: string) =>
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setGameState(
        produce(gameState, draft => {
          const playerToUpdate = draft.players.find(
            player => player.id === playerId
          );
          if (playerToUpdate) {
            playerToUpdate.name = event.target.value;
            if (playerToUpdate.new) {
              playerToUpdate.new = false;
              if (players.length <= MAX_PLAYER_COUNT) {
                draft.players.push({
                  id: nanoid(),
                  name: '',
                  cash: DEFAULT_STARTING_CASH,
                  new: true,
                });
              }
            }
          }
        })
      );
    };

  const removePlayer = (playerId: string) => () => {
    setGameState(
      produce(gameState, draft => {
        draft.players = draft.players.filter(player => player.id !== playerId);
      })
    );
  };

  const createTransfer = (from: string, to: string, amount: number) => {
    setGameState(
      produce(gameState, draft => {
        const playerFrom = draft.players.find(player => player.id === from);
        const playerTo = draft.players.find(player => player.id === to);
        if (playerFrom && playerTo && amount) {
          playerFrom.cash -= amount;
          playerTo.cash += amount;
        }
      })
    );
  };

  const startGame = () => {
    setGameState(
      produce(gameState, draft => {
        draft.state = STATES.ONGOING;
        draft.players.pop();
      })
    );
  };

  const exitGame = () => {
    setGameState(
      produce(gameState, draft => {
        draft.players.forEach(player => (player.cash = DEFAULT_STARTING_CASH));
        draft.state = STATES.INIT;
      })
    );
  };

  return (
    <>
      {state === STATES.ONGOING && (
        <AppBar className="app-bar" position="static">
          <div className="app-bar-title">Monopoly Bank</div>
          <div className="app-bar-logout" onClick={exitGame}>
            <Logout
              classes={{ fontSizeSmall: 'app-bar-logout-icon' }}
              fontSize="small"
            />
            <div className="app-bar-logout-text">Exit Game</div>
          </div>
        </AppBar>
      )}
      <Container className="container">
        {state === STATES.INIT && (
          <Grid
            className="grid-container"
            container
            spacing={2}
            alignContent="center"
            flexDirection="column"
          >
            <Grid item xs={10} md={8} lg={6} className="grid-container-home">
              <div className="inner-container">
                <div className="header-container">
                  <div className="heading">TITLE DEED</div>
                  <div className="title">MONOPOLY BANK</div>
                </div>
                <div className="home-body">
                  <Grid container>
                    <Grid item xs={6} className="starting-money-label">
                      Starting Money:
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        className="starting-money-input"
                        variant="standard"
                        size="small"
                        name="starting-cash"
                        type="number"
                        inputProps={{
                          textAlign: 'center',
                        }}
                        value={startingCash}
                        onChange={handleStartingCashChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    {players
                      .filter(player => !player.bank)
                      .map((player, index) => (
                        <Grid
                          item
                          container
                          spacing={1}
                          key={player.id}
                          className="player-container"
                          xs={12}
                        >
                          <Grid
                            item
                            xs={1}
                            id="player-id"
                            className="player-index"
                          >
                            #{index + 1}
                          </Grid>
                          <Grid item xs={11}>
                            <Input
                              size="small"
                              id="player-name"
                              name="name"
                              type="text"
                              fullWidth
                              value={player.name}
                              onChange={handleNameChange(player.id)}
                              endAdornment={
                                !player.new && players.length > 4 ? (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={removePlayer(player.id)}
                                      edge="end"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ) : undefined
                              }
                            />
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                </div>
                <Button id="start-button" onClick={startGame}>
                  Start Game
                </Button>
              </div>
            </Grid>
          </Grid>
        )}
        {state === STATES.ONGOING && (
          <Ongoing players={players} createTransfer={createTransfer} />
        )}
      </Container>
    </>
  );
}

export default App;
