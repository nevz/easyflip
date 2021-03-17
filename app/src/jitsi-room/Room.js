import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { socket, connectSocket } from './socket';
import { OwnerMenu } from './OwnerMenu';
import { ParticipantMenu } from './ParticipantMenu';
import { JitsiWindow } from './JitsiWindow';
import { Notification } from './general/Notification';


function Room(props) {
  const history = useHistory();

  const { roomName } = useParams();
  const [room, setRoom] = useState(null);
  const [pollId, setPollId] = useState("5ff71dc25938cf2873d7b751");

  const [showBreakoutNotification, setShowBreakoutNotification] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
    socket.on('returnToMainRoom', notifyReturnToMainRoom);
    socket.on('forceToMainRoom', forceReturnToMainRoom);

    socket.on('showResults', notifyShowResults);
    socket.emit('joinRoom', room.roomName);
    console.log('the room is ', room)
    return (() => {
      socket.emit('leaveRoom', room.roomName);
    });
  }, [room]);

  function leaveRoom() {
    socket.emit('leaveRoom', room.roomName);
  }

  function goToBreakout({ breakoutRoomName, originalRoomName }) {
    console.log('going to breakout from ', room.roomName, ' to ', breakoutRoomName);
    if (room.roomName === originalRoomName) {
      history.push(breakoutRoomName);
    }
  }

  function returnToMainRoom() {
    leaveRoom();
    history.push(room.parent);
  }


  function notifyReturnToMainRoom(mainRoomName) {
    if (mainRoomName === room.parent) {
      setShowBreakoutNotification(true);
    }
  }

  function forceReturnToMainRoom(mainRoomName){
    if(mainRoomName === room.parent){
      returnToMainRoom();
    }
  }

  function notifyShowResults(fromRoomName){
    if(fromRoomName === room.roomName){
      setShowResults(true);
    }
  }


  //is called when socket receives the roomData event. Sets the room to a new one
  function getRoomData(newRoom) {
    console.log('getting data from room', newRoom);
    setRoom(prevRoom => (newRoom));
    setPollId(newRoom.pollId);
  }

  //called when the question of the room is changed
  function pollChanged(fromRoomName, newPollId) {
    if (room.roomName === fromRoomName) {
      setShowResults(false);
      setPollId(newPollId);
    }
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
            <OwnerMenu room={room} pollId={pollId} />
          </>);
      else {
        return <ParticipantMenu room={room} returnToMain={returnToMainRoom} pollId={pollId} showResults={showResults} />;
      }
    }
  }

  if(room){
    return (<>
      {renderJitsiWindow()}
      {roomMenu()}
      {<Notification onAccept={returnToMainRoom} setShow={setShowBreakoutNotification} show={showBreakoutNotification}>
        <h4>You have been requested to go back to the main room by the admin</h4>
        <p> press accept to go back now, or use the button
          on the botton of your screen later </p>
      </Notification>}
    </>)
  }
  else{
    return(<p>Error, no room has been found</p>);
  }
  

}

export { Room }