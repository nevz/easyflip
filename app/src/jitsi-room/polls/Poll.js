import React, { useEffect, useState} from 'react'

import './Poll.css';
import { formatAlternative } from './util'
import Button from 'react-bootstrap/Button';



function Poll({pollId="", showUserAnswer=()=>{return "";}, alternativeList=[]}){

    const [poll, setPoll] = useState(undefined);

    useEffect(() => {
        console.log('fetching poll with id: ', pollId);
        fetch(process.env.REACT_APP_APIURL + pollId)
        .then(response => response.json())
        .then(data => {
            setPoll(data);
        });
    }, [pollId]);



    if(poll){
        console.log('the poll is ', poll)
        return(
            <div>
                <p>Question: {poll.question}</p>
                <p>Alternatives:</p>
                {alternativeList(poll.alternatives)}
                {showUserAnswer(poll.alternatives) || ""}
            </div>
        )
    }
    else{
        return(<p> There is no poll here </p>)
    }
    
} 


function DisplayPoll(props){

    function listAlternatives(alternatives){
        const alternativeList =  (alternatives || []).map((alternative, index) => 
        <li key={"alternativedisplay" + index}>
            {alternative}
        </li>    
        );
        return alternativeList;
    }
    return(
        <ol>        
            <Poll {...props} alternativeList={listAlternatives}></Poll>
        </ol>

    );
}

function VotePoll(props){
    const [vote, setVote] = useState(false);
 

    function onSubmit(event){
        event.preventDefault();
        const vote = event.target.alternativevote.value;


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user: localStorage.getItem('userToken'),
                vote: vote
            })
        };
        fetch(process.env.REACT_APP_APIURL + props.pollId + "/vote", requestOptions)
            .then(response => response.json());
        
        setVote(vote);
        props.onSubmit();
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
        <Poll {...props} alternativeList={listAlternatives} showUserAnswer={showUserAnswer}></Poll>
        )
}

function ResultsPoll(props){

    const [answers, setAnswers] = useState([])


    function getResults(pollId){
        fetch(process.env.REACT_APP_APIURL + pollId + `/result`)
        .then(response => response.json())
        .then(data => setAnswers(data));
    }

    useEffect(() => {
        getResults(props.pollId);
    }, [props.pollId]);

    function listAlternativesResults(){
        var zipped = (props.poll.alternatives || []).map((alt, i) => [alt, answers[i]]);
        const alternativeList = zipped.map(([alt,num], index) =>  
        <li key={"alternativevote" + index}>
          {alt}: {num}
        </li> );

        return (<ol>
            {alternativeList}
        </ol>  
            );
            
    }     

    function resetResults(event){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user: localStorage.getItem('userToken'),
            })
        };

        fetch(process.env.REACT_APP_APIURL + props.poll._id + "/reset", requestOptions)
        .then(response => response.json())
        .then(data => setAnswers(data));
    }


    return(
        <div>
            <Poll {...props} listAlternatives={listAlternativesResults}></Poll>

            <button type="button" onClick={() => resetResults()}>Reset</button>
            <button type="button" onClick={() => getResults(props.poll._id)}>Update</button>

        </div>
        )
}

export { Poll };