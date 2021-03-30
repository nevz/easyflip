import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { Poll } from './Poll';
import { ButtonWithDialog } from '../general/ButtonWithDialog';


function ResultsPoll({ pollId = "", owner = false }) {

    const [answers, setAnswers] = useState([])


    function getResults(aPollId) {
        if (aPollId !== "") {
            fetch(process.env.REACT_APP_APIURL + aPollId + `/result`)
                .then(response => response.json())
                .then(data => setAnswers(data));
        }
    }

    function listAlternativesResults(alternatives) {
        var zipped = (alternatives || []).map((alt, i) => [alt, answers[i]]);
        const alternativeList = zipped.map(([alt, num], index) =>
            <li key={"alternativevote" + index}>
                {alt}: {num}
            </li>);

        return (<ol>
            {alternativeList}
        </ol>
        );

    }

    function resetResults(event) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: localStorage.getItem('userToken'),
            })
        };

        fetch(process.env.REACT_APP_APIURL + pollId + "/reset", requestOptions)
            .then(response => response.json())
            .then(data => setAnswers(data));
    }

    function renderPollWithResults() {
        if (pollId !== "") {
            return (
                <>
                    <Poll pollId={pollId} alternativeList={listAlternativesResults}></Poll>
                    <Button onClick={() => getResults(pollId)}>Update</Button>
                </>
            )
        }
        else {
            return <p>there is no poll here</p>
        }
    }

    return (
        <ButtonWithDialog onClick={() => { getResults(pollId) }} buttonText='Poll Results' headerText='Poll Results' >
            {renderPollWithResults()}
        </ButtonWithDialog>
    )
}

export { ResultsPoll };