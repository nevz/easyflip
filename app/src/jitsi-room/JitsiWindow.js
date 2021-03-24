
import React, { useEffect, useState } from 'react';
import { socket } from './socket';

function JitsiWindow(props) {
  const [API, setAPI] = useState(undefined);
  const [localJitsiUserID, setLocalJitsiUserID] = useState("");


  useEffect(() => {
    removeConference();
    console.log("joining jitsi conference");
    var script = document.createElement('script');
    script.src = "https://meet.jit.si/external_api.js"; //this must be changed to the self hosted one eventually, but must fix it on the server first
    const domain = process.env.REACT_APP_JITSI_URL;
    script.async = true;
    script.onload = () => {
      const options = {
        roomName: props.roomName,
        width: '100%',
        height: '100%',
        parentNode: document.getElementById('jitsi')
      };
      const newapi = new window.JitsiMeetExternalAPI(domain, options);
      setAPI(newapi);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [props.roomName])

  /*
  useEffect(() => {
    if (API) {
      console.log("HELLOOOO")

      API.addListener('videoConferenceJoined', (event) => {
        setLocalJitsiUserID(event.id.toString());
        socket.emit("jitsiUser", event.displayName);
      });
    }
  }, [API]);

  useEffect(() => {
    if(localJitsiUserID!==""){
      API.addListener('displayNameChange', (event) => {
        console.log("user changing name");
        if (event.id === localJitsiUserID) {
          socket.emit("jitsiUser", event.displayname);
        }
      })
    }
  },[localJitsiUserID, API]);
*/

  function removeConference() {
    try {
      document.getElementById('jitsi').removeChild((document.getElementById("jitsiConferenceFrame0")));
    } catch (error) {
      console.log('tried to remove conference window but there was none');
      console.log(error);
    }
  }

  return (
    <div style={{ height: '75%' }} id='jitsi'></div>
  )
}

export { JitsiWindow }