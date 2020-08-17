/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}                        from '@/DI/Inject';
import {EdgeLayer, NewConnectionEvent} from '@/Edge/EdgeLayer';
import {Graph}                         from '@/Graph';
import {NodeTemplate} from '@/Node/NodeTemplate';
import {Viewport}     from '@/Viewport/Viewport';

import '@/Styles/FlowGraph.scss';

export default class FlowGraph
{
    @Inject private readonly viewport: Viewport;
    @Inject private readonly edgeLayer: EdgeLayer;
    @Inject private readonly graph: Graph;

    constructor(domAttachPoint: HTMLElement)
    {
        this.viewport.initialize(domAttachPoint);
        this.edgeLayer.initialize();
    }

    public test(): void
    {
        const tpl: NodeTemplate = {
            type:         'ACTION',
            name:         'Do some funky stuff',
            color:        '#aaa',
            systemName:   'do_stuff',
            hasEntryFlow: true,
            icon:         'url(\'data:image/png;base64,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\')',
            inputs:       [
                {
                    name: 'MAIL_TEMPLATE',
                    label: 'Mail template',
                    type: 'string'
                }, {
                    name: 'MAX_ATTEMPTS',
                    label: 'Max attempts',
                    type: 'number'
                }, {
                    name: 'RECONNECT',
                    label: 'Auto reconnect',
                    type: 'boolean'
                }, {
                    name: 'CONTACT_PROVIDER',
                    label: 'Contact data provider',
                    type: 'select',
                    items: {
                        default: 'The default one',
                        custom: 'The custom one goes here'
                    }
                }
            ],
            outputs:      [
                {name: 'exit_success', label: 'It succeeded'},
                {name: 'exit_failed', label: 'Nope, it failed.'},
            ],
        };

        const tpl2: NodeTemplate = {
            type: 'EVENT',
            name: 'Task begin',
            systemName: 'b7.default.task_start',
            color: '#8ca',
            hasEntryFlow: false,
            outputs: [
                {
                    name: 'exit_success',
                    label: 'Task initialized'
                }
            ]
        }

        const tpl3: NodeTemplate = {
            type: 'SUCCESS',
            name: 'Task finished successfully',
            systemName: 'b7.default.task_success',
            color: '#7c8',
            hasEntryFlow: true,
        }

        const tpl4: NodeTemplate = {
            type: 'SUCCESS',
            name: 'Task finished unsuccessfully',
            systemName: 'b7.default.task_failed',
            color: '#c87',
            hasEntryFlow: true,
        }


        this.graph.addNode('entry', tpl2, {x: 50, y: 156});
        this.graph.addNode('do_sttuff', tpl, {x: 456, y: 256});
        this.graph.addNode('success', tpl3, {x: 996, y: 150});
        this.graph.addNode('failed', tpl4, {x: 996, y: 275});
    }
}
