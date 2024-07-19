import { Toast, ToastContainer } from "react-bootstrap";

const BSToast = ({ show, onClose, message, time, bgColor, icon }) => {
  return (
    <ToastContainer position="bottom-start" className="p-3 text-center">
      <Toast show={show} onClose={onClose} bg={bgColor} delay={5000} autohide>
        <Toast.Body className="text-white" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0.5rem'}}>
          <i style={{ marginTop: '5px' }} className={`h5 ${icon}`}></i> {message}
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default BSToast;
