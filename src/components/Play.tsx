import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { Container, Box, Typography, Alert, TextField, ButtonGroup, Button } from '@mui/material';
import customTheme from './theme';
import axios from 'axios';

import { bukvi } from './bukvi';
const json_url = '/zborovi-json/';

type PropTypes = {
  mode: string
}

const Play = ({mode} : PropTypes) => {
  const [opponentTurn, setOpponentTurn] = useState(false);
  const [previousWord, setPreviousWord] = useState('...');
  const [currentWord, setCurrentWord] = useState('');
  const [error, setError] = useState('0');
  const [errorMessage, setErrorMessage] = useState('...');
  const [usedWords, setUsedWords] = useState<string[]>([]);

  useEffect(() => {
    newWord();
    displayError(false);
    // eslint-disable-next-line
  }, [mode]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key);
    if(event.key === 'Enter') submit();
  }

  function newWord(letter = getRandomInt(0, bukvi.length - 1)) {
    axios.get(`${json_url}${bukvi[letter]}.json`)
      .then((res) => {
        let randomWord = opponentTurn === false ? Math.floor(Math.random() * res.data.length) : getOpponentsWord(res.data);
        let word = res.data[randomWord].charAt(0).toUpperCase() + res.data[randomWord].slice(1);

        while(word[word.length - 2] + word[word.length - 1] === 'ка') {
          randomWord = opponentTurn === false ? Math.floor(Math.random() * res.data.length) : getOpponentsWord(res.data);
          word = res.data[randomWord].charAt(0).toUpperCase() + res.data[randomWord].slice(1);
        }

        setStates(word);
      }).catch(err => console.log(err));
  }

  function getOpponentsWord(data: any[]) {
    let start = 0, end = 1;
    let curr = currentWord.slice(currentWord.length - 2);

    for(let i = 0; i < data.length; i++) {
      if(curr[1] === data[i][1]) {
        start = i;
        break;
      }
    }

    for(let i = data.length - 1; i >= 0; i--) {
      if(curr[1] === data[i][1]) {
        end = i;
        break;
      }
    }

    return getRandomInt(start, end);
  }

  function submit() {
    console.log('submit')
    // Proveri dali zborot e validen
    if(currentWord.length <= 2) {
      displayError(true, 'Мора да внесете некој збор поголем од 2 букви!');
      return;
    }

    // Proveri dali zborot sodrzhi latinica, znaci i broevi
    for(let i = 0; i < currentWord.length; i++) {
      if(bukvi.includes(currentWord[i].toLowerCase())) { continue; }
      else {
        displayError(true, 'Не е дозволено латиница, знаци и броеви!');
        return;
      }
    }

    // Proveri dali zborot pochnuva na tochnite bukvi
    let previous = previousWord.slice(previousWord.length - 2).toLowerCase();
    if((previous[0] + previous[1]) !== (currentWord[0].toLowerCase() + currentWord[1].toLowerCase())) {
      displayError(true, 'Зборот не почнува на последните две букви од претходниот збор!');
			return;
    }
    
    // Proveri dali zborot e iskoristen
    let used = false;
    usedWords.forEach((word : string) => used = word.toLowerCase() === currentWord.toLowerCase() ? true : false);

    if(used) {
      displayError(true, 'Тој збор е веќе искористен!');
      return;
    }

    // Proveri dali zborot postoi
    let exists = false;
    axios.get(`${json_url}${currentWord[0].toLowerCase()}.json`)
      .then((res) => {
        //res.data.forEach((word : string) => exists = word.toLowerCase() === currentWord.toLowerCase() ? true : false);
        for(let i = 0; i < res.data.length; i++) {
          if(res.data[i].toLowerCase() === currentWord.toLowerCase()) {
            exists = true;
            break;
          }
        }
      }).then(() => {
        if(!exists) {
          displayError(true, 'Зборот не е пронајден во базата на податоци!');
				  return;
        }

        // Proveri dali zborot zavrshuva na 'ka'
        if(currentWord.slice(currentWord.length - 2).toLowerCase() === 'ка') {
          displayError(true, 'Зборот завршува на \'ка\'!');
          return;
        }

        displayError(false);
        setStates(currentWord);

        if(mode === 'play') {
          setOpponentTurn(true);

          setTimeout(() => {
            newWord();
            setOpponentTurn(false);
          }, 1000);
        }
      }).catch(err => console.log(err));
  }

  function displayError(state : boolean, msg = '...') {
    setErrorMessage(msg);
    setError(state ? '1' : '0');
  }

  function setStates(word : string) {
    setPreviousWord(word);
    setCurrentWord(word[word.length - 2].toUpperCase() + word[word.length - 1]);
    setUsedWords([...usedWords, word]);
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box marginBottom='5rem'>
        <Container maxWidth='sm'>
          <Alert sx={{opacity: error, justifyContent: 'center'}} id='error' severity='error'>{errorMessage}</Alert>

          <Box textAlign='center' margin='1rem 0'>
            <Typography>Збор:</Typography>
            <Typography variant='h4'>{previousWord}</Typography>

            <Box sx={{opacity: opponentTurn ? '0' : '1'}} margin='1rem'>
              <TextField autoComplete='off'
                label='Ваш збор'
                variant='standard'
                InputProps={{ style: { fontSize: '2rem'} }}
                InputLabelProps={{ style: { fontSize: '2rem', top: '-5px'} }}
                onChange={(e) => setCurrentWord(e.target.value)}
                onKeyDown={handleKeyPress}
                value={currentWord}/><br />
            </Box>

            <ButtonGroup>
              <Button onClick={() => newWord()} variant='outlined'>Нов Збор</Button>
              <Button onClick={() => submit()} variant='contained' disableElevation>Поднеси</Button>
            </ButtonGroup>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

function getRandomInt(min : number, max : number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Play;