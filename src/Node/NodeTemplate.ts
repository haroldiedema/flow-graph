/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

export interface NodeTemplate
{
    type: NodeType;
    systemName: string;
    name: string;
    hasEntryFlow?: boolean;
    color?: string;
    description?: string;
    icon?: string;
    inputs?: NodeInputSocket[];
    outputs?: NodeEdgeSocket[];
}

export type NodeType = 'CONDITION' | 'ACTION' | 'EVENT' | 'SUCCESS' | 'FAILED';

export type NodeInputSocket = {
    name: string;
    label: string;
    type: NodeSocketType;
    items?: {[name: string]: string|number}
}

export type NodeSocketType = string;

export type NodeEdgeSocket = {
    name: string;
    label: string;
}
