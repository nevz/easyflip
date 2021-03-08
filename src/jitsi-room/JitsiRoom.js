import { createRoomsBySize } from '../functions.js';
import { AnswerPollDialog } from './polls/AnswerPollDialog';
import { NewPoll } from './polls/NewPoll';
import { VotePoll } from './polls/VotePoll';

import Button from 'react-bootstrap/Button';
import {
    useParams
  } from "react-router-dom";
import { useHistory } from 'react-router-dom';


import React, { useEffect, useState} from 'react';
import {socket, connectSocket} from './socket';


function JitsiRoom(props) {
    const history = useHistory();

    const { roomName } = useParams();


    const [room, setRoom] = useState(null);

    const [API, setAPI] = useState({});
    const [pollId, setPollId] = useState("5ff71dc25938cf2873d7b751");

    const domain = process.env.REACT_APP_JITSI_URL;

   
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

      joinJitsiRoom(room.roomName);
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

    function joinJitsiRoom(newRoomName){
      removeConference();
      var script = document.createElement('script');
      script.src = "https://meet.jit.si/external_api.js"; //this must be changed to the self hosted one eventually, but must fix it on the server first

      script.async = true;
      script.onload = ()=>{ 
          const options ={
              roomName: newRoomName,
              width: 700,
              height: 700,
              parentNode: document.getElementById('jitsi')
          };
          const newapi = new window.JitsiMeetExternalAPI(domain, options);
          setAPI(newapi);
      };
      document.body.appendChild(script);
      return () => {
          document.body.removeChild(script);
        }
    }

    function removeConference(){
      try {
        document.getElementById('jitsi').removeChild((document.getElementById("jitsiConferenceFrame0")));
      } catch (error) {
        console.log(error)
      }
    }

    function sendToBreakout(event){
        socket.emit('sendToBreakout', room.roomName, 2);
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



    return (
    <div>
      <div id='jitsi' height='700' ></div>
      <Button onClick={sendToBreakout}>Breakout Rooms</Button>
      <Button onClick={callToMainRoom}>Return to main</Button>
      <NewPoll getPollId={getPollId}/>
      <VotePoll pollId={pollId} onSubmit={answerChanged}/>

    </div>
    );
}

export {JitsiRoom};