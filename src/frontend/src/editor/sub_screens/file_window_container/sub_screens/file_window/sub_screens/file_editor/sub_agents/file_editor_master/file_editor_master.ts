import {
    file_path_eq,
    OrchidFilePath,
} from "../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import {
    exampleVRS,
    VisualRepSkeleton,
} from "../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { VRTNodeSocket } from "./dyn_subjects/visual_rep_tree/vrt_node_socket/vrt_node_socket";
import { AVRNode } from "../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { KeyboardHandler } from "../../../../../../../../../global_types/keyboard_events";
import {
    CursorSide,
    VRTCursorPosition,
    VRTCursorPositionRef,
} from "./dyn_subjects/visual_rep_tree/vrt_cursor";
import { CURSOR_NAME } from "../../utils/latex_utils";

const EMPTY_CURSOR: VRTCursorPosition = {
    id: "",
    side: CursorSide.Left,
    position: 0,
};

export class FileEditorMaster {
    private readonly file_id: string;
    private readonly file_name: string;
    private readonly file_path: OrchidFilePath;
    private readonly formatted_name: string;
    private root_node_socket: VRTNodeSocket;

    private cursor_line?: string;
    private cursor_position: VRTCursorPositionRef | null = null;

    private cursor_interval?: NodeJS.Timer;

    private set_avr: (avr: AVRNode) => void;

    constructor(vrs: VisualRepSkeleton) {
        const {
            file_id,
            file_path,
            file_name,
            formatted_name,
            root_node_socket,
        } = vrs;

        this.file_id = file_id;
        this.file_name = file_name;
        this.formatted_name = formatted_name;
        this.file_path = file_path;
        this.root_node_socket = new VRTNodeSocket(exampleVRS);

        this.configure_initial_cursor();

        this.set_avr = () => {};
    }

    configure_initial_cursor = () => {
        if (!this.cursor_position) {
            const lines = this.root_node_socket.get_line_sockets();

            if (lines.length > 0) {
                const first_cursor_locations =
                    lines[0].get_line_cursor_locations();

                if (first_cursor_locations.length > 0) {
                    this.cursor_position = {
                        ...first_cursor_locations[0],
                        position: 0,
                    };

                    this.cursor_line = lines[0].get_id();
                }
            }
        }
    };

    restart_cursor = () => {
        !!this.cursor_interval && clearInterval(this.cursor_interval);
        const cursor_obj = document.getElementById(CURSOR_NAME);

        if (!!cursor_obj) {
            cursor_obj.style.visibility = "visible";
        }

        this.cursor_interval = setInterval(() => {
            const cursor_obj = document.getElementById(CURSOR_NAME);

            if (!!cursor_obj) {
                cursor_obj.style.visibility =
                    cursor_obj.style.visibility === "hidden"
                        ? "visible"
                        : "hidden";
            }
        }, 530);
    };

    process_change = () => {
        this.set_avr(
            this.root_node_socket.get_avr(
                !!this.cursor_position ? this.cursor_position : EMPTY_CURSOR
            )
        );
        this.restart_cursor();
    };

    handle_keypress: KeyboardHandler = (e) => {};

    handle_keydown: KeyboardHandler = (e) => {
        switch (e.key) {
            case "ArrowLeft": {
                this.handle_move_left();
                break;
            }
            case "ArrowRight": {
                this.handle_move_right();
                break;
            }
            case "ArrowUp": {
                this.handle_move_vertical(true);
                break;
            }
            case "ArrowDown": {
                this.handle_move_vertical(false);
                break;
            }
        }

        this.process_change();
    };

    handle_move_right = () => {
        /* First check if we have a cursor and a line */
        if (!!this.cursor_line && !!this.cursor_position) {
            const cursor_socket = this.cursor_position.ref;

            /* See if we can just move the cursor within the same socket */
            let entry: string;

            switch (this.cursor_position.side) {
                case CursorSide.Left: {
                    entry = cursor_socket.get_left_entry();
                    break;
                }
                case CursorSide.Right: {
                    entry = cursor_socket.get_right_entry();
                    break;
                }
            }

            if (this.cursor_position.position < entry.length) {
                this.cursor_position.position++;
            } else {
                /* Ok, now we've established that we need to shift sockets
                 * all together (if anything goes wrong here, we just call configure_initial_cursor
                 * and call it a day)
                 *
                 * So first, get all the lines and find our line*/
                const lines = this.root_node_socket.get_line_sockets();

                const current_line = lines.find(
                    (line) => line.get_id() === this.cursor_line
                );

                if (!!current_line) {
                    /* Now get all locations, and find our location */
                    const locations = current_line.get_line_cursor_locations();

                    const curr_index = locations.findIndex(
                        (loc) =>
                            loc.id === this.cursor_position?.id &&
                            loc.side === this.cursor_position.side
                    );

                    if (curr_index >= 0) {
                        /* Handle the case where we're at the end of the line */
                        if (curr_index !== locations.length - 1) {
                            this.cursor_position = {
                                ...locations[curr_index + 1],
                                position: 0,
                            };
                        }

                        /* Now we return because everything was where it
                         * ought to have been */
                        return;
                    }
                }
            }
        }

        this.configure_initial_cursor();
    };

    handle_move_left = () => {
        /* This is identical to move left, just reversed */
        if (!!this.cursor_line && !!this.cursor_position) {
            if (this.cursor_position.position > 0) {
                this.cursor_position.position--;
            } else {
                const lines = this.root_node_socket.get_line_sockets();

                const current_line = lines.find(
                    (line) => line.get_id() === this.cursor_line
                );

                if (!!current_line) {
                    const locations = current_line.get_line_cursor_locations();

                    const curr_index = locations.findIndex(
                        (loc) =>
                            loc.id === this.cursor_position?.id &&
                            loc.side === this.cursor_position.side
                    );

                    if (curr_index >= 0) {
                        if (curr_index > 0) {
                            let position: number;
                            const new_location = locations[curr_index - 1];

                            switch (new_location.side) {
                                case CursorSide.Left: {
                                    position =
                                        new_location.ref.get_left_entry()
                                            .length - 1;
                                    break;
                                }
                                case CursorSide.Right: {
                                    position =
                                        new_location.ref.get_right_entry()
                                            .length - 1;
                                    break;
                                }
                            }

                            this.cursor_position = {
                                ...locations[curr_index - 1],
                                position,
                            };
                        }

                        return;
                    }
                }
            }
        }

        this.configure_initial_cursor();
    };

    handle_move_vertical = (move_up: boolean) => {
        /* First make sure we even have a cursor and line */
        if (!!this.cursor_line && !!this.cursor_position) {
            const lines = this.root_node_socket.get_line_sockets();

            /* First we need to get the index of this line,
             * and also the index of the socket within the line*/
            const line_index = lines.findIndex(
                (line) => line.get_id() === this.cursor_line
            );

            /* Make sure the line exists */
            if (line_index > -1) {
                if (move_up) {
                    /* If the line is equal to zero, then we can't
                     * move up anymore, so immediately return  */
                    if (line_index === 0) {
                        return;
                    }
                } else {
                    /* If the line is at the bottom, then we can't
                     * move down anymore, so immediately return  */
                    if (line_index >= lines.length - 1) {
                        return;
                    }
                }

                /* Now then, lets find the index of our
                 * current cursor socket */
                const current_line = lines[line_index];
                const socket_index = current_line
                    .get_line_cursor_locations()
                    .findIndex(
                        (loc) =>
                            this.cursor_position?.id === loc.id &&
                            this.cursor_position.side === loc.side
                    );

                /* Make sure index exists*/
                if (socket_index > -1) {
                    /* Now then, we have enough info to get the corresponding
                     * socket in the previous line */
                    const new_line =
                        lines[move_up ? line_index - 1 : line_index + 1];
                    const new_locations = new_line.get_line_cursor_locations();

                    const new_loc =
                        new_locations[
                            Math.min(new_locations.length - 1, socket_index)
                        ];

                    /* Now handle position */
                    let new_position;

                    switch (new_loc.side) {
                        case CursorSide.Left: {
                            new_position = Math.min(
                                new_loc.ref.get_left_entry().length,
                                this.cursor_position.position
                            );

                            break;
                        }
                        case CursorSide.Right: {
                            new_position = Math.min(
                                new_loc.ref.get_right_entry().length,
                                this.cursor_position.position
                            );

                            break;
                        }
                    }

                    /* Finally, set the line and the socket, and return */
                    this.cursor_line = new_line.get_id();
                    this.cursor_position = {
                        ...new_loc,
                        position: new_position,
                    };

                    return;
                }
            }
        }

        this.configure_initial_cursor();
    };

    set_set_avr = (set_avr: (avr: AVRNode) => void) => {
        this.set_avr = set_avr;

        this.process_change();
    };

    /* Getter for basic info */
    get_file_id = () => {
        return this.file_id;
    };

    get_file_name = () => {
        return this.file_name;
    };

    get_formatted_name = () => {
        return this.formatted_name;
    };

    get_file_path = () => {
        return this.file_path;
    };

    /* Returns whether another path maps
     * to the same location as this one */
    path_eq = (other_path: OrchidFilePath): boolean => {
        return file_path_eq(this.file_path, other_path);
    };

    /* Updates File editor master with the latest
     * rep skeleton */
    update = (vrs: VisualRepSkeleton) => {};
}
