import '../CSS/Modal.css';
import React from 'react';


function Modal(props) {
    if(!props.show) {
        return null;
    }
    return(
        <div className='modal'>
            <div className='modal-content'>
                <input id='modal-input' className='form-control' placeholder='enter folder name...'></input>
                <button className='btn btn-primary' onClick={(e) => props.onClose('modal-input')}>submit</button>
            </div>
        </div>
    );
}

export default Modal;