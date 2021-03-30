import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useHistory } from 'react-router-dom';


function JoinRoom(props) {


    const history = useHistory();

    const [roomName, setRoomName] = useState("EasyFlipDefaultRoom");

    function JoinRoom() {
        history.push('/' + roomName);

    }

    return (
        <div style={{
            width:"100%",
            height:"100%",
            display: "flex",
            flexDirection:"column",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <h1>Easy Flip</h1>
            <form style={{display:"flex", flexDirection:"column"}}onSubmit={() => JoinRoom()}>
                <input style={{textAlign:"center"}} type='text' value={roomName} onChange={(e) => setRoomName(e.target.value)} ></input>
                <Button type='submit'>Join Room</Button>
            </form>


        </div>)
}

export { JoinRoom };