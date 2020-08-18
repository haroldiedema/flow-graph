/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Service}      from '@/DI/Service';
import {EventEmitter} from '@/Events/EventEmitter';
import {Transform}    from '@/Viewport/Transform';

@Service
export class Viewport extends EventEmitter
{
    private _element: HTMLElement;
    private _background: HTMLElement;
    private _edges: SVGElement;
    private _workspace: HTMLElement;
    private _size: Rect       = {width: 0, height: 0};
    private _isValid: boolean = false;

    private _isPanning: boolean   = false;
    private _dragState: Vector2   = {x: 0, y: 0};
    private _transform: Transform = new Transform();

    /**
     * Initializes the viewport with the given HTML element.
     *
     * @param {HTMLElement} element
     */
    public initialize(element: HTMLElement): void
    {
        this._element = element;
        this._element.classList.add('flow-graph');
        this._element.innerHTML = '';

        this._background = document.createElement('div');
        this._edges      = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this._workspace  = document.createElement('div');

        this._background.classList.add('background');
        this._edges.classList.add('edge-layer');
        this._workspace.classList.add('workspace');

        this._element.appendChild(this._background);
        this._element.appendChild(this._edges);
        this._element.appendChild(this._workspace);

        // Set-up edge layer SVG view-box.
        this._edges.setAttribute('viewBox', '-100000 -100000 200000 200000');

        // Re-bind event listeners so they can be unsubscribed properly.
        this.onMouseDown   = this.onMouseDown.bind(this);
        this.onMouseUp     = this.onMouseUp.bind(this);
        this.onMouseMove   = this.onMouseMove.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        // Listen for mouse events.
        element.addEventListener('mousedown', this.onMouseDown);
        element.addEventListener('mouseup', this.onMouseUp);
        element.addEventListener('mousemove', this.onMouseMove);
        element.addEventListener('contextmenu', this.onContextMenu);

        this.watchElementBoundingBox();
    }

    /**
     * Returns the workspace element which contains all the nodes.
     *
     * @returns {HTMLElement}
     */
    public get workspace(): HTMLElement
    {
        return this._workspace;
    }

    /**
     * Returns the edge layer element which contains all sockets & edges.
     *
     * @returns {SVGElement}
     */
    public get edgeLayer(): SVGElement
    {
        return this._edges;
    }

    /**
     * Translates the given coordinates to graph space.
     *
     * @param {Vector2} point
     * @returns {Vector2}
     */
    public getScreenToGraphCoordinates(point: Vector2): Vector2
    {
        const bbox: DOMRect  = this._element.getBoundingClientRect();

        return {
            x: (point.x - bbox.left) - this._transform.x,
            y: (point.y - bbox.top) - this._transform.y,
        }
    }

    /**
     * Emits the 'open-fuzzy-finder' event with 2 arguments:
     *  - <Vector2> The mouse position on the screen, relative inside the viewport;
     *  - <Vector2> The absolute position on the graph of where to place a node, should one be selected in the finder.
     *
     * @param {MouseEvent} e
     * @returns {boolean}
     * @private
     */
    private onContextMenu(e: MouseEvent): boolean
    {
        this.emit('open-fuzzy-finder', {
            x: e.clientX,
            y: e.clientY
        }, this.getScreenToGraphCoordinates({x: e.clientX, y: e.clientY}));

        e.preventDefault();

        return false;
    }

    /**
     * Invoked when a mouse button is pressed down.
     *
     * @param {MouseEvent} ev
     * @private
     */
    private onMouseDown(ev: MouseEvent): void
    {
        // Abort if the user holds the mouse down on anything BUT the background of the viewport element.
        if (ev.button !== 0 || ev.target !== this._background) {
            return;
        }

        const bbox = this._element.getBoundingClientRect();

        this._isPanning = true;
        this._dragState = {
            x: ev.clientX - bbox.left,
            y: ev.clientY - bbox.top,
        };
    }

    /**
     * Invoked when a mouse button is released.
     *
     * @param {MouseEvent} ev
     * @private
     */
    private onMouseUp(ev: MouseEvent): void
    {
        if (this._isPanning) {
            this._isPanning = false;
            this._dragState = {x: 0, y: 0};
        }
    }

    /**
     * Invoked when the mouse is moved over the viewport element.
     *
     * @param {MouseEvent} ev
     * @private
     */
    private onMouseMove(ev: MouseEvent): void
    {
        if (!this._isPanning) {
            return;
        }

        const bbox: DOMRect  = this._element.getBoundingClientRect();
        const point: Vector2 = {
            x: ev.clientX - bbox.left,
            y: ev.clientY - bbox.top,
        };

        const dx = point.x - this._dragState.x,
              dy = point.y - this._dragState.y;

        this._transform.x += dx;
        this._transform.y += dy;

        this._transform.applyTransformation(this._background);
        this._transform.applyTransformation(this._edges);
        this._transform.applyTransformation(this._workspace);

        this._dragState = point;
    }

    /**
     * Watches for changes in the bounding box of the viewport element.
     *
     * @private
     */
    private watchElementBoundingBox(): void
    {
        // Ensure the element is still visible.
        if (!this._element || !this._element.parentNode) {
            // Reschedule next iteration.
            setTimeout(() => this.watchElementBoundingBox(), 500);
        }

        const bbox = this._element.getBoundingClientRect();

        // Check if the actual bounding box differs from the stored one.
        if (this._size.width !== bbox.width || this._size.height !== bbox.height) {
            this._size.width  = bbox.width;
            this._size.height = bbox.height;

            if (this._size.width < 320 || this._size.height < 200) {
                console.warn(`FlowGraph DOM element is too small (${bbox.width}, ${bbox.height}).`);
                this._isValid = false;
            } else {
                this._isValid = true;
            }
        }

        // Reschedule next iteration.
        setTimeout(() => this.watchElementBoundingBox(), 500);
    }
}

type Rect = { width: number, height: number };
type Vector2 = { x: number, y: number };
