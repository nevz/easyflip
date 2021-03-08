import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useHistory } from 'react-router-dom';


function JoinRoom(props) {


    const history = useHistory();

    const [roomName, setRoomName] = useState("EnterRoomName");

    function JoinRoom(){
        history.push('/' + roomName);

    }

    return(<div>
        <form onSubmit={() => JoinRoom()}> 
        <input type='text' value={roomName} onChange={(e)=> setRoomName(e.target.value)} ></input>
        <Button type='submit'>Join</Button>

        </form>


    </div>)
}

export {JoinRoom};