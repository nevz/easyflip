import { createRoomsBySize } from './functions.js';
import { NewPollDialog} from './polls/NewPollDialog';
import { AnswerPollDialog } from './polls/AnswerPollDialog';
import Button from 'react-bootstrap/Button';

import React, { useEffect, useState} from 'react'

function App(props) {
    const [API, setAPI] = useState({});
    const [roomName, setRoomName] = useState("easyFlipExample1");


    const domain = 'easyflip.repositorium.cl';



    useEffect(() => {
      
      try {
        document.getElementById('jitsi').removeChild((document.getElementById("jitsiConferenceFrame0")));
      } catch (error) {
        console.log(error)
      }
        var script = document.createElement('script');
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = ()=>{ 
            const options ={
                roomName: roomName,
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
      }, [roomName]);
    

    function sendMessage(event){
      const participants = API.getParticipantsInfo();
      console.log(participants);
      createRoomsBySize(2, participants);
    } 

    function changeRoom(){
      setRoomName("newRoomName");
    }

    return (
    <div>
        <div id='jitsi' height='700' ></div>
        <Button onClick={sendMessage}>Send</Button>
        <Button onClick={changeRoom}>New Room</Button>
        <NewPollDialog />
        <AnswerPollDialog />
    </div>
    );
}

export default App;

