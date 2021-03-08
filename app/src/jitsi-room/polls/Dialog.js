import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { VotePoll } from './Poll';


function Dialog(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function onSubmit(){
        props.onSubmit();
        handleClose();
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {props.buttonText}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ props.headerText }</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ props.children }</Modal.Body>
                <Modal.Footer>
                    { props.footer }
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function TestDialog(props){

    return( 
    <Dialog buttonText='ola' body={<h1>oliiiiii</h1>} footer={<Button variant='secondary'>Close</Button>} />)

}

export { Dialog, TestDialog };