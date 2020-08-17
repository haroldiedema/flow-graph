/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

/**
 * Represents the template of a node within the graph.
 */
export interface NodeTemplate
{
    /**
     * The type of the node.
     *
     * This will determine the visual representation of the node within the graph.
     */
    type: NodeType;

    /**
     * The system name of the node.
     */
    systemName: string;

    /**
     * The display name of the node.
     */
    name: string;

    /**
     * The description of the node.
     */
    description?: string;

    /**
     * Whether the node accepts an input, meaning another node can be executed prior to this one.
     */
    hasEntryFlow?: boolean;

    /**
     * A collection of input parameters.
     */
    inputs?: NodeInputSocket[];

    /**
     * A collection of exit states.
     *
     * These outputs allow connection towards other nodes.
     */
    outputs?: NodeEdgeSocket[];
}

/**
 * Denotes the type of the node, which determines the visual representation of it.
 */
export enum NodeType
{
    'CONDITION' = 'CONDITION',
    'ACTION' = 'ACTION',
    'SUCCESS' = 'SUCCESS',
    'FAILURE' = 'FAILURE'
}

export type NodeInputSocket = {
    name: string;
    label: string;
    type: NodeSocketType;
    items?: {[name: string]: string|number}
}

export type NodeSocketType = 'string' | 'number' | 'boolean' | 'select' | '';
export type NodeEdgeSocket = {
    name: string;
    label: string;
}
