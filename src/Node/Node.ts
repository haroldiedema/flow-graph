/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {EventEmitter}                                  from '@/Events/EventEmitter';
import {InputSocket}                                   from '@/Node/InputSocket';
import {NodeEdgeSocket, NodeInputSocket, NodeTemplate} from '@/Node/NodeTemplate';
import {OutputSocket}                                  from '@/Node/OutputSocket';

export class Node extends EventEmitter
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

    private dragStart: Vector2  = {x: 0, y: 0};
    private dragState: Vector2  = {x: 0, y: 0};
    private isDragging: boolean = false;

    constructor(public readonly id: string, private readonly template: NodeTemplate)
    {
        super();

        this.element            = this.createElement('div', ['node']);
        this.element.dataset.id = id;

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
        this.container.style.backgroundImage = 'linear-gradient(' + color + ', ' + this.adjustColor(color, -50) + ')';

        // Apply header text.
        this.headerTitle.innerHTML    = template.name;
        this.headerSubTitle.innerHTML = this.toCapitalizedWord(template.type);

        // Input sockets.
        if (template.hasEntryFlow !== false) {
            this.flowInput = new InputSocket(this.bodyIn, {type: 'entry', name: 'entry', label: ''});
        }
        (template.inputs || []).forEach((input: NodeInputSocket) => {
            this.inputs.push(new InputSocket(this.bodyIn, input));
        });

        // Output sockets.
        (template.outputs || []).forEach((output: NodeEdgeSocket) => {
            this.outputs.push(new OutputSocket(this.bodyOut, output));
        });

        this.bindDragControls();
    }

    /**
     * Returns the system name of this node.
     *
     * @returns {string}
     */
    public get systemName(): string
    {
        return this.template.systemName;
    }

    /**
     * Returns true if this node has an input flow socket.
     *
     * @returns {boolean}
     */
    public get hasInputSocket(): boolean
    {
        return typeof this.flowInput !== 'undefined';
    }

    public get inputFlowSocketPosition(): Vector2
    {
        return this.getPositionOf(this.flowInput.element);
    }

    public get outputSockets(): OutputSocket[]
    {
        return this.outputs;
    }

    /**
     * Returns the absolute position of the given element that is a child of this node.
     *
     * @param {HTMLElement} element
     * @returns {Vector2}
     */
    public getPositionOf(element: HTMLElement): Vector2
    {
        let offset: Vector2 = {x: element.offsetLeft, y: element.offsetTop};

        return {x: this.element.offsetLeft + offset.x, y: this.element.offsetTop + offset.y};
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

    private bindDragControls(): void
    {
        // Rebind event handlers so they can be unsubscribed.
        this.onHeaderMouseDown = this.onHeaderMouseDown.bind(this);
        this.onHeaderMouseUp   = this.onHeaderMouseUp.bind(this);
        this.onHeaderMouseMove = this.onHeaderMouseMove.bind(this);

        this.header.addEventListener('mousedown', this.onHeaderMouseDown);
        this.header.addEventListener('mouseup', this.onHeaderMouseUp);
        this.header.addEventListener('mousemove', this.onHeaderMouseMove);
    }

    private onHeaderMouseDown(e: MouseEvent): void
    {
        if (e.button !== 0) {
            return;
        }

        const bbox: DOMRect = this.element.getBoundingClientRect();

        this.isDragging = true;
        this.dragState  = {
            x: e.clientX - bbox.left,
            y: e.clientY - bbox.top,
        };
        this.dragStart  = {
            x: e.clientX - this.element.offsetLeft,
            y: e.clientY - this.element.offsetTop,
        };

        this.emit('drag-start');
    }

    private onHeaderMouseUp(e: MouseEvent): void
    {
        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;

        this.emit('drag-end');
    }

    private onHeaderMouseMove(e: MouseEvent): void
    {
        if (false === this.isDragging) {
            return;
        }

        const x = e.clientX - this.dragStart.x,
              y = e.clientY - this.dragStart.y;

        this.element.style.top  = y + 'px';
        this.element.style.left = x + 'px';
    }
}

type Vector2 = { x: number, y: number };
