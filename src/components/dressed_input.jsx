import React from "react";

export default function DressedInput(props) {
    return (
        <div className={`dressed ${props.status === "finished" ? "" : "hidden"}`}>
            <h3>{props.material}</h3>
            <input onChange={props.updateDressed} type="number" min="0" max="100" />
        </div>
    );
}
