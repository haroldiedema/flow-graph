/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {EventEmitter}                                            from '@/Events/EventEmitter';
import {InputSocket}                                             from '@/Node/InputSocket';
import {NodeEdgeSocket, NodeInputSocket, NodeTemplate, NodeType} from '@/Node/NodeTemplate';
import {OutputSocket}                                            from '@/Node/OutputSocket';

export const NODE_TYPE_ICONS: Map<NodeType, string>  = new Map();
export const NODE_TYPE_COLORS: Map<NodeType, string> = new Map();

NODE_TYPE_ICONS.set(NodeType.ACTION,
    'url(\'data:image/webp;base64,UklGRmQEAABXRUJQVlA4TFcEAAAvH8AHENXI2rb/cJzfhytP99y2bdu2atu2bYW1jcNtJtUn+K+V7L/XpMl6J91pp5rNKmg7nS2BpM37d74jkLTF+3YotgAgTOa4u9Y13KpD4gwOx/C0WyDJPTtEbkBznzYen4HbRoqanWMY/AR6EzCi2UpmSrpLFwZlKsnCCLwrMMqZV5vnm3vN8+ZlM6/o30EwQnE+la6/dH3BiCIYtaly7Vgki2XRI4XZghGMSJpOMp54TQ++8dvJ/raw3EorKElPLE6Sq2GJLBOVpKkhGHUR7IzjTjld3izs4v2Qf4Ml+ttyurPZSw+aNcTEy1yRNEtluWjFaRWlut9L6VZz6HoYllOcjni5uyFcnE930gZqYkcemCfNyH6zTDjdPhI3D+Ba6t34WezYhzCfwrRAvAmjIFH/F5u+JaLTaVUqrY5bIRzRAZ1qj1xIifKDIBgVobooovvNWuHa3ga3Uu6HuRSiC5ogGCUw2gP1sJCk0xpZJatljNasfNq2lzZWI3OhTZrWU6geYbQzBPEwamD0hlXyRDpMk4rJsZ0kTA+NaGr+9HVsUjF55NMdxiSMfhi1PCIuGC0RdCNsftZJj+Ig3djMI3UYc2ruZvNR0dOz+bm+CScYrYT6sTFMRj3hEiplJDHrZYPod8vXbLKxbRijMAb/tcdeoy16PSM0i02oYGUzi2CUqx82d5s74dbmyLRRNknd5TSHbGwDRjuMJhi1HPtPK5hee3EoCeFOc7cZVesRjNpQYjbJJrdZ+rfKFrfZ3WlCiNXDCCOlnqWY/i1i+tKvwcOhBKMW4SS6bca2SeN2IcnddCkEKgOjqdYQUnKt+DtJko2NpjsQLK8VKEZyx7NDqJ0ybLhlAggjGfjnj+1ueHiHowykMYgwwsF0b3Mr3NhcMcdol7T8vWwqyZ0Jwqbn499d0rL7OZIEx81wq+kkMcLByvz3f0JoNrXuKXvLnt1REk6kN9eVSDmRTMLUXKfY07WqfMRfAmWoVnoYnTCGYAzDmPCS62Z/oqj9zckkNOXkQ35M6g1CYPZNFEVJlkYYEwO6jtrXYET1GMOIe9G142CScTy1XjNnzERrB8EH0ZFBU9okjDqsZ5EsUncelIgoHE5ynDRqOQSp5HLlAYyYXFl9eBZPksQcTW+HuZgmvHnOE/vGlw6ZC+ZE09FxInV3d8iQ86D7YtLUMcS+M+NSDombM+V0oxYEsREfl9KZdDIxTOegyCiuNOo/6m+fzbhEE/sWRtyK1wXEX04XIZ2cLycqodp1OnUOKhypJ/8iWb7LitfjP4h9T8PosMibLNpvosjCrmCMt2sF5nw6m4yCw5Pae83talTX/L+fHpR7EEZ1/8yWcHPWvIfRA6Nl3EmEDXsxsQpHN97b0zHR3T/GIzl4ehzGAIy2MSV2puvH0JXNEOZg1CrHeM04/QZDaPAHDaOER9iVGSeyJz9p1lEY8Qz9Y/Dtc08o8QChmO8IocQYYz2LPiQIAA==\')');
