export enum CursorSide {
    Left,
    Right,
}

export interface VRTCursorLocation {
    id: string;
    side: CursorSide;
}

export interface VRTCursorLocationRef extends VRTCursorLocation {
    ref: VRTCursorSocket;
}

export interface VRTCursorPosition extends VRTCursorLocation {
    /* This is the position within the actual string of characters
     * in a socket */
    position: number;
}

export interface VRTCursorPositionRef extends VRTCursorPosition {
    ref: VRTCursorSocket;
}

export interface VRTCursorSocket {
    get_left_entry: () => string;
    get_right_entry: () => string;

    set_left_entry: (entry: string) => void;
    set_right_entry: (entry: string) => void;

    /* Indicates whether we can even add characters
     * to the socket at this time (we can't for line or
     * container holding sockets, for instance) */
    can_set_entry: () => boolean;
}
