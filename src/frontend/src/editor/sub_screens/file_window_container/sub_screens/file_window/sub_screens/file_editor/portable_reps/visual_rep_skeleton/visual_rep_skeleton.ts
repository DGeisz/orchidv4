import { OrchidFilePath } from "../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { v4 } from "uuid";
import { add_latex_color, create_tex_text } from "../../utils/latex_utils";
import { palette } from "../../../../../../../../../global_styles/palette";

export interface VisualRepSkeleton {
    file_id: string;
    file_name: string;
    file_path: OrchidFilePath;
    formatted_name: string;
    root_node_socket: VRSNodeSocket;
}

export interface VRSNodeSocket {
    id: string;
    node: VRSNode | null;
}

export interface VRSContainer {
    id: string;
    left_border: boolean;
    indented: boolean;
    children: VRSNodeSocket[];
}

export interface VRSContainerOption {
    Container: VRSContainer;
}

export function is_vrs_container(node: VRSNode): node is VRSContainerOption {
    return node.hasOwnProperty("Container");
}

export interface VRSLine {
    id: string;
    title: string | null;
    comment: string | null;
    main_tex: VRSTexSocket;
    right_tex: VRSTexSocket | null;
    label_tex: VRSTexSocket | null;
    border_bottom: boolean;
    border_top: boolean;
}

export interface VRSLineOption {
    Line: VRSLine;
}

export function is_vrs_line(node: VRSNode): node is VRSLineOption {
    return node.hasOwnProperty("Line");
}

export type VRSNode = VRSContainerOption | VRSLineOption;

export interface VRSTexSocket {
    id: string;
    element: VRSTexElement | null;
}

export interface VRSTexElement {
    tex_template: string[];
    tex_sockets: VRSTexSocket[];
}

export const exampleVRS: VRSNodeSocket = {
    id: v4(),
    node: {
        Container: {
            id: v4(),
            left_border: false,
            indented: false,
            children: [
                {
                    id: v4(),
                    node: {
                        Container: {
                            id: v4(),
                            left_border: true,
                            indented: false,
                            children: [
                                {
                                    id: v4(),
                                    node: {
                                        Line: {
                                            id: v4(),
                                            title: add_latex_color(
                                                create_tex_text("Theorem"),
                                                palette.deepBlue
                                            ),
                                            comment: null,
                                            main_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\alpha^\\omega",
                                                    ],
                                                    tex_sockets: [],
                                                },
                                            },
                                            right_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\alpha^\\omega",
                                                    ],
                                                    tex_sockets: [],
                                                },
                                            },
                                            label_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\text{(1.01)}",
                                                    ],
                                                    tex_sockets: [],
                                                },
                                            },
                                            border_bottom: true,
                                            border_top: false,
                                        },
                                    },
                                },
                                {
                                    id: v4(),
                                    node: {
                                        Line: {
                                            id: v4(),
                                            title: null,
                                            comment: null,
                                            main_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\frac{\\zeta_1}{\\Omega^\\eta}",
                                                    ],
                                                    tex_sockets: [],
                                                },
                                            },
                                            right_tex: null,
                                            label_tex: null,
                                            border_bottom: false,
                                            border_top: false,
                                        },
                                    },
                                },
                                {
                                    id: v4(),
                                    node: {
                                        Line: {
                                            id: v4(),
                                            title: null,
                                            comment: null,
                                            main_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\frac{",
                                                        "}{",
                                                        "}",
                                                    ],
                                                    tex_sockets: [
                                                        {
                                                            id: v4(),
                                                            element: {
                                                                tex_template: [
                                                                    "\\zeta_1",
                                                                ],
                                                                tex_sockets: [],
                                                            },
                                                        },
                                                        {
                                                            id: v4(),
                                                            element: {
                                                                tex_template: [
                                                                    "\\Omega^\\eta",
                                                                ],
                                                                tex_sockets: [],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            right_tex: null,
                                            label_tex: null,
                                            border_bottom: false,
                                            border_top: false,
                                        },
                                    },
                                },
                                {
                                    id: v4(),
                                    node: {
                                        Line: {
                                            id: v4(),
                                            title: null,
                                            comment: null,
                                            main_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\frac{\\zeta_1}{\\Omega^\\eta}",
                                                    ],
                                                    tex_sockets: [],
                                                },
                                            },
                                            right_tex: null,
                                            label_tex: null,
                                            border_bottom: false,
                                            border_top: false,
                                        },
                                    },
                                },
                                {
                                    id: v4(),
                                    node: {
                                        Line: {
                                            id: v4(),
                                            title: null,
                                            comment: null,
                                            main_tex: {
                                                id: v4(),
                                                element: {
                                                    tex_template: [
                                                        "\\frac{\\zeta_1}{\\Omega^\\eta}",
                                                    ],
                                                    tex_sockets: [],
                                                },
                                            },
                                            right_tex: null,
                                            label_tex: null,
                                            border_bottom: false,
                                            border_top: false,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
    },
};
