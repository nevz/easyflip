import React, { useEffect, useState} from 'react'

import './Poll.css';



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



export { Poll };