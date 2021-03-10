
import { Room } from './jitsi-room/Room';
import { JoinRoom } from './JoinRoom';

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
          <Room />
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

