
import React, { useEffect, useState } from 'react';


function JitsiWindow(props) {
  const [API, setAPI] = useState({});
  const domain = process.env.REACT_APP_JITSI_URL;


  useEffect(() => {
    removeConference();
    joinJitsiRoom(props.roomName);
  }, [props.roomName])

  function removeConference() {
    try {
      document.getElementById('jitsi').removeChild((document.getElementById("jitsiConferenceFrame0")));
    } catch (error) {
      console.log('tried to remove conference window but there was none');
      console.log(error);
    }
  }

  function joinJitsiRoom(newRoomName) {
    var script = document.createElement('script');
    script.src = "https://meet.jit.si/external_api.js"; //this must be changed to the self hosted one eventually, but must fix it on the server first

    script.async = true;
    script.onload = () => {
      const options = {
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


  return (
    <div id='jitsi' height='700' ></div>
  )

}

export { JitsiWindow }