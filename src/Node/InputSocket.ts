/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Node}                    from '@/Node/Node';
import {NodeEdgeSocket}          from '@/Node/NodeTemplate';
import {Socket, SocketDirection} from '@/Node/Socket';

export class OutputSocket extends Socket
{
    constructor(targetElement: HTMLElement, private data: NodeEdgeSocket)
    {
        super(targetElement, SocketDirection.OUTPUT);

        this.textElement.innerHTML = data.label;
    }
}
