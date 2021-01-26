
import { JitsiRoom } from './JitsiRoom';
import { JoinRoom } from './JoinRoom';

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {

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

