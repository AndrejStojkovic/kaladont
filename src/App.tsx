import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Use BrowserRouter if you are not using GH Pages
import { saveDarkThemeState, loadDarkThemeState } from './components/localStorage';

import { ThemeProvider } from '@mui/material';
import { Container, Box, Typography, Button, ButtonGroup, Link, SvgIcon, Divider} from '@mui/material';
import { PlayArrow, Abc, Search, InfoOutlined, LightMode, DarkMode } from '@mui/icons-material';
import customTheme from './components/theme';

import Play from './components/Play';
import Words from './components/Words';
import About from './components/About';

function App() {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const handleAboutModalOpen = () => setAboutModalOpen(true);
  const handleAboutModalClose = () => setAboutModalOpen(false);

  const [darkTheme, setDarkTheme] = useState(() => {
    if(loadDarkThemeState() === 'true') return true;
    else return false;
  });

  useEffect(() => {
    if(darkTheme) document.body.classList.add('dark');
    else document.body.classList.remove('dark');

    saveDarkThemeState(darkTheme);
  }, [darkTheme]);

  return (
    <ThemeProvider theme={customTheme}>
      <div className='App'>
        <Container id='main' maxWidth='md'>
          <Box id='header' padding='2rem' textAlign='center'>
            <Typography marginBottom='1rem' variant='h3'>КАЛАДОНТ</Typography>
            <ButtonGroup variant='outlined'>
              <Button href='/'><SvgIcon sx={{ml: '-0.5rem'}} component={PlayArrow} />Играј</Button>
              <Button href='/vezhbaj'><SvgIcon component={Abc} />Вежбај</Button>
              <Button href='/zborovi'><SvgIcon component={Search} />Зборови</Button>
            </ButtonGroup>
          </Box>

          <Routes>
            <Route path='/' element={<Play mode='play' />} />
            <Route path='/vezhbaj' element={<Play mode='practice' />} />
            <Route path='/zborovi' element={<Words />} />
          </Routes>

          <About open={aboutModalOpen} handleClose={handleAboutModalClose} />

          <Box padding='1rem'>
            <Box sx={{textAlign: 'center', margin: '1rem'}}>
              <Button variant='outlined' onClick={() => handleAboutModalOpen()}>
                <SvgIcon sx={{ml: '-0.25rem'}} component={InfoOutlined} /> За Играта
              </Button>
              <br />
              <Button variant='outlined' sx={{mt: 1}} onClick={() => setDarkTheme(!darkTheme)}>
                <SvgIcon sx={{ml: '-0.25rem'}} component={darkTheme ? LightMode : DarkMode} /> Тема
              </Button>
            </Box>

            <Divider />

            <Box paddingTop='1rem' textAlign='center'>
              <Box>
                <Typography>
                  Проект изработен од <Link href='https://github.com/AndrejStojkovic'>Андреј Стојковиќ</Link>
                </Typography>
              </Box>

              <Box>
                <Link href='https://github.com/AndrejStojkovic/kaladont'>GitHub Repo</Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
