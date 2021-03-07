
import { io } from "socket.io-client";

 
const socket = io('localhost:9000', {
    withCredentials: true, autoConnect: false
});

socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;
    console.log('oli2')
});


function connectSocket(){


    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      console.log('oli')
    }

    console.log('socket ' + sessionID + ' connected');
    socket.connect();
}


export {socket, connectSocket};