
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { ButtonWithDialog } from '../general/ButtonWithDialog';
import { socket } from '../socket';
import { useHistory } from 'react-router-dom';

function BreakoutRoomsDisplay({ room = undefined }) {

    const [breakoutRooms, setBreakoutRooms] = useState([]);
    const history = useHistory();

    useEffect(() => {
        function getBreakoutRooms(rooms) {
            console.log("getting breakout rooms", rooms);
            setBreakoutRooms(rooms);
        }
        socket.on("currentBreakoutRooms", getBreakoutRooms);

        return () => {
            socket.off("currentBreakoutRooms", getBreakoutRooms);
        }
    }, room)

    function renderContents() {
        if(breakoutRooms.size > 0){
            const rows = breakoutRooms.map((aRoom, index) => {
                if (aRoom) {
                    console.log(aRoom.connectedUsers);
                    return (
                        <tr>
                            <td>{aRoom.roomName}</td>
                            <td>{aRoom.connectedUsers.length}</td>
                            <td><Button onClick={() => history.push(aRoom.roomName)}>Join</Button></td>
                        </tr>
                    )
                }
            }
            )
            return (
                <table>
                    <thead><tr>
                        <th>Room Name</th>
                        <th>Participants</th>
                        <th>Join room</th>
                        </tr></thead>
                    <tbody>{rows}</tbody>
                </table>);
        }
        else{
            return;
        }
        
    }




    return (
        <ButtonWithDialog
            headerText='Breakout Rooms'
            buttonText='View Breakout Rooms'
            onClick={() => socket.emit("getBreakoutRooms", room.roomName)}
        >
            {renderContents()}
        </ButtonWithDialog>
    );

}

export { BreakoutRoomsDisplay };