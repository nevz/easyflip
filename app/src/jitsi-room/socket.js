
import { io } from "socket.io-client";

 
const socket = io(process.env.REACT_APP_SOCKETIO_URL, {
    withCredentials: true, autoConnect: false
});

socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    localStorage.setItem("userID", userID);
    // save the ID of the user
    socket.userID = userID;
});


// connects the socket and performs some authentication
function connectSocket(){
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
    }

    console.log('connecting to socket on server ', process.env.REACT_APP_SOCKETIO_URL);
    console.log('socket ' + socket.id + ' connected');
    socket.connect();
}


export {socket, connectSocket};