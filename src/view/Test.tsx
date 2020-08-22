import React from "react";

interface IProps {
    data: string;
}

export default function(props: IProps) {
    return (
        <div>
            {props.data}
        </div>
    );
}
