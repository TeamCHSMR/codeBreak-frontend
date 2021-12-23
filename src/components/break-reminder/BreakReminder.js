import * as React from 'react';
import { useState, useEffect } from 'react';
// import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import BreakReminderModal from '../break-modal/Modal';
import './breakReminder.scss';
import { When } from 'react-if';

export default function BreakReminder() {

  const [second, setSecond] = useState('00');
  const [minute, setMinute] = useState('00');
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter;
        const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}` : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter(counter => {
          if (counter <= 0) {
            handleOpen();
            stopTimer();
          }
          return counter - 1;
        });
      }, 1000)
    }
    // cleanup function to clear the interval when the effect stops running.
    return () => clearInterval(intervalId);
  }, [isActive, counter])

  function stopTimer() {
    setIsActive(false);
    setCounter(0);
    setSecond('00');
    setMinute('00');
  }

  // MODAL: state
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleChange(e) {
    let userBreakInterval = e.target.value * 60;
    setCounter(userBreakInterval);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    // TODO: Implement modal for break reminder component
    // <Modal>
    <div id="breakReminder">
      <Box className="time">
        <FormControl id='formControl' onSubmit={handleSubmit}>
          <InputLabel>Take next break in...</InputLabel>
          <OutlinedInput
            type='number'
            min='0'
            placeholder="Minutes"
            name="breaktime"
            color="success"
            onChange={handleChange}>
          </OutlinedInput>
          <div id="timerDiv">
            <span className="minute">{minute}</span>
            <span>:</span>
            <span className="second">{second}</span>
          </div>
          <Stack spacing={2} direction="row">
            <When condition={counter > 0}> {/*may not want to have this conditionally rendered */}
              <Button variant="contained" color="success" onClick={() => setIsActive(!isActive)}>{isActive ? "Pause" : "Start"}</Button>
            </When>
            <When condition={counter > 0}>
              <Button variant="contained" color="warning" onClick={stopTimer}>Reset</Button>
            </When>
          </Stack>
        </FormControl>
        <BreakReminderModal open={open} handleOpen={handleOpen} handleClose={handleClose} />
      </Box>
    </div >
    // </Modal>
  );
}
