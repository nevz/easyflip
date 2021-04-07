import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';

function ButtonWithDialog({children, footer, buttonText, headerText, onClick=()=>{}}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleClick(){
        onClick();
        handleShow();
    }

    return (
        <>
            <Button variant="primary" onClick={(handleClick)}>
                {buttonText}
            </Button>

            <Modal style={{maxWidth:'100%'}} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ headerText }</Modal.Title>
                </Modal.Header>
                <Modal.Body >{ children }</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                    { footer }
                </Modal.Footer>
            </Modal>
        </>
    );
}


export { ButtonWithDialog };