import { createRoomsBySize } from '../functions.js';
import { NewPollDialog} from './polls/NewPollDialog';
import { AnswerPollDialog } from './polls/AnswerPollDialog';
import Button from 'react-bootstrap/Button';
import socketIOClient from "socket.io-client";
import {
    useParams
  } from "react-router-dom";
import { useHistory } from 'react-router-dom';


import React, { useEffect, useState} from 'react'

const socket = socketIOClient('localhost:9000', {
  withCredentials: true
 });

function JitsiRoom(props) {
    const history = useHistory();

    const { roomName } = useParams();

    const [ currentRoomName, setCurrentRoomName] = useState(undefined);

    const [API, setAPI] = useState({});


    const domain = 'easyflip.repositorium.cl';

    //join socket
    useEffect(() => {
      setCurrentRoomName(roomName);
      socket.on('notifyBreakout', changeRoom);
      socket.emit('joinRoom', roomName);
      socket.emit('setUserName', localStorage.getItem('userToken'));
    }, []);

    function removeConference(){
      try {
        document.getElementById('jitsi').removeChild((document.getElementById("jitsiConferenceFrame0")));
      } catch (error) {
        console.log(error)
      }
    }

    function joinJitsiRoom(newRoomName){
      removeConference();
      var script = document.createElement('script');
      script.src = "https://meet.jit.si/external_api.js";
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

    useEffect(() => {
        joinJitsiRoom(roomName);
    }, []);    

    function sendToBreakout(event){
        const participants = API.getParticipantsInfo();
        console.log(participants[0]);
        socket.emit('sendToBreakout', roomName, participants, '5ff71dc25938cf2873d7b751');
    } 

    function joinSocketRoom(newRoomName){
      socket.emit('joinRoom', newRoomName);
    }

    function changeRoom(){
      var newRoomName = 'new' + roomName;
      console.log(roomName);
      joinSocketRoom(newRoomName)
      joinJitsiRoom(newRoomName);
      history.push('/new' + roomName);
  }

  //called when the question of the room is changed
  function questionChanged(){
    
  }

  function answerChanged(){
    console.log('answer changed')
  }

    return (
    <div>
      <div id='jitsi' height='700' ></div>
      <Button onClick={sendToBreakout}>Send</Button>
      <Button onClick={changeRoom}>New Room</Button>
      <NewPollDialog />
      <AnswerPollDialog pollId='5ff71dc25938cf2873d7b751' onSubmit={answerChanged}/>
    </div>
    );
}

export {JitsiRoom};