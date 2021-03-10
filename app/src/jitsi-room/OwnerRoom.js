
import Button from 'react-bootstrap/Button';
import {
    useParams
  } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState} from 'react';

import {socket, connectSocket} from './socket';
import { NewPoll } from './polls/NewPoll';
import { VotePoll } from './polls/VotePoll';
import { BreakoutDialog } from './breakout/BreakoutDialog';
import { JitsiWindow } from './JitsiWindow';


function OwnerRoom(props) {
    const history = useHistory();

    const { roomName } = useParams();


    const [room, setRoom] = useState(null);

    const [pollId, setPollId] = useState("5ff71dc25938cf2873d7b751");


   
    useEffect(() => {

      socket.on('roomData', getRoomData);
      connectSocket();

      console.log('requesting roomdata from room ', roomName);
      socket.emit('getRoomData', roomName);

      return () => {
        socket.disconnect();
      };
    }, [roomName]);

    useEffect(() => {
      if(!room){
        console.log('the room doesnt exist', room)
        return;
      }

      socket.on('notifyBreakout', goToBreakout);
      socket.on('pollChanged', pollChanged);
      socket.on('returnToMainRoom', returnToMainRoom);
      socket.emit('joinRoom', room.roomName);
      console.log('the room is ', room)
      return( () => {
        socket.emit('leaveRoom', room.roomName);
      });
  }, [room]);    

    //is called when socket receives the roomData event. Sets the room to a new one
    function getRoomData(newRoom){
      console.log('getting data from room', newRoom);
      setPollId(newRoom.pollId);
      setRoom(prevRoom => (newRoom));
    }


    function sendToBreakout(breakoutRoomSize, breakoutOption, smartBreakoutOption){
        socket.emit('sendToBreakout', room.roomName, breakoutRoomSize, breakoutOption, smartBreakoutOption);
    }

    function callToMainRoom(){
      socket.emit('callToMainRoom', room.roomName);
    }

    function joinRoom(newRoomName){
      history.push('/' + newRoomName);
    }

    function leaveRoom(){
      socket.emit('leaveRoom', room.roomName);
    }


    function goToBreakout({breakoutRoomName, originalRoomName}){
      console.log('going to breakout from ', room.roomName, ' to ', breakoutRoomName);
      if(room.roomName === originalRoomName){
        joinRoom(breakoutRoomName);
      }
    }

  function returnToMainRoom(mainRoomName){
    console.log('returning', mainRoomName, room.parent);
    if(mainRoomName === room.parent){
      leaveRoom();
      joinRoom(mainRoomName);
    }
  }

  //called when the question of the room is changed
  function pollChanged(fromRoomName, pollId){
    console.log('the poll is changing', room);
    if(room.roomName===fromRoomName){
      setPollId(pollId);
    }
  }

  function answerChanged(){
    console.log('answer changed');
  }


  //rename this, confusion
  //gets the pollId from the poll dialog and sends notification to server to set it
  function getPollId(pollId){
    setPollId(pollId);
    socket.emit('setPollId', roomName, pollId)
  }


  function renderJitsiWindow(){
    if(room){
      return <JitsiWindow roomName={room.roomName} />
    }
    else{
      return <p>There is no room to join here</p>
    }
  }

  return(
    <div>
      {renderJitsiWindow()}
      <Button onClick={callToMainRoom}>Return to main</Button>
      <NewPoll getPollId={getPollId}/>
      <VotePoll pollId={pollId} onSubmit={answerChanged}/>
      <BreakoutDialog sendToBreakout={sendToBreakout}/>
    </div>
    );
}

export { OwnerRoom };