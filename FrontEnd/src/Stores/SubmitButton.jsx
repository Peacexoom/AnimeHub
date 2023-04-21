import React from "react";

const SubmitButton = (props) => {
  return (
    <div className="SubmitButton ">
      <button
        className="btn "
        disabled={props.disabled}
        onClick={() => props.onClick()}
      >
        {props.text}
      </button>
    </div>
  );
};

export default SubmitButton;
