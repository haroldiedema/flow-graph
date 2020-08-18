/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}       from '@/DI/Inject';
import {EdgeLayer}    from '@/Edge/EdgeLayer';
import {FuzzyFinder}  from '@/FuzzyFinder';
import {Graph}        from '@/Graph';
import {Node}         from '@/Node/Node';
import {NodeRegistry} from '@/Node/NodeRegistry';
import {NodeTemplate} from '@/Node/NodeTemplate';

export * from '@/Node/NodeTemplate';

import '@/Styles/FlowGraph.scss';
import {Viewport}     from '@/Viewport/Viewport';

export default class FlowGraph
{
    @Inject private readonly viewport: Viewport;
    @Inject private readonly edgeLayer: EdgeLayer;
    @Inject private readonly graph: Graph;
    @Inject private readonly registry: NodeRegistry;
    @Inject private readonly fuzzyFinder: FuzzyFinder;

    constructor(domAttachPoint: HTMLElement)
    {
        this.viewport.initialize(domAttachPoint);
        this.edgeLayer.initialize();

        this.viewport.on('open-fuzzy-finder', async (mouse: Vector2, point: Vector2) => {
            const nodeName = await this.fuzzyFinder.open(mouse);
            if (!nodeName) {
                return;
            }

            this.createNode(nodeName, point);
        });

        this.edgeLayer.on('connect-via-fuzzy-finder',
            async (sourceNode: string, sourceSocket: string, mouse: Vector2, point: Vector2) => {
                const nodeName = await this.fuzzyFinder.open(mouse);
                if (!nodeName) {
                    return;
                }

                const node = this.createNode(nodeName, point);
                setTimeout(() => this.graph.addConnection(sourceNode, sourceSocket, node.id), 10);
            });
    }

    public registerNodeTemplate(template: NodeTemplate): this
    {
        this.registry.add(template);

        return this;
    }

    /**
     * Creates a node on the graph at the given position vector.
     *
     * @param {string} systemName
     * @param {Vector2} position
     * @param {string} id
     * @returns {Node}
     */
    public createNode(systemName: string, position: Vector2, id?: string): Node
    {
        if (!this.registry.has(systemName)) {
            console.warn(`Node template "${systemName}" does not exist.`);
        }

        if (!id) {
            id = this.generateUUID();
        }

        return this.graph.addNode(id, this.registry.get(systemName), position);
    }

    /**
     * Imports the given graph.
     * This will erase the current graph.
     *
     * @param {ExportedGraph} graph
     */
    public import(graph: ExportedGraph): void
    {
        this.graph.clear();

        // Add nodes.
        Object.keys((graph.steps || {})).forEach((nodeId: string) => {
            const data: ExportedStep = graph.steps[nodeId];
            const node               = this.createNode(data.systemName, data.position, nodeId);

            // Set parameters.
            Object.keys((data.parameters || {})).forEach((paramName: string) => {
                node.setInputValue(paramName, data.parameters[paramName]);
            });
        });

        // Add edges.
        Object.keys((graph.steps || {})).forEach((nodeId: string) => {
            const data: ExportedStep = graph.steps[nodeId];
            Object.keys((data.exitStates || {})).forEach((exitState: string) => {
                this.graph.addConnection(nodeId, exitState, data.exitStates[exitState]);
            });
        });
    }

    /**
     * Creates an export of the current graph.
     *
     * @returns {ExportedGraph}
     */
    public export(): ExportedGraph
    {
        return this.graph.export();
    }

    /**
     * Returns a randomly generated UUID v4 string.
     *
     * @returns {string}
     */
    private generateUUID(): string
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

type Vector2 = { x: number, y: number };

export interface ExportedGraph
{
    steps: { [id: string]: ExportedStep }
}

export interface ExportedStep
{
    systemName: string;
    parameters: { [name: string]: any };
    exitStates: { [name: string]: string };
    position: { x: number, y: number };
}
