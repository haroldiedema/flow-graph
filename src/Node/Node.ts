/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {InputSocket}                                   from '@/Node/InputSocket';
import {NodeEdgeSocket, NodeInputSocket, NodeTemplate} from '@/Node/NodeTemplate';
import {OutputSocket}                                  from '@/Node/OutputSocket';
import {Socket}                                        from '@/Node/Socket';

export class Node
{
    public readonly element: HTMLElement;

    private readonly container: HTMLElement;
    private readonly header: HTMLElement;
    private readonly headerIcon: HTMLElement;
    private readonly headerText: HTMLElement;
    private readonly headerTitle: HTMLElement;
    private readonly headerSubTitle: HTMLElement;
    private readonly body: HTMLElement;
    private readonly bodyIn: HTMLElement;
    private readonly bodyOut: HTMLElement;

    private readonly flowInput: InputSocket;
    private readonly inputs: any[]  = [];
    private readonly outputs: any[] = [];

    constructor(template: NodeTemplate)
    {
        this.element = this.createElement('div', ['node']);

        this.container = this.createElement('div', ['container'], this.element);
        this.header    = this.createElement('div', ['header'], this.container);

        // Set icon.
        if (template.icon) {
            this.headerIcon                       = this.createElement('div', ['header-icon'], this.header);
            this.headerIcon.style.backgroundImage = template.icon;
        }

        this.headerText     = this.createElement('div', ['header-text'], this.header);
        this.headerTitle    = this.createElement('div', ['header-title'], this.headerText);
        this.headerSubTitle = this.createElement('div', ['header-sub-title'], this.headerText);

        // Body elements.
        this.body    = this.createElement('div', ['body'], this.container);
        this.bodyIn  = this.createElement('div', ['body-in'], this.body);
        this.bodyOut = this.createElement('div', ['body-out'], this.body);

        // Set element color.
        const color                          = template.color || '#B0B0B0';
        this.container.style.backgroundImage = 'linear-gradient(' + color + ', ' + this.adjustColor(color, -20) + ')';

        // Apply header text.
        this.headerTitle.innerHTML    = template.name;
        this.headerSubTitle.innerHTML = this.toCapitalizedWord(template.type);

        // Input sockets.
        if (template.hasEntryFlow !== false) {
            const socket = this.createElement('div', ['socket-flow'], this.bodyIn);
            this.inputs.push(socket);
        }
        (template.inputs || []).forEach((input: NodeInputSocket) => {
            this.inputs.push(new InputSocket(this.bodyIn, input));
        });

        // Output sockets.
        (template.outputs || []).forEach((output: NodeEdgeSocket) => {
            this.outputs.push(new OutputSocket(this.bodyOut, output));
        });
    }

    public get bodyInputElement(): HTMLElement
    {
        return this.bodyIn;
    }

    public get bodyOutputElement(): HTMLElement
    {
        return this.bodyOut;
    }

    /**
     * Transforms the given string to a capitalized word.
     *
     * @param {string} word
     * @returns {string}
     * @private
     */
    private toCapitalizedWord(word: string): string
    {
        let t: string = word.toLowerCase();

        return t.charAt(0).toUpperCase() + t.substr(1);
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

    /**
     * Adjusts the given color by the given amount.
     *
     * @param {string} colorCode
     * @param {number} amount
     * @returns {string}
     * @private
     */
    private adjustColor(colorCode: string, amount: number): string
    {
        let usePound: boolean = false;

        if (colorCode[0] == '#') {
            if (colorCode.length === 4) {
                colorCode = '#' + colorCode[1] + colorCode[1] + colorCode[2] + colorCode[2] + colorCode[3] + colorCode[3];
            }

            colorCode = colorCode.slice(1);
            usePound  = true;
        }

        let num: number = parseInt(colorCode, 16);

        let r: number = (num >> 16) + amount;

        if (r > 255) {
            r = 255;
        } else if (r < 0) {
            r = 0;
        }

        let b: number = ((num >> 8) & 0x00FF) + amount;

        if (b > 255) {
            b = 255;
        } else if (b < 0) {
            b = 0;
        }

        let g: number = (num & 0x0000FF) + amount;

        if (g > 255) {
            g = 255;
        } else if (g < 0) {
            g = 0;
        }

        return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
    }
}
