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
import { hint_strings } from "../../utils/vimium_hints";
import { FileEditorMasterWs } from "./sub_agents/file_editor_master_ws/file_editor_master_ws";
import {
    FemWsRes,
    res_is_full_vrs,
} from "./sub_agents/file_editor_master_ws/basic_msgs/fem_res";
import { v4 } from "uuid";
import { SocketSide } from "./sub_agents/file_editor_master_ws/basic_msgs/fem_cmd";

const EMPTY_CURSOR: VRTCursorPosition = {
    id: "",
    side: CursorSide.Left,
    position: 0,
};

export class FileEditorMaster {
    private readonly ws: FileEditorMasterWs;

    /* Set file_id to a temp value */
    private file_id: string = v4();
    private file_name?: string;
    private file_path: OrchidFilePath;
    private formatted_name?: string;
    private root_node_socket: VRTNodeSocket = new VRTNodeSocket({
        id: "",
        node: null,
    });

    private cursor_position: VRTCursorPositionRef | null = null;
    private cursor_line?: string;

    /* All this 'select' stuff is for vimium select mode */
    private select_mode: boolean = false;
    private set_external_select_mode: (select_mode: boolean) => void = () => {};

    private select_seq: string = "";
    private set_external_select_seq: (seq: string) => void = () => {};

    private edit_rep_mode: boolean = false;
    private set_external_edit_rep_mode: (edit_rep_mode: boolean) => void =
        () => {};

    private set_external_rep_id: (rep_id: string) => void = () => {};

    private set_avr: (avr: AVRNode) => void = () => {};

    private on_hydrated_callbacks: { id: string; callback: () => void }[] = [];
    private hydrated: boolean = false;

    private has_focus: boolean = true;

    private restart_cursor: () => void = () => {};

    constructor(file_path: OrchidFilePath) {
        this.file_path = file_path;

        /* Configure the ws connection */
        this.ws = new FileEditorMasterWs(this.handle_ws_res);

        /* ...and then send a request to open the file*/
        this.ws.open_file(this.file_path);
    }

    handle_ws_res = (res: FemWsRes) => {
        if (res_is_full_vrs(res)) {
            const { vrs } = res.FullVRS;

            if (this.path_eq(vrs.file_path)) {
                const { file_name, formatted_name, root_node_socket, file_id } =
                    vrs;

                this.file_id = file_id;
                this.file_name = file_name;
                this.formatted_name = formatted_name;
                this.root_node_socket = new VRTNodeSocket(
                    // exampleVRS
                    root_node_socket
                );

                this.configure_initial_cursor();

                /* Handle hydration callbacks */
                if (!this.hydrated) {
                    this.hydrated = true;
                    this.on_hydrated_callbacks.forEach((c) => c.callback());
                }
            }
        }

        this.process_change();
    };

