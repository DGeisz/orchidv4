import React from "react";
import "../../oft_explorer_styles.scss";

interface Props {
    indents: number;
}

const IndentedNode: React.FC<Props> = (props) => {
    const range = [...Array(props.indents)];

    console.log(
        "indents: ",
        props.indents,
        range.map((_) => <div className="oft-node-indent" />)
    );
    return (
        <div className="oft-node-container">
            {range.map((_) => (
                <div className="oft-node-indent" key={Math.random()} />
            ))}
            {props.children}
        </div>
    );
};

export default IndentedNode;
