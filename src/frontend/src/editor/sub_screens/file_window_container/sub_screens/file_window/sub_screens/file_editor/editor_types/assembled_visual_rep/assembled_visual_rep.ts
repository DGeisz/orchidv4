export enum AVRType {
    Line,
    Container,
}

export interface AVRLine {
    tag: AVRType.Line;
    title?: string;
    comment?: string;
    main_tex: string;
    right_tex?: string;
    line_number?: string;
    underlined?: boolean;
    overlined?: boolean;
}

export interface AVRContainer {
    tag: AVRType.Container;
    id: string; // This is the just for render keys in react
    left_border?: boolean;
    indented?: boolean;
    children: Array<AVRNode>;
}

export type AVRNode = AVRLine | AVRContainer;

export const exampleNode: AVRNode = {
    tag: AVRType.Container,
    id: "asdf",
    left_border: true,
    children: [
        {
            tag: AVRType.Line,
            main_tex: "\\Omega_{\\frac{1}{2}} = \\frac{2}{4}",
            right_tex: "\\frac{1}{2} = \\frac{2}{4}",
            title: "\\text{\\color{blue}{Theorem}}",
            comment: "\\text{This is precisely what it looks like.}",
            line_number: "\\text{(1.1)}",
            underlined: true,
        },
        {
            tag: AVRType.Container,
            id: "green",
            indented: true,
            children: [
                {
                    tag: AVRType.Line,
                    main_tex: "\\Omega_{\\frac{1}{2}} = \\frac{2}{4}",
                    right_tex: "\\frac{1}{2} = \\frac{2}{4}",
                    line_number: "\\text{(1.1)}",
                },
                {
                    tag: AVRType.Line,
                    main_tex: "\\frac{1}{2}",
                    right_tex: "\\frac{1}{2} = \\frac{2}{4}",
                    line_number: "\\text{(1.2)}",
                },
                {
                    tag: AVRType.Line,
                    main_tex: "\\frac{1}{2}",
                    right_tex: "\\frac{1}{2} = \\frac{2}{4}",
                    line_number: "\\text{(1.3)}",
                },
            ],
        },
        {
            tag: AVRType.Line,
            main_tex: "\\frac{1}{2}",
            right_tex: "\\frac{1}{2} = \\frac{2}{4}",
            overlined: true,
            line_number: "\\text{(1.2)}",
        },
        {
            tag: AVRType.Line,
            main_tex: "\\frac{1}{2}",
            right_tex: "\\frac{1}{2} = \\frac{2}{4}",
            line_number: "\\text{(1.3)}",
        },
    ],
};
