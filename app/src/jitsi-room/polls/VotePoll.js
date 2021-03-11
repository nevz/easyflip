
import './Poll.css';
import { Poll } from './Poll';
import { ButtonWithDialog } from '../general/ButtonWithDialog';
import React, { useEffect, useState} from 'react'
import { formatAlternative } from './util'
import Button from 'react-bootstrap/Button';


function VotePoll(props){
    const [vote, setVote] = useState(false);
    
    useEffect(()=>{
        setVote(undefined)
    },[props.pollId]);

    function onSubmit(event){
        event.preventDefault();
        const vote = event.target.alternativevote.value;


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user: localStorage.getItem('userID'),
                vote: vote
            })
        };
        fetch(process.env.REACT_APP_APIURL + props.pollId + "/vote", requestOptions)
            .then(response => response.json());
        
        setVote(vote);
    }

    function showUserAnswer(alternatives){
        if(vote){
            return(<div>You voted: <br/>{formatAlternative(alternatives[vote], vote)}</div>)
        }
        else{
            return(<div>You haven't voted yet</div>)
        }
    }

    function listAlternatives(alternatives){
        const alternativeList = (alternatives || []).map((alternative, index) => 
        <li key={"alternativevote" + index}>
            <input type="radio" name="alternativevote" value={index} /> <label>{alternative}</label>
        </li>    
        );

        return(
        <div>
            <form onSubmit={onSubmit}>
                <ol>
                    {alternativeList}
                </ol>
            <Button type="submit" variant="primary">Submit</Button>
            </form>
        </div>
    )
    }

    return(
        <ButtonWithDialog headerText={'vote'} buttonText={'Vote'}>
           <Poll {...props} alternativeList={listAlternatives} showUserAnswer={showUserAnswer}></Poll>
        </ButtonWithDialog>
    )
}

export { VotePoll }