NODE_TYPE_ICONS.set(NodeType.CONDITION,
    'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD00lEQVR4Xr2VTWhdRRTHfzNzX9Lgon5tK22JgiK0cdFKQ6GkSZtARB5FhW4suhARRF1kEdwI2sYuRN0IghIXFjSC0YTUSl5q61eDi2pMSVttm4/WSvJq/Uh638e9d+yBITdJe99N9SV/GOaeM4f7/8+ZM2ew1pIAb1cXvbsOYmUWmxWATvCbna/x8dZ1PDrwwmlkFhswqyFAyHu2bSD7XGs/vSdakVls8VdbhL4ZeeNGsvt2vMNnw+1cmR2XGbHFH4uovgDTsp+e7feS3bOlg9zIsygD2iCz2Ihf1iUOMNUU4LUdoK/pAbLtDU9wcuKgkKI0i2bxy7rESTzgVUtAnVdL29e/QuenH/Hed9C8qZsI5ofY4pd1iZN4oI7/hXgHuu8lNgF3AbVNBzisVIBVgAILiJ0x8GWHEFMErgC6WhnwgSngFHABgbKgccPZgFs/5eL9amWg5EYMIlDIWIqrwDTpqHnkDYphQP9AB1kgWHYjUkAYFUGxcNwqbgsj2L6B9uYKTUyTgIjSkiPgVpEphZB9uJPG+uT+4ZGA0AaLdh4RYS3Ut3DPxp1MRpZaSzIk1i9CxBpaNu8FfSjLq/TkXuYxIEwVEFFcJKAc/HV9QPPe+h+e3tHO7WtnKZb/SEyMxRJGAZo7+fnSIXY37APTnVXXRQzGIvASa4AyyoByuykEszy0fgt7tq3n5KU3sVNgoYIAB/rQHoxe7qa14Sl05v2s2U/vkU6yQOBVqgGr4p8VwzmaN9/PmfwH4P232jyb/5Ct9z3I92Oj7a6J/ZMswLojAJSC8T/7xcYaR7xMZmvjf0RekeHzo5T+5hiQSS9CE1+Vq4Uz4IGpAWNAq3QRUQRBiADPwPhFGPqK48df53mgvKwiVMQ70DVgQxj+Cc5Piq/yzoMAnnxcvmFiEoaOCjkvAr8BfuUMUAK1uDC9Whg8Cvk8/vSPvD2X5+IvOU4DlhuR2d3F4Zo6OHsOcrl58knXTcPKGbCuETloDeemYGYG/0gnbcAMMOtaeMSNuMMzcEHS/sXNyStew4gSSsVbW7e2iW9GhpgZo8s9SHlHHiZkAGMgN8CJYwnklTOgXCd0CPQcQRkCnzFHfo3KKH8uTzwod+YxeaqA+C2Ir5At8PtlGPmEYaBEOuaACXc8fky+TAHBwlugxC6IEOK0p6KUIjS9BqyKHaHy4+SApQpIqQF5CwALymVAEWN1BOhYgFVFWC0BRoOpKVO7hvknT2V8tF4dAbZ8jW/fene0MYoWNqISwXU/YFdaQGHwFZ4B7l6yHrj7X1hpAb7rWtOAIoZ15D5VxL8EF5g0lZhtSwAAAABJRU5ErkJggg==\')');
