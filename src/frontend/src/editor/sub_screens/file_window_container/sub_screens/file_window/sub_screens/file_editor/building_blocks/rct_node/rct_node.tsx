import React from "react";
import {
    AVRNode,
    AVRType,
} from "../../editor_types/assembled_visual_rep/assembled_visual_rep";
import "./rct_node_styles.scss";
import TexElement from "./building_blocks/tex_element/tex_element";

/* Yes, RCT does stand for "react component tree",
 * which is basically a given, but I use that language
 * because it's the name of the dynamic subject
 * at this juncture of the pipeline */

interface Props {
    avr_node: AVRNode;
}

const RctNode: React.FC<Props> = (props) => {
    /* First handle the simple case where
     * this is a container */
    const { avr_node: node } = props;

    if (node.tag === AVRType.Container) {
        return (
            <div
                className={`rct-container-container ${
                    !!node.indented ? "rct-container-indented" : ""
                } ${!!node.left_border ? "rct-container-left-border" : ""}`}
            >
                {node.children.map((child_node, index) => (
                    <RctNode
                        key={`${node.id}:${index}`}
                        avr_node={child_node}
                    />
                ))}
            </div>
        );
    }

    /* Now handle the more involved case where this is
     * a line*/
    if (node.tag === AVRType.Line) {
        return (
            <div
                className={`rct-line-container ${
                    node.underlined ? "rct-line-underlined" : ""
                }
                ${node.overlined ? "rct-line-overlined" : ""}`}
            >
                {!!node.title && (
                    <div className="rct-title-container">
                        <TexElement
                            tex={node.title}
                            tex_widget_properties={[]}
                        />
                    </div>
                )}
                {!!node.comment && (
                    <div className="rct-comment-container">
                        <TexElement
                            tex={node.comment}
                            tex_widget_properties={[]}
                        />
                    </div>
                )}
                <div className="rct-line-line">
                    <div className="rct-ll-left">
                        <div className="rct-lll-left">
                            <TexElement
                                tex={node.main_tex}
                                tex_widget_properties={[]}
                            />
                        </div>
                        {!!node.right_tex && (
                            <div className="rct-lll-right">
                                <TexElement
                                    tex={node.right_tex}
                                    tex_widget_properties={[]}
                                />
                            </div>
                        )}
                    </div>
                    {!!node.label_tex && (
                        <div className="rct-ll-right">
                            <TexElement
                                tex={node.label_tex}
                                tex_widget_properties={[]}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* Otherwise (there shouldn't be an otherwise) we just return null*/
    return null;
};

export default RctNode;
