/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}       from '@/DI/Inject';
import {Service}      from '@/DI/Service';
import {EventEmitter} from '@/Events/EventEmitter';
import {Node}         from '@/Node/Node';
import {OutputSocket} from '@/Node/OutputSocket';
import {Viewport}     from '@/Viewport/Viewport';

@Service
export class EdgeLayer extends EventEmitter
{
    @Inject private readonly viewport: Viewport;

    private isDrawingEdge: boolean;
    private startingEdge: SVGPathElement;
    private currentEdge: SVGPathElement;

    public initialize(): void
    {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp   = this.onMouseUp.bind(this);
    }

    /**
     * Shows the edge layer on the viewport.
     */
    public show(): void
    {
        this.viewport.edgeLayer.style.display = 'block';
    }

    /**
     * Hides the edge layer from the viewport.
     */
    public hide(): void
    {
        this.viewport.edgeLayer.style.display = 'none';
    }

    public refresh(nodes: Node[], edges: Map<string, Map<string, string>>): void
    {
        // Clear the drawing area.
        this.viewport.edgeLayer.innerHTML = '';

        // Draw node IO.
        nodes.forEach((node: Node) => {
            if (node.hasInputSocket) {
                this.drawInputSocket(node);
            }

            node.outputSockets.forEach((socket: OutputSocket) => {
                this.drawOutputSocket(node, socket);
            });
        });

        // Draw connections.
        edges.forEach((exitStates: Map<string, string>, sourceNode: string) => {
            exitStates.forEach((targetNode: string, sourceSocket: string) => {
                const source = this.viewport.edgeLayer.getElementsByClassName(`${sourceNode}--${sourceSocket}`)[0],
                      target = this.viewport.edgeLayer.getElementsByClassName(`${targetNode}--entry`)[0];

                this.connect(source as SVGPathElement, target as SVGPathElement);
            });
        });
    }

    /**
     * Connects the two socket elements together.
     *
     * @param {SVGPathElement} source
     * @param {SVGPathElement} target
     */
    private connect(source: SVGPathElement, target: SVGPathElement): void
    {
        const b1 = source.getBoundingClientRect(),
              c1 = source.getScreenCTM(),
              x1 = (b1.x - c1.e) + (b1.width - 2),
              y1 = (b1.y - c1.f) + (b1.height / 2),
              b2 = target.getBoundingClientRect(),
              c2 = target.getScreenCTM(),
              x2 = (b2.x - c2.e) + 1,
              y2 = (b2.y - c2.f) + (b2.height / 2);

        const CURVE = 180;

        // Organic / curved edge
        let c1X, c1Y, c2X, c2Y;
        if (x2 - 5 < x1) {
            let curveFactor = (x1 - x2) * CURVE / 200;
            if (Math.abs(y2 - y1) < 32) {
                // Loopback
                c1X = x1 + curveFactor;
                c1Y = y1 - curveFactor;
                c2X = x2 - curveFactor;
                c2Y = y2 - curveFactor;
            } else {
                // Stick out some
                c1X = x1 + curveFactor;
                c1Y = y1 + (y2 > y1 ? curveFactor : -curveFactor);
                c2X = x2 - curveFactor;
                c2Y = y2 + (y2 > y1 ? -curveFactor : curveFactor);
            }
        } else {
            // Controls halfway between
            c1X = x1 + (x2 - x1) / 2;
            c1Y = y1;
            c2X = c1X;
            c2Y = y2;
        }

        const edge = this.drawPath([
            `M ${x1}, ${y1}`,
            `C ${c1X} ${c1Y} ${c2X} ${c2Y} ${x2} ${y2}`,
        ]);

        edge.setAttribute('fill', 'transparent');
        edge.setAttribute('stroke', '#fff');
        edge.setAttribute('stroke-width', '2');

        source.setAttribute('fill', '#fff');
        target.setAttribute('fill', '#fff');
    }

    /**
     * Invoked when the mouse moves over the graph while the user is currently connecting one socket to another.
     *
     * @param {MouseEvent} e
     */
    private onMouseMove(e: MouseEvent)
    {
        if (!this.isDrawingEdge) {
            return;
        }

        const c = this.startingEdge.getScreenCTM(),
              x = e.clientX - c.e,
              y = e.clientY - c.f;

        this.currentEdge.setAttribute('d', [
            `M ${this.currentEdge.dataset.x},${this.currentEdge.dataset.y}`,
            `L ${x},${y}`,
        ].join(' '));
    }

    /**
     * Invoked when the user releases a mouse button while connecting one socket to another.
     *
     * @param {MouseEvent} e
     */
    private onMouseUp(e: MouseEvent)
    {
        if (!this.isDrawingEdge) {
            return;
        }

        this.isDrawingEdge = false;

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseMove);

