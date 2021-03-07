import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import {Dialog} from './Dialog';


function NewPoll(props) {
    const [postData, setPostData] = useState(null);
    const [question, setQuestion] = useState("");
    const [alternatives, setAlternatives] = useState(["Alternative A", "Alternative B", "Alternative C"])

    const listAlternatives = alternatives.map((alternative, index) => 
        <li key={"alternative" + index}>
            <input name={alternative + index} type="text" value={alternative} onChange={(e) => alternativeChange(e, index)}/>
            <button type="button" onClick={(e) => deleteAlternative(e, index)}> X </button>
        </li>    
    )

    function deleteAlternative(event, index){
        var newAlternatives = [...alternatives];
        newAlternatives.splice(index, 1);
        setAlternatives([...newAlternatives])
    }

    function alternativeChange(event, index){
        const updatedValue = event.target.value;
        var newAlternatives = [...alternatives];
        newAlternatives[index] = updatedValue;
        setAlternatives([...newAlternatives]);
    }

    function questionChange(event){
        setQuestion(event.target.value)
    }

    function addAlternative(event){
        const newAlternatives = alternatives.concat(["New alternative"]);
        setAlternatives([...newAlternatives]);
    }
    
    function makePostRequest(event){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                question: question,
                alternatives: alternatives
            })
        };
        fetch(process.env.REACT_APP_APIURL, requestOptions)
            .then(response => response.json())
            .then(data => {
                setPostData(data)
                props.getPollId(data._id);
            });
    }

    function onSubmit(event){
        event.preventDefault();
        makePostRequest(event);
    }

    function getPostedQuestion(){
        if(postData){
            return(
            <div>
                <p>You just posted:</p>
                <p>{postData.question}</p>
                <ol>{ (postData.alternatives || []).map((alternative, index)=>
                    <li key={alternative+index}>{alternative}</li>)}
                </ol>
                
            </div>
            )
        }
        return(<div></div>)
    }

    /*
    esto era para linkear a los resultados y la pagina de votos
        <Link to={postData._id + "/vote"}>Vote here</Link><br/> 
        <Link to={postData._id + "/results"}>See results here</Link>
    */

    function dialogFooter(){
    return(<Button onClick={onSubmit}> Submit </Button>)
    }

    return( 
        <Dialog headerText='Create a new Poll' buttonText='Make Poll' footer={dialogFooter()}>
            <div>
            {getPostedQuestion()}
            
                <label>
                    Question:
                    <input value={question} type="text" name="name" onChange={questionChange}/>
                </label>
                <ol>{listAlternatives}</ol>
                <Button onClick={addAlternative}>Add Alternative</Button>

                
        </div>
        </Dialog>
    );

}

export { NewPoll };