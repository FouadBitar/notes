import "../CSS/NotePage.css";
import React, { useEffect } from "react";

function Note(props) {
  function handleChange(e) {
    props.onChange(props.id, e.target.value);
  }

  useEffect(() => {
    document.getElementById(props.id + "-note").style.height = "auto";
    document.getElementById(props.id + "-note").style.height =
      document.getElementById(props.id + "-note").scrollHeight + "px";
  });

  let onChangeFunc = handleChange;

  return (
    <textarea
      id={props.id + "-note"}
      value={props.text}
      onChange={onChangeFunc}
      type="text"
      className="w-100"
      style={{ height: "100%", overflow: "auto" }}
    />
  );
}

export default Note;
