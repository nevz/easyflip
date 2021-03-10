
import Button from 'react-bootstrap/Button';
import React from 'react';

import { socket } from './socket';
import { NewPoll } from './polls/NewPoll';
import { BreakoutDialog } from './breakout/BreakoutDialog';
import { JitsiWindow } from './JitsiWindow';


function OwnerRoom(props) {


    function sendToBreakout(breakoutRoomSize, breakoutOption, smartBreakoutOption){
        socket.emit('sendToBreakout', props.room.roomName, breakoutRoomSize, breakoutOption, smartBreakoutOption);
    }

    function callToMainRoom(){
      socket.emit('callToMainRoom', props.room.roomName);
    }


  //rename this, confusion
  //gets the pollId from the poll dialog and sends notification to server to set it
  function getPollId(pollId){
    socket.emit('setPollId', props.room.roomName, pollId)
  }


  return(
    <div>
      <Button onClick={callToMainRoom}>Return to main</Button>
      <NewPoll getPollId={getPollId}/>
      <BreakoutDialog sendToBreakout={sendToBreakout}/>
    </div>
    );
}

export { OwnerRoom };