        // Find the entry socket.
        let dropTarget: SVGPathElement;
        if (e.target instanceof SVGPathElement) {
            dropTarget = e.target as SVGPathElement;
        } else {
            const node: HTMLElement = (e.target as HTMLElement).closest('.node');
            if (node) {
                dropTarget = this.viewport.edgeLayer.getElementsByClassName(
                    node.dataset.id + '--entry',
                )[0] as SVGPathElement;
            }
        }

        if (!dropTarget) {
            const point = {
                x: e.clientX,
                y: e.clientY,
            };
            this.emit(
                'connect-via-fuzzy-finder',
                this.startingEdge.dataset.nodeId,
                this.startingEdge.dataset.name,
                point,
                this.viewport.getScreenToGraphCoordinates(point),
            );
            return this.stopDrawingEdge();
        }

        let source, target;

        // From output to input.
        if (this.startingEdge.classList.contains('socket--is-output')) {
            // Ensure the target is an output socket.
            if (false === dropTarget.classList.contains('socket--is-input')) {
                return this.stopDrawingEdge();
            }

            source = this.startingEdge;
            target = dropTarget;
        }

        // From input to output.
        if (this.startingEdge.classList.contains('socket--is-input')) {
            // Ensure the target is an output socket.
            if (false === dropTarget.classList.contains('socket--is-output')) {
                return this.stopDrawingEdge();
            }

            source = dropTarget;
            target = this.startingEdge;
        }

        // Ensure the source node isn't the same as the target node.
        if (source.dataset.nodeId === target.dataset.nodeId) {
            return;
        }

        this.emit('new-connection', {
            sourceNode:   source.dataset.nodeId,
            sourceSocket: source.dataset.name,
            targetNode:   target.dataset.nodeId,
            targetSocket: target.dataset.name,
        });

        this.stopDrawingEdge();
    }

    private stopDrawingEdge(): void
    {
        this.currentEdge.remove();
        this.currentEdge   = null;
        this.startingEdge  = null;
        this.isDrawingEdge = false;
    }

    private drawInputSocket(node: Node): void
    {
        const pos = node.inputFlowSocketPosition;

        pos.x -= 28;
        pos.y += 4;

        const socket = this.drawPath([
            `M ${pos.x},${pos.y}`,
            'l 16,8',
            'l -16,8',
            'Z',
        ]);

        this.applySocketAttributes(socket, false);

        socket.dataset.nodeId = node.id;
        socket.dataset.name   = 'entry';

        socket.classList.add('socket--is-input');
        socket.classList.add(node.id + '--entry');
    }

    private drawOutputSocket(node: Node, sock: OutputSocket): void
    {
        const p = node.getPositionOf(sock.element),
              b = sock.element.getBoundingClientRect(),
              x = Math.floor(p.x + b.width) + 10,
              y = Math.floor(p.y) + 4;

        const socket = this.drawPath([
            `M ${x},${y}`,
            'l 16,8',
            'l -16,8',
            'Z',
        ]);

        this.applySocketAttributes(socket, true);

        socket.classList.add('socket--is-output');
        socket.classList.add(node.id + '--' + sock.name);

        socket.dataset.nodeId = node.id;
        socket.dataset.name   = sock.name;
    }

    private applySocketAttributes(path: SVGPathElement, canDrawEdge: boolean): void
    {
        path.setAttribute('stroke', 'rgb(200, 200, 200)');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'transparent');
        path.setAttribute('style', 'pointer-events: all');

        if (canDrawEdge) {
            path.addEventListener('mousedown', () => {
                this.isDrawingEdge = true;
                this.startingEdge  = path;
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);

                const b = path.getBoundingClientRect(),
                      c = path.getScreenCTM(),
                      x = (b.x - c.e) + (b.width),
                      y = (b.y - c.f) + (b.height / 2);

                this.currentEdge           = this.drawPath([]);
                this.currentEdge.dataset.x = x.toString();
                this.currentEdge.dataset.y = y.toString();
                this.currentEdge.setAttribute('fill', 'transparent');
                this.currentEdge.setAttribute('stroke', '#fff');
            });
        }
    }

    /**
     * Draws an SVG path onto the edge layer and returns the newly created path-element.
     *
     * @param {SVGPathCommand[]} commands
     * @returns {SVGPathElement}
     */
    private drawPath(commands: SVGPathCommand[]): SVGPathElement
    {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        path.setAttribute('d', commands.join(' '));

        this.viewport.edgeLayer.appendChild(path);

        return path;
    }
}

type SVGPathCommand = string | number;

export interface NewConnectionEvent
{
    sourceNode: string;
    sourceSocket: string;
    targetNode: string;
    targetSocket: string;
}
