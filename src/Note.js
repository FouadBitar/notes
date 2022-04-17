import './NotePage.css';
import React from 'react';

function Note(props){


  function handleChange(e) {
      props.onChange(props.id, e.target.value);

      // resize the textarea to be size of text
      document.getElementById((props.id+'text-area')).style.height = "auto";
      document.getElementById((props.id+'text-area')).style.height = (document.getElementById((props.id+'text-area')).scrollHeight) + "px";
  }

  let onChangeFunc;
  if(props.archived) {
    onChangeFunc = () => {};
  } else {
    onChangeFunc = handleChange;
  }

  return(
    <div className="Note-Container">
      <form>
        <label>
          <textarea 
              id={props.id+"text-area"}
              value={props.text} 
              archived={props.archived ? "true" : "false"}
              onChange={onChangeFunc} 
              type="text" 
              className="Note-Input" 
          />
        </label>
      </form>
    </div>
  );
}


export default Note;