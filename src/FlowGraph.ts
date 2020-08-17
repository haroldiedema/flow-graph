/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}                 from '@/DI/Inject';
import {EdgeLayer}              from '@/Edge/EdgeLayer';
import {FuzzyFinder}            from '@/FuzzyFinder';
import {Graph}                  from '@/Graph';
import {Node}                   from '@/Node/Node';
import {NodeRegistry}           from '@/Node/NodeRegistry';
import {NodeTemplate, NodeType} from '@/Node/NodeTemplate';

import '@/Styles/FlowGraph.scss';
import {Viewport}               from '@/Viewport/Viewport';

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

            this.createNode('test_' + Math.floor((Math.random() * 65535)), nodeName, point);
        });

        this.edgeLayer.on('connect-via-fuzzy-finder', async (sourceNode: string, sourceSocket: string, mouse: Vector2, point: Vector2) => {
            const nodeName = await this.fuzzyFinder.open(mouse);
            if (!nodeName) {
                return;
            }
            const id = 'test_' + Math.floor((Math.random() * 65535));
            this.createNode(id, nodeName, point);
            setTimeout(() => this.graph.addConnection(sourceNode, sourceSocket, id), 10);

            console.log('CONNECT:',sourceNode, sourceSocket, id);
        });

        // TEST
        this.test();
    }

    public registerNodeTemplate(template: NodeTemplate): this
    {
        this.registry.add(template);

        return this;
    }

    /**
     * Creates a node on the graph at the given position vector.
     *
     * @param {string} id
     * @param {string} systemName
     * @param {Vector2} position
     * @returns {Node}
     */
    public createNode(id: string, systemName: string, position: Vector2): Node
    {
        if (!this.registry.has(systemName)) {
            console.warn(`Node template "${systemName}" does not exist.`);
        }

        return this.graph.addNode(id, this.registry.get(systemName), position);
    }

    //
    public test(): void
    {
        const tpl: NodeTemplate = {
            type:         NodeType.ACTION,
            name:         'Do some funky parameter madness',
            systemName:   'do_stuff',
            hasEntryFlow: true,
            inputs:       [
                {
                    name:  'MAIL_TEMPLATE',
                    label: 'Mail template',
                    type:  'string',
                }, {
                    name:  'MAX_ATTEMPTS',
                    label: 'Max attempts',
                    type:  'number',
                }, {
                    name:  'RECONNECT',
                    label: 'Auto reconnect',
                    type:  'boolean',
                }, {
                    name:  'CONTACT_PROVIDER',
                    label: 'Contact data provider',
                    type:  'select',
                    items: {
                        default: 'The default one',
                        custom:  'The custom one goes here',
                    },
                },
            ],
            outputs:      [
                {name: 'exit_success', label: 'It succeeded'},
                {name: 'exit_failed', label: 'Nope, it failed.'},
            ],
        };

        const tpl1: NodeTemplate = {
            type:         NodeType.CONDITION,
            name:         'Does the given parameter exists?',
            systemName:   'b7.worker.task.parameter_exists',
            hasEntryFlow: true,
            inputs:       [
                {
                    name:  'PARAMETER',
                    label: 'Parameter',
                    type:  'string',
                },
            ],
            outputs:      [
                {name: 'exit_yes', label: 'Yes, it exists'},
                {name: 'exit_no', label: 'Nope, it does not'},
                {name: 'exit_empty', label: 'It does, but its empty'},
            ],
        };


        const tpl2: NodeTemplate = {
            type:         NodeType.ACTION,
            name:         'Task begin',
            systemName:   'b7.default.task_start',
            hasEntryFlow: false,
            outputs:      [
                {
                    name:  'exit_success',
                    label: 'Task initialized',
                },
            ],
        };

        const tpl3: NodeTemplate = {
            type:         NodeType.SUCCESS,
            name:         'Task finished successfully',
            systemName:   'b7.default.task_success',
            hasEntryFlow: true,
        };

        const tpl4: NodeTemplate = {
            type:         NodeType.FAILURE,
            name:         'Task finished unsuccessfully',
            systemName:   'b7.default.task_failed',
            hasEntryFlow: true,
        };

        this.registry.add(tpl).add(tpl1).add(tpl2).add(tpl3).add(tpl4);
    }

    //
    //    this.graph.addNode('entry', tpl2, {x: 50, y: 156});
    //    this.graph.addNode('do_sttuff', tpl, {x: 456, y: 256});
    //    this.graph.addNode('success', tpl3, {x: 996, y: 150});
    //    this.graph.addNode('failed', tpl4, {x: 996, y: 275});
    //}
}

type Vector2 = { x: number, y: number };
