/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}                        from '@/DI/Inject';
import {Service}                       from '@/DI/Service';
import {EdgeLayer, NewConnectionEvent} from '@/Edge/EdgeLayer';
import {Node}                          from '@/Node/Node';
import {NodeTemplate}                  from '@/Node/NodeTemplate';
import {OutputSocket}                  from '@/Node/OutputSocket';
import {Viewport}                      from '@/Viewport/Viewport';

@Service
export class Graph
{
    @Inject private readonly viewport: Viewport;
    @Inject private edgeLayer: EdgeLayer;

    private nodes: Map<string, Node> = new Map();
    private edges: Map<string, Map<string, string>> = new Map();

    constructor()
    {
        this.edgeLayer.on('new-connection', ((e: NewConnectionEvent) => {
            console.log(`CONNECT ${e.sourceNode}.${e.sourceSocket} => ${e.targetNode}.${e.targetSocket}`);
            this.addConnection(e.sourceNode, e.sourceSocket, e.targetNode);
            this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);
        }));
    }

    public addConnection(sourceNode: string, sourceSocket: string, targetNode: string): void
    {
        if (false === this.edges.has(sourceNode)) {
            console.warn(`Source node "${sourceNode}" does not exist.`);
            return;
        }

        if (false === this.edges.has(targetNode)) {
            console.warn(`Target node "${targetNode}" does not exist.`);
            return;
        }

        this.edges.get(sourceNode).set(sourceSocket, targetNode);
    }

    /**
     * Adds a node to the graph on the given position.
     *
     * @param {string} id
     * @param {NodeTemplate} template
     * @param {Vector2} position
     * @returns {Node}
     */
    public addNode(id: string, template: NodeTemplate, position: Vector2): Node
    {
        const node = new Node(id, template);

        this.viewport.workspace.appendChild(node.element);

        node.element.style.left = position.x + 'px';
        node.element.style.top  = position.y + 'px';

        this.nodes.set(id, node);

        node.on('drag-start', () => this.onNodeDragStart(node));
        node.on('drag-end', () => this.onNodeDragEnd(node));

        this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);

        this.edges.set(id, new Map());

        return node;
    }

    /**
     * Invoked when the user starts dragging a node.
     *
     * @param {Node} node
     */
    private onNodeDragStart(node: Node): void
    {
        this.edgeLayer.hide();
    }

    /**
     * Invoked when the user stops dragging a node.
     *
     * @param {Node} node
     */
    private onNodeDragEnd(node: Node): void
    {
        this.edgeLayer.show();
        this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);
    }
}

type Vector2 = {x: number, y: number};
