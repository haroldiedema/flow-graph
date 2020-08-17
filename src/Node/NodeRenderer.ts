/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}       from '@/DI/Inject';
import {Service}      from '@/DI/Service';
import {Node}         from '@/Node/Node';
import {NodeTemplate} from '@/Node/NodeTemplate';
import {Viewport}     from '@/Viewport/Viewport';

const NODE_TPL = `
<div class="node">
    <div class="header">{{ TITLE }}</div>
    
</div>
`;

@Service
export class NodeRenderer
{
    @Inject private readonly viewport: Viewport;

    public render(template: NodeTemplate, position: Vector2): Node
    {
        const node = new Node(template);

        this.viewport.workspace.appendChild(node.element);
        node.element.style.left = position.x + 'px';
        node.element.style.top  = position.y + 'px';

        return node;
    }
}

type Vector2 = { x: number, y: number };