NODE_TYPE_ICONS.set(NodeType.SUCCESS,
    'url(\'data:image/webp;base64,UklGRmQDAABXRUJQVlA4TFcDAAAvH8AHEO8HoZEkR1L0Gj2e5w/Lu+2kAbGRJEVSVh/7dP7bQ88/Uwm3tm3Vyjr3C+7EdED/pZB75s59Zy+4tW2rVuYY390j91+GRT/+IVIDhVAAZZBTCKlb5C5nEMDP++Y/BQkgKksCJYPIlqgtlV+0JQJs3x/3fj+fTG+tUGyVgHJ4ueqYFYNJOQYyTMTYtvqjKsEWyFIXqRopIgBR1DYqIEGNAEVEWQrBCLSBfwQVqoKqUiECIqCqAJSAVAEoQQWoAAUlqECKqvH1fyF2Xee18zDJnrj0rPb39+//b9q9GF7pt2ctnr1jc+qY8vc3ZbSBKPj/bVhsxUhAojZCUK6nYCcN8JbJgXbmTBMgMgHmmdOaAJH5AT9gCNqTUQRHM+OmzrutDbAGCTCsuQdv4Ad8ZhKgWAM8My1QTNOgl7mvSdMEqGQ+UzABEpkEKIJ9UJystsdhnZgZx+Bk14z7dvgGLulBmr9P/XGddwxF4kiJYTeuUxxTZhAb53EDJcp1xM//cYlKE/RzDqsF3aRBIxLgIa2A+vP/dzj0hej1fuWc6TytTHbchzaDCUShycowPC0yXMcyxLJ2Tpn8mxmG4Tzte3s8O/mVSlEJ6Gtde1Zb9b8myJYk27StcWzbtm3btm3btm3b1vW959q2bRtPWHuuiPMBEf2fANjZL53D6XJ09nlcrvwky7iAx9Vf5OI5F3G49ptULPI6oL/xh1T0zU1AXx5DJCqVW4auIpZERCKiEpBXxZEIS76sBuQ18cRCMrIlt5DVJhALykkn1gHq+jQKAQW5Bw2AujGVkl9N6cOdLiydHZ0YmtOpOLTU5VOaAGPbGbb81v+0ZFFz6umq3m0HjP2n339kLOr9R18uDdeXr9qvu3swDJ969/nHW6bCQQAYyqPlNjP/rnJ2ADDueaFpZW31irlgFEZK6XitrK10ovYC1vGjz0ztHGyfsxaP3abnsXVwMP+0bz8mmDz02NLF1fkRSyYDn5Orq73GyQkgcOrIExtPLw8T9ofuXl4e38KngeCZg08d/fz9ff39/f3t7u/aIgxmtw1dA4P+9tbf3gSUc4cNPENCQ0ODLZLmAe3CMWOfsLAwt3u7AfXicSPfsADjAxvIYPmEsq5i8hLguLK2vr4KOy8A\')');
NODE_TYPE_ICONS.set(NodeType.FAILURE,
    'url(\'data:image/png;base64,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\')');

NODE_TYPE_COLORS.set(NodeType.ACTION, '#aaa');
NODE_TYPE_COLORS.set(NodeType.CONDITION, '#bc9');
NODE_TYPE_COLORS.set(NodeType.SUCCESS, '#8c9');
NODE_TYPE_COLORS.set(NodeType.FAILURE, '#c87');

export class Node extends EventEmitter
{
    public readonly element: HTMLElement;

    private readonly container: HTMLElement;
    private readonly header: HTMLElement;
    private readonly headerIcon: HTMLElement;
    private readonly headerText: HTMLElement;
    private readonly headerTitle: HTMLElement;
    private readonly idInput: HTMLInputElement;
    private readonly body: HTMLElement;
    private readonly bodyIn: HTMLElement;
    private readonly bodyOut: HTMLElement;

    private readonly flowInput: InputSocket;
    private readonly inputs: any[]  = [];
    private readonly outputs: any[] = [];

    private dragStart: Vector2  = {x: 0, y: 0};
    private dragState: Vector2  = {x: 0, y: 0};
    private isDragging: boolean = false;

