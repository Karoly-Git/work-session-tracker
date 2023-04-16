import React from "react";

export default function Button(props) {
    return (
        <div
            action="#"
            className={`btn ${props.btnClass}`}
            onClick={props.handleClick}
        >
            {props.text}
        </div>
    );
}
