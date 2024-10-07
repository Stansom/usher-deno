import * as routing from "../routing";
import React from "react";
export function Main() {
    const onClickHandler = () => {
        routing.pushState("/houses/")
    }
    return (<div>
        <h1>MAIN ROUTE</h1>
        <button onClick={onClickHandler}>
            Chech Houses
        </button>
        <button onClick={() => routing.pushState("/user/123")}>
            Greet user
        </button>
    </div>);
}