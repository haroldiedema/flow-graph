/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Node}                       from '@/Node/Node';
import {NodeSocket, NodeSocketType} from '@/Node/NodeTemplate';

export class Socket
{
    private readonly element: HTMLElement;

    constructor(private readonly node: Node, private data: NodeSocket)
    {
        this.createElement('div', ['socket']);


    }

    /**
     * Creates a new HTML element by the given type.
     *
     * @param {string} type
     * @param {string[]} classList
     * @param {HTMLElement} parentNode
     * @returns {HTMLElement}
     * @private
     */
    private createElement(type: string, classList: string[], parentNode?: HTMLElement): HTMLElement
    {
        const el = document.createElement(type);
        el.classList.add(...classList);

        if (parentNode) {
            parentNode.appendChild(el);
        }

        return el;
    }
}
