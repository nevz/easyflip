import React from "react";

import {Button, Modal} from "react-bootstrap";

function Notification(props) {


    function handleClose(){
        props.setShow(false);
    }

    function handleAccept(){
        props.onAccept();
        handleClose();
    }

    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>Close</Button>
                <Button variant='primary' onClick={handleAccept}>Accept</Button>

            </Modal.Footer>
        </Modal>
    );
}

export { Notification };