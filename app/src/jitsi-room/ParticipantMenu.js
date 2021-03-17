
import Button from 'react-bootstrap/Button';
import React from 'react';

import { VotePoll } from './polls/VotePoll';
import { ResultsPoll } from './polls/ResultsPoll';


function ParticipantMenu({room=null, returnToMain, pollId, showResults}) {



  function showReturnToMainButton(){
    if(room.parent){
      return  <Button onClick={returnToMain}>Return to main room</Button>
    }
    else{
      return (<></>)
    }
  }

  function showResultsPoll(){
    if (showResults){
      return <ResultsPoll pollId={pollId}></ResultsPoll>
    }
  }

  return(
    <div>
      <VotePoll pollId={pollId} />
      {showReturnToMainButton()}
      {showResultsPoll()}
    </div>
  );
}

export { ParticipantMenu };