    configure_initial_cursor = () => {
        if (!this.cursor_position && !!this.root_node_socket) {
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

    process_change = () => {
        /* First label the sockets */
        this.label_sockets();

        let position = EMPTY_CURSOR;

        if (this.has_focus && !this.select_mode && !!this.cursor_position) {
            position = this.cursor_position;
        }

        const avr = this.root_node_socket.get_avr(position);

        this.set_avr(avr);

        this.restart_cursor();
    };

    label_sockets = () => {
        const num_selectable =
            this.root_node_socket.get_num_selectable_sockets();
        const labels = hint_strings(num_selectable).reverse();

        this.root_node_socket.label_selectable_sockets(labels);
    };

    handle_keypress: KeyboardHandler = (e) => {
        const char = e.key === " " ? e.key : e.key.trim();

        if (this.select_mode) {
            this.set_select_seq(this.select_seq + char);
        } else {
            this.handle_intake_character(char);
        }

        this.process_change();
    };

    handle_keydown: KeyboardHandler = (e) => {
        if (this.select_mode) {
            const switch_out = () => {
                this.set_select_seq("");
                this.set_select_mode(false);
            };

            if (e.ctrlKey && !e.shiftKey) {
                switch (e.key) {
                    case "Control":
                        e.preventDefault();
                        return;
                    case "f":
                        e.preventDefault();
                        switch_out();
                        break;
                }
            } else {
                switch (e.key) {
                    case "Escape": {
                        switch_out();
                        break;
                    }
                    case "Backspace": {
                        if (this.select_seq.length > 0) {
                            this.set_select_seq(
                                this.select_seq.substring(
                                    0,
                                    this.select_seq.length - 1
                                )
                            );
                        } else {
                            switch_out();
                            break;
                        }
                    }
                }
            }
        } else {
            if (e.ctrlKey && !e.shiftKey) {
                switch (e.key) {
                    case "Control":
                        e.preventDefault();
                        return;
                    case "f":
                        e.preventDefault();
                        this.set_select_mode(true);
                        this.set_select_seq("");
                        break;
                    case "h":
                        e.preventDefault();
                        this.handle_move_left();
                        break;
                    case "l":
                        e.preventDefault();
                        this.handle_move_right();
                        break;
                    case "j":
                        e.preventDefault();
                        this.handle_move_vertical(false);
                        break;
                    case "k":
                        e.preventDefault();
                        this.handle_move_vertical(true);
                        break;
                }
            } else {
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
                    case "Backspace": {
                        this.handle_delete();
                        break;
                    }
                    case "Enter": {
                        this.handle_enter();
                        break;
                    }
                }
            }
        }

        this.process_change();
    };

    handle_intake_character = (char: string) => {
        /* First make sure we even have a ref */
        if (!!this.cursor_position) {
            /* Next we see if the cursor even allows
             * input characters at the moment */
            const cursor_socket = this.cursor_position.ref;
            const { position } = this.cursor_position;

            if (cursor_socket.can_set_entry()) {
                switch (this.cursor_position.side) {
                    case CursorSide.Left: {
                        const old_entry = cursor_socket.get_left_entry();
                        cursor_socket.set_left_entry(
                            old_entry.slice(0, position) +
                                char +
                                old_entry.slice(position)
                        );

                        break;
                    }
                    case CursorSide.Right: {
                        const old_entry = cursor_socket.get_right_entry();
                        cursor_socket.set_right_entry(
                            old_entry.slice(0, position) +
                                char +
                                old_entry.slice(position)
                        );

                        break;
                    }
                }

                this.cursor_position.position++;
            }
        }
    };

    handle_delete = () => {
        if (!!this.cursor_position) {
            const cursor_socket = this.cursor_position.ref;
            const { position } = this.cursor_position;

            if (cursor_socket.can_set_entry()) {
                if (position > 0) {
                    switch (this.cursor_position.side) {
                        case CursorSide.Left: {
                            const old_entry = cursor_socket.get_left_entry();
                            cursor_socket.set_left_entry(
                                old_entry.slice(0, position - 1) +
                                    old_entry.slice(position)
                            );

                            break;
                        }
                        case CursorSide.Right: {
                            const old_entry = cursor_socket.get_right_entry();
                            cursor_socket.set_right_entry(
                                old_entry.slice(0, position - 1) +
                                    old_entry.slice(position)
                            );

                            break;
                        }
                    }

                    this.cursor_position.position--;
                } else {
                    /*TODO: Handle custom delete behaviors*/
                }
            }
        }
    };

    handle_enter = () => {
        /* First check if we have cursor */
        if (!!this.cursor_position) {
            const cursor_socket = this.cursor_position.ref;

            /* Now let's get the entry and socket side */
            let entry: string;
            let socket_side: SocketSide;

            switch (this.cursor_position.side) {
                case CursorSide.Left:
                    entry = cursor_socket.get_left_entry();
                    socket_side = "Left";

                    break;
                case CursorSide.Right:
                    entry = cursor_socket.get_right_entry();
                    socket_side = "Right";

                    break;
            }

            /* Split this up into whether the entry is empty or not */
            if (!!entry) {
                /* If entry is not empty,
                 * we send a commit input request to the
                 * backend */
                this.ws.commit_input(
                    entry,
                    this.cursor_position.id,
                    socket_side
                );
            }
        }
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
                                            .length;
                                    break;
                                }
                                case CursorSide.Right: {
                                    position =
                                        new_location.ref.get_right_entry()
                                            .length;
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

    select_socket = (socket_id: string) => {
        /* We have to do a linear search through all sockets
         * because we also have to set the line */
        const lines = this.root_node_socket.get_line_sockets();

        for (let line of lines) {
            const cursor_locations = line.get_line_cursor_locations();

            for (let loc of cursor_locations) {
                if (loc.id === socket_id) {
                    /* We found it, so set the cursor,
                     * get out of select mode, and bool, baby */
                    this.cursor_position = { ...loc, position: 0 };
                    this.cursor_line = line.get_id();

                    this.set_select_mode(false);
                    this.set_select_seq("");

                    return this.process_change();
                }
            }
        }
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
        return !!this.formatted_name ? this.formatted_name : "";
    };

    get_file_path = () => {
        return this.file_path;
    };

    set_has_focus = (focus: boolean) => {
        this.has_focus = focus;

        this.process_change();
    };

    /* Returns whether another path maps
     * to the same location as this one */
    path_eq = (other_path: OrchidFilePath): boolean => {
        return file_path_eq(this.file_path, other_path);
    };

    /* Updates File editor master with the latest
     * rep skeleton */
    update = (vrs: VisualRepSkeleton) => {};

    set_set_external_select_mode = (
        set_external_select_mode: (select_mode: boolean) => void
    ) => {
        this.set_external_select_mode = set_external_select_mode;
    };

    set_select_mode = (select_mode: boolean) => {
        this.select_mode = select_mode;
        this.set_external_select_mode(select_mode);
    };

    set_set_external_select_seq = (
        set_external_select_seq: (seq: string) => void
    ) => {
        this.set_external_select_seq = set_external_select_seq;
    };

    set_select_seq = (select_seq: string) => {
        this.select_seq = select_seq;
        this.set_external_select_seq(select_seq);
    };

    set_set_external_rep_id = (
        set_external_rep_id: (rep_id: string) => void
    ) => {
        this.set_external_rep_id = set_external_rep_id;
    };

    set_set_external_rep_mode = (
        set_external_rep_mode: (rep_mode: boolean) => void
    ) => {
        this.set_external_edit_rep_mode = set_external_rep_mode;
    };

    add_on_hydrated = (callback: () => void) => {
        const id = v4();
        this.on_hydrated_callbacks.push({ id, callback });

        return id;
    };

    remove_hydrated_callback = (id: string) => {
        this.on_hydrated_callbacks = this.on_hydrated_callbacks.filter(
            (c) => c.id !== id
        );
    };

    is_hydrated = () => {
        return this.hydrated;
    };

    set_restart_cursor = (restart_cursor: () => void) => {
        this.restart_cursor = restart_cursor;
    };
}
