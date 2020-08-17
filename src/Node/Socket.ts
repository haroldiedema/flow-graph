/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Node}                       from '@/Node/Node';

export class Socket
{
    public readonly element: HTMLElement;

    protected textElement: HTMLElement;
    protected iconElement: HTMLElement;

    constructor(targetElement: HTMLElement, private direction: SocketDirection)
    {
        this.element = this.createElement('div', [
            'socket',
            direction === SocketDirection.INPUT ? 'socket-input' : 'socket-output'
        ], targetElement);

        switch(direction) {
            case SocketDirection.INPUT:
                this.iconElement = this.createElement('div', ['socket-icon'], this.element);
                this.textElement = this.createElement('div', ['socket-text'], this.element);
                break;
            case SocketDirection.OUTPUT:
                this.textElement = this.createElement('div', ['socket-text'], this.element);
                this.iconElement = this.createElement('div', ['socket-icon'], this.element);
                break;
        }
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
    protected createElement<T>(type: string, classList: string[], parentNode?: HTMLElement): HTMLElement & T
    {
        const el = document.createElement(type);
        el.classList.add(...classList);

        if (parentNode) {
            parentNode.appendChild(el);
        }

        return el as HTMLElement & T;
    }
}

/**
 * Denotes the socket direction.
 */
export enum SocketDirection
{
    INPUT,
    OUTPUT
}
