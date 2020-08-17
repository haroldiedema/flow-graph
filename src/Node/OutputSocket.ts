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

        this.textElement.innerHTML             = data.label;
        this.iconElement.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAH5SURBVEiJ7ZTPalNBFMa/M3fSUhvTcm+iBjc+QWoQRNBeLBq1vkFpwCewKi5cZ+tGmj5CxWxduFBx09ZY3Hi52foK+QPaIu29cz43RtKQYKBm1281zHzz/YYznCMkMU2ZqaafAaYOWHn0/G1YfXxzagBVfWBM5v2t6saNqQAAoFwuZ62X+Riub1z/7wAS4vs+ri4tnTee/bS8/uTasEcGGk3WXrwsHh/pZSAtqnOXCC0kigKcBgr6VLeoygV1LueU2Yz1ZpbDcB4A2u024jj+wSS9vdOoRyMBtca7wPtlA9rUF5hAwUDAACoBgUAEAYAAAh/8swbm+gF9iGMa7m3X4+EScSZJ6KxykC40pIAiQhEQMn625PN5lEqlnGfszsrasyvDABwn5+ip0qhHHRpSBEmCoFAIAkIAo2GEVaMZALCD+7NzKY9UaWhoHKkwBEgRkpC/1wn2w08A2u02Wq3WoUv0zl5j8/sJgNRqZrWD+VlY3zEtQvWiABcSagFEoOp8VS5SdUGdyymZtdYiDEMAQKfTQRzHh6mmdz836l8HyzyupP9UWH2aVCoV2+12EUXRQZLyXvPNq/1Bjx13eVL1ej1EUXTAxN1vNjb3h89PCaB8i6KfqsnqbmPryyjHqTrZGPvBJe7h7uut5jjPqf5gokdMNf0MMIl+Az2oCQS/ILc5AAAAAElFTkSuQmCC\')';
    }
}
