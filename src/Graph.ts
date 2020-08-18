/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}                        from '@/DI/Inject';
import {Service}                       from '@/DI/Service';
import {EdgeLayer, NewConnectionEvent} from '@/Edge/EdgeLayer';
import {EventEmitter}                from '@/Events/EventEmitter';
import {ExportedGraph, ExportedStep} from '@/FlowGraph';
import {InputSocket}                 from '@/Node/InputSocket';
import {Node}                          from '@/Node/Node';
import {NodeTemplate}                  from '@/Node/NodeTemplate';
import {Viewport}                      from '@/Viewport/Viewport';

@Service
export class Graph extends EventEmitter
{
    @Inject private readonly viewport: Viewport;
    @Inject private edgeLayer: EdgeLayer;

    private nodes: Map<string, Node>                = new Map();
    private edges: Map<string, Map<string, string>> = new Map();

    constructor()
    {
        super();

        this.edgeLayer.on('new-connection', ((e: NewConnectionEvent) => {
            this.addConnection(e.sourceNode, e.sourceSocket, e.targetNode);
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
        this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);
    }

    /**
     * Deletes the given node.
     *
     * @param {Node} node
     */
    public deleteNode(node: Node): void
    {
        // Delete edges.
        this.edges.delete(node.id);
        this.edges.forEach((exitStates: Map<string, string>, _: string) => {
            exitStates.forEach((targetNode: string, sourceSocket: string) => {
                if (targetNode === node.id) {
                    exitStates.delete(sourceSocket);
                }
            });
        });

        this.nodes.delete(node.id);
        node.element.remove();
        node = undefined;

        this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);
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
        node.on('delete', () => this.deleteNode(node));
        node.on('select', () => this.emit('select', node));
        node.on('deselect', () => this.emit('deselect', node));

        node.on('id-changed', (newId: string, oldId: string) => {
            this.changeNodeId(newId, oldId);
        });

        this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);

        this.edges.set(id, new Map());

        return node;
    }

    public clear(): void
    {
        this.nodes = new Map();
        this.edges = new Map();

        this.viewport.workspace.innerHTML = '';
        this.viewport.edgeLayer.innerHTML = '';
    }

    public import(graph: ExportedGraph): void
    {

    }

    public export(): ExportedGraph
    {
        const graph: ExportedGraph = { steps: {}};

        this.edges.forEach((exitStates: Map<string, string>, nodeId: string) => {
            graph.steps[nodeId] = {
                systemName: this.nodes.get(nodeId).systemName,
                parameters: {},
                exitStates: {},
                position: {
                    x: this.nodes.get(nodeId).element.offsetLeft,
                    y: this.nodes.get(nodeId).element.offsetTop,
                }
            };

            this.nodes.get(nodeId).inputSockets.forEach((inputSocket: InputSocket) => {
                graph.steps[nodeId].parameters[inputSocket.name] = inputSocket.value;
            });

            exitStates.forEach((targetNode: string, sourceSocket: string) => {
                graph.steps[nodeId].exitStates[sourceSocket] = targetNode;
            });
        });

        return graph;
    }

    /**
     * Changes the ID of a node.
     *
     * @param {string} newId
     * @param {string} oldId
     */
    private changeNodeId(newId: string, oldId: string): void
    {
        if (this.nodes.has(newId)) {
            console.warn(`ID ${newId} already exists.`);
            return;
        }

        this.nodes.set(newId, this.nodes.get(oldId));
        this.nodes.delete(oldId);

        this.edges.set(newId, this.edges.get(oldId));
        this.edges.delete(oldId);

        this.edges.forEach((exitStates: Map<string, string>, nodeId: string) => {
            exitStates.forEach((targetNode: string, sourceSocket: string) => {
                if (targetNode === oldId) {
                    this.edges.get(nodeId).set(sourceSocket, newId);
                }
            });
        });

        this.edgeLayer.refresh(Array.from(this.nodes.values()), this.edges);
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

type Vector2 = { x: number, y: number };