    constructor(public id: string, private readonly template: NodeTemplate)
    {
        super();

        this.element            = this.createElement('div', ['node']);
        this.element.dataset.id = id;
        this.element.setAttribute('tabIndex', '1');

        this.container = this.createElement('div', ['container'], this.element);
        this.header    = this.createElement('div', ['header'], this.container);

        // Set icon.
        this.headerIcon                       = this.createElement('div', ['header-icon'], this.header);
        this.headerIcon.style.backgroundImage = NODE_TYPE_ICONS.get(template.type);

        // Header text & id input.
        this.headerText    = this.createElement('div', ['header-text'], this.header);
        this.headerTitle   = this.createElement('div', ['header-title'], this.headerText);
        this.idInput       = this.createElement<HTMLInputElement>('input', ['node-id-input'], this.headerText);
        this.idInput.value = id;

        // Body elements.
        this.body    = this.createElement('div', ['body'], this.container);
        this.bodyIn  = this.createElement('div', ['body-in'], this.body);
        this.bodyOut = this.createElement('div', ['body-out'], this.body);

        // Set element color.
        const color                          = NODE_TYPE_COLORS.get(template.type);
        this.container.style.backgroundImage =
            'linear-gradient(' + color + ', ' + this.adjustColor(color, -50) + ' 35%)';

        // Apply header text.
        this.headerTitle.innerHTML = template.name;

        // Input sockets.
        if (template.hasEntryFlow !== false) {
            this.flowInput = new InputSocket(this.bodyIn, {type: '', name: 'entry', label: ''});
        }
        (template.inputs || []).forEach((input: NodeInputSocket) => {
            this.inputs.push(new InputSocket(this.bodyIn, input));
        });

        // Output sockets.
        (template.outputs || []).forEach((output: NodeEdgeSocket) => {
            this.outputs.push(new OutputSocket(this.bodyOut, output));
        });

        this.idInput.addEventListener('change', () => {
            const newId = this.idInput.value.trim();

            if (newId === this.id) {
                return;
            }

            if (newId === '') {
                this.idInput.value = this.id;
            }

            const oldId        = this.id;
            this.idInput.value = newId;
            this.id            = newId;

            this.emit('id-changed', newId, oldId);
        });

        this.element.addEventListener('focus', () => this.emit('select'));
        this.element.addEventListener('blur', () => this.emit('deselect'));
        this.element.addEventListener('keyup', (ev) => {
            if (ev.key.toLowerCase() === 'delete') {
                this.emit('delete');
            }
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

    /**
     * Returns the position vector of the flow input socket of this node.
     *
     * @returns {Vector2}
     */
    public get inputFlowSocketPosition(): Vector2
    {
        return this.getPositionOf(this.flowInput.element);
    }

    /**
     * Returns the input sockets for this node.
     *
     * @returns {InputSocket[]}
     */
    public get inputSockets(): InputSocket[]
    {
        return this.inputs;
    }

    /**
     * Returns the output sockets for this node.
     *
     * @returns {OutputSocket[]}
     */
    public get outputSockets(): OutputSocket[]
    {
        return this.outputs;
    }

    /**
     * Sets the value of the input parameter by the given name.
     *
     * @param {string} name
     * @param value
     */
    public setInputValue(name: string, value: any): void
    {
        const input: InputSocket = this.inputs.find(i => i.name === name);
        if (! input) {
            console.warn(`Input socket "${name}" does not exists on "${this.systemName}".`);
        }

        input.value = value;
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
     * Creates a new HTML element by the given type.
     *
     * @param {string} type
     * @param {string[]} classList
     * @param {HTMLElement} parentNode
     * @returns {HTMLElement}
     * @private
     */
    private createElement<T>(type: string, classList: string[], parentNode?: HTMLElement): HTMLElement & T
    {
        const el = document.createElement(type);
        el.classList.add(...classList);

        if (parentNode) {
            parentNode.appendChild(el);
        }

        return el as HTMLInputElement & T;
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

        document.body.addEventListener('mouseup', this.onHeaderMouseUp);
        document.body.addEventListener('mousemove', this.onHeaderMouseMove);

        this.emit('drag-start');
    }

    private onHeaderMouseUp(): void
    {
        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;

        document.body.removeEventListener('mouseup', this.onHeaderMouseUp);
        document.body.removeEventListener('mousemove', this.onHeaderMouseMove);

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
