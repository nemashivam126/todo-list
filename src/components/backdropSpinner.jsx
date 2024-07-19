import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BackdropSpinner = ({ show, onHide }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
            centered
            aria-labelledby="spinner-modal-title"
            className="d-flex justify-content-center align-items-center"
        >
            <Modal.Body className="d-flex justify-content-center align-items-center">
                <Spinner
                    animation="border"
                    role="status"
                    style={{ width: '3rem', height: '3rem' }}
                >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal.Body>
        </Modal>
    );
};

export default BackdropSpinner;
