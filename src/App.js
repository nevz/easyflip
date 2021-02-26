
import { JitsiRoom } from './jitsi-room/JitsiRoom';
import { JoinRoom } from './JoinRoom';

import React, {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if(!userToken){
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userToken', newToken);
    }
  }, [])

  return (
    <div className="App">
      <Router>
      <Switch>
        <Route path={`/:roomName`}>
          <JitsiRoom />
        </Route>
        <Route path="/">
          <JoinRoom />
        </Route>
        
      </Switch>
      </Router>
            

    </div>
  );
}

export default App;

