
import Button from 'react-bootstrap/Button';
import React from 'react';

import { socket } from './socket';
import { NewPoll } from './polls/NewPoll';
import { BreakoutDialog } from './breakout/BreakoutDialog';


function OwnerMenu(props) {


  function sendToBreakout(breakoutRoomSize, breakoutOption, smartBreakoutOption) {
    socket.emit('sendToBreakout', props.room.roomName, breakoutRoomSize, breakoutOption, smartBreakoutOption);
  }

  function callToMainRoom() {
    socket.emit('callToMainRoom', props.room.roomName);
  }


  //rename this, confusion
  //gets the pollId from the poll dialog and sends notification to server to set it
  function getPollId(pollId) {
    socket.emit('setPollId', props.room.roomName, pollId)
  }


  return (
    <div>
      <div>
        <h3> Poll options</h3>
        <NewPoll getPollId={getPollId} />

      </div>
      <div>
        <h3>Breakout options</h3>
          <Button onClick={callToMainRoom}>Call back to main</Button>
          <BreakoutDialog sendToBreakout={sendToBreakout} />
      </div>
    </div>
  );
}

export { OwnerMenu };