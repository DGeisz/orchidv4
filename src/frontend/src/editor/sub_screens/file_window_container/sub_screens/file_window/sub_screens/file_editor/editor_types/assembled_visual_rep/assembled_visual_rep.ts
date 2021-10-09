import { TexWidgetProperties } from "../../building_blocks/rct_node/building_blocks/tex_element/building_blocks/tex_widget/tex_widget_types/tex_widget_types";

export enum AVRType {
    Line,
    Container,
}

export interface AVRLine {
    tag: AVRType.Line;
    title: string | null;
    comment: string | null;
    main_tex: string;
    main_widgets: TexWidgetProperties[];
    right_tex: string | null;
    right_widgets: TexWidgetProperties[];
    label_tex: string | null;
    label_widgets: TexWidgetProperties[];
    border_bottom: boolean | null;
    border_top: boolean | null;
    left_cursor?: boolean;
    right_cursor?: boolean;
}

export interface AVRContainer {
    tag: AVRType.Container;
    id: string; // This is the just for render keys in react
    left_border: boolean;
    indented: boolean;
    children: Array<AVRNode>;
    left_cursor?: boolean;
    right_cursor?: boolean;
}

export type AVRNode = AVRLine | AVRContainer;

// export const exampleNode: AVRNode = {
//     tag: AVRType.Container,
//     id: "asdf",
//     left_border: true,
//     indented: false,
//     children: [
//         {
//             tag: AVRType.Line,
//             main_tex: "\\Omega_{\\frac{1}{2}} = \\frac{2}{4}",
//             right_tex: "\\frac{1}{2} = \\frac{2}{4}",
//             title: "\\text{\\color{blue}{Theorem}}",
//             comment: "\\text{This is precisely what it looks like.}",
//             label_tex: "\\text{(1.1)}",
//             border_bottom: true,
//             border_top: false,
//         },
//         {
//             tag: AVRType.Container,
//             id: "green",
//             left_border: false,
//             indented: true,
//             children: [
//                 {
//                     tag: AVRType.Line,
//                     main_tex: "\\Omega_{\\frac{1}{2}} = \\frac{2}{4}",
//                     right_tex: "\\frac{1}{2} = \\frac{2}{4}",
//                     label_tex: "\\text{(1.1)}",
//                     title: null,
//                     comment: null,
//                     border_bottom: false,
//                     border_top: false,
//                 },
//                 {
//                     tag: AVRType.Line,
//                     main_tex: "\\frac{1}{2}",
//                     right_tex: "\\frac{1}{2} = \\frac{2}{4}",
//                     label_tex: "\\text{(1.2)}",
//                     title: null,
//                     comment: null,
//                     border_bottom: false,
//                     border_top: false,
//                 },
//                 {
//                     tag: AVRType.Line,
//                     main_tex: "\\frac{1}{2}",
//                     right_tex: "\\frac{1}{2} = \\frac{2}{4}",
//                     label_tex: "\\text{(1.3)}",
//                     title: null,
//                     comment: null,
//                     border_bottom: false,
//                     border_top: false,
//                 },
//             ],
//         },
//         {
//             tag: AVRType.Line,
//             main_tex: "\\frac{1}{2}",
//             right_tex: "\\frac{1}{2} = \\frac{2}{4}",
//             border_top: true,
//             label_tex: "\\text{(1.2)}",
//             title: null,
//             comment: null,
//             border_bottom: false,
//         },
//         {
//             tag: AVRType.Line,
//             main_tex: "\\frac{1}{2}",
//             right_tex: "\\frac{1}{2} = \\frac{2}{4}",
//             label_tex: "\\text{(1.3)}",
//             title: null,
//             comment: null,
//             border_bottom: false,
//             border_top: false,
//         },
//     ],
// };
