
import Button from 'react-bootstrap/Button';
import React, { useEffect } from 'react';

import { socket } from './socket';
import { NewPoll } from './polls/NewPoll';
import { BreakoutDialog } from './breakout/BreakoutDialog';
import { ResultsPoll } from './polls/ResultsPoll';


function OwnerMenu({ room = null, pollId = "" }) {

  useEffect(() => {
    socket.on('roomsCreated', showBreakoutRooms);
  }, [])


  //TODO: put the array of received breakoutroomnames into an interface
  function showBreakoutRooms(breakoutRoomNames) {
    console.log(breakoutRoomNames);
  }

  function sendToBreakout(breakoutRoomSize, breakoutOption, smartBreakoutOption) {
    socket.emit('sendToBreakout', room.roomName, breakoutRoomSize, breakoutOption, smartBreakoutOption);
  }

  function callToMainRoom() {
    socket.emit('callToMainRoom', room.roomName);
  }

  function forceToMainRoom() {
    socket.emit('forceToMainRoom', room.roomName);
  }

  function showResultsToParticipants() {
    socket.emit('showResults', room.roomName);
  }


  //rename this, confusion
  //gets the pollId from the poll dialog and sends notification to server to set it
  function getPollId(pollId) {
    socket.emit('setPollId', room.roomName, pollId)
  }


  return (
    <div>
      <div>
        <h3> Poll options</h3>
        <NewPoll getPollId={getPollId} />
        <ResultsPoll pollId={pollId} owner={true} />
        <Button onClick={showResultsToParticipants}>Send results to audience</Button>

      </div>
      <div>
        <h3>Breakout options</h3>
        <Button onClick={callToMainRoom}>Call back to main room</Button>
        <Button onClick={forceToMainRoom}>Force to main room</Button>

        <BreakoutDialog sendToBreakout={sendToBreakout} />
      </div>
    </div>
  );
}

export { OwnerMenu };