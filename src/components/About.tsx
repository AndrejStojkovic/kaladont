import React from 'react';
import { Box, Typography, Dialog, Button, SvgIcon, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type AboutProps = {
  open: boolean,
  handleClose: () => void
}

const About = ({open, handleClose}: AboutProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={{textAlign: 'center', padding: '1rem'}}>
        <Typography id="modal-modal-title" variant="h5">
          За играта
        </Typography>

        <Button onClick={() => handleClose()} sx={{position: 'absolute', top: 0, right: 0, margin: '.25rem', minWidth: '32px'}}>
          <SvgIcon component={CloseIcon} />
        </Button>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Проект базиран на позната игра Каладонт со отворен код<br/>кој може да го најдете <Link href='https://github.com/AndrejStojkovic/kaladont'>тука</Link> или најдоле на веб страната. 
        </Typography>

        <Typography id="modal-modal-title" variant="h6" sx={{ mt: 2 }}>
          Правила
        </Typography>

        <Typography id="modal-modal-description">
          1. Треба да внесете збор што почнува на<br/>првите две букви од последниот збор.<br/>
          2. Зборот не смее да завршува на <b>'ка'</b><br/>
          3. Латиница, симболи и бројки не се дозволени!<br/>
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 3, mb: 1, fontSize: '12px', fontStyle: 'italic' }}>
          <b>Забелешка:</b> Базата на зборови е преземена од<br />
          веб страната <Link href='http://drmj.eu/'>drmj.eu</Link> и истата не е променета.<br />
          Доколку најдете неправилности,пријавете го проблемот на <Link href='https://github.com/AndrejStojkovic/kaladont'>Github</Link> или на <Link href='mailto:andrejstojkovikj@yahoo.com'>e-mail</Link>.
        </Typography>
      </Box>
    </Dialog>
  )
}

export default About;