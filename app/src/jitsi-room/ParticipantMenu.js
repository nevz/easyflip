
import Button from 'react-bootstrap/Button';
import React from 'react';

import { socket } from './socket';
import { VotePoll } from './polls/VotePoll';


function ParticipantMenu(props) {

  return(
    <div>
      <VotePoll pollId={props.pollId} />
    </div>
  );
}

export { ParticipantMenu };