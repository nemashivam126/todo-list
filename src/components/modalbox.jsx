import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ showModal, title, bodyText, handleClose, handleAction1, buttonOneName, buttonTwoName, btnOneVariant, btnTwoVariant }) => {
    return (
        <Modal centered show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{bodyText}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={btnOneVariant} onClick={handleClose}>
                    {buttonOneName}
                </Button>
                <Button variant={btnTwoVariant} onClick={handleAction1}>
                    {buttonTwoName}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;
