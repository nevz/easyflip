import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { socket, connectSocket } from './socket';
import { OwnerMenu } from './OwnerMenu';
import { ParticipantMenu } from './ParticipantMenu';
import { VotePoll } from './polls/VotePoll';
import { JitsiWindow } from './JitsiWindow';


function Room(props) {
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
    if (!room) {
      console.log('the room doesnt exist', room)
      return;
    }

    socket.on('notifyBreakout', goToBreakout);
    socket.on('pollChanged', pollChanged);
    socket.on('returnToMainRoom', returnToMainRoom);
    socket.emit('joinRoom', room.roomName);
    console.log('the room is ', room)
    return (() => {
      socket.emit('leaveRoom', room.roomName);
    });
  }, [room]);

  function joinRoom(newRoomName) {
    history.push('/' + newRoomName);
  }

  function leaveRoom() {
    socket.emit('leaveRoom', room.roomName);
  }

  function goToBreakout({ breakoutRoomName, originalRoomName }) {
    console.log('going to breakout from ', room.roomName, ' to ', breakoutRoomName);
    if (room.roomName === originalRoomName) {
      joinRoom(breakoutRoomName);
    }
  }

  function returnToMainRoom(mainRoomName) {
    console.log('returning', mainRoomName, room.parent);
    if (mainRoomName === room.parent) {
      leaveRoom();
      joinRoom(mainRoomName);
    }
  }


  //is called when socket receives the roomData event. Sets the room to a new one
  function getRoomData(newRoom) {
    console.log('getting data from room', newRoom);
    setRoom(prevRoom => (newRoom));
  }

  //called when the question of the room is changed
  function pollChanged(fromRoomName, newPollId) {
    if (room.roomName === fromRoomName) {
      setPollId(newPollId);
    }
  }

  function answerChanged() {
    return;
  }

  function renderJitsiWindow() {
    if (room) {
      return <JitsiWindow roomName={room.roomName} />
    }
    else {
      return <p>There is no room to join here</p>
    }
  }


  function roomMenu() {
    if (room) {

      if (room.owner === localStorage.getItem("userID"))
        return (
          <>
            <OwnerMenu room={room} />
          </>);
      else {
        return <ParticipantMenu pollId={pollId}/>;
      }
    }
    else {
    }
  }

  return (<>
    {renderJitsiWindow()}
    {roomMenu()}
  </>)


}

export { Room }