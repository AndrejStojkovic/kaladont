import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { Container, Box, Typography, SvgIcon, Button, CircularProgress } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import customTheme from './theme';
import axios from 'axios';

import { bukvi } from './bukvi';
const json_url = '/zborovi-json/';

type WordsArray = {
  key: number,
  letter: string,
  words: string[],
  expanded: boolean
}

const Words = () => {
  const [words, setWords] = useState<WordsArray[]>([]);

  useEffect(() => {
    bukvi.forEach((bukva : string, index : number) => {
      axios.get(`${json_url}${bukva}.json`)
        .then((res) => {
          setWords(elements => [...elements, {key: index, letter: bukva, words: res.data, expanded: false}]);
        });
    });
  }, []);

  const updateExpandedState = (index: number) => {
    const newWords = [...words];
    newWords[index].expanded = !newWords[index].expanded;
    setWords(newWords);
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Container maxWidth='sm' sx={{overflow: 'auto'}}>
        {words.length >= bukvi.length && words.sort((a, b) => a.key > b.key ? 1 : -1).map((obj) => {
          return (
            <Box key={obj.key}>
              <Box sx={{display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', margin: '5px 0', background: '#f5f5f5', borderRadius: 2}}>
                <Typography variant='h4' sx={{width: '50px', textAlign: 'center', fontWeight: '300', marginLeft: '.5rem'}}>
                  {obj.letter.toUpperCase()}
                </Typography>
                <Button onClick={() => updateExpandedState(obj.key)}>
                  <SvgIcon component={obj.expanded ? Remove : Add} />
                </Button>
              </Box>

              <Box sx={{fontSize: '14px', textAlign: 'justify'}} display={obj.expanded ? 'block' : 'none'}>{obj.words.join(', ')}</Box>
            </Box>
          )
        })}
      </Container>

      {words.length < bukvi.length &&
      <Box sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <CircularProgress />
      </Box>}
    </ThemeProvider>
  )
}
//
export default Words;