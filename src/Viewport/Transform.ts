/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

export class Transform
{
    public x: number = 0;
    public y: number = 0;

    public scale: number = 1;

    /**
     * Applies the current transformation to the given element.
     *
     * @param {HTMLElement} element
     */
    public applyTransformation(element: HTMLElement | SVGElement): void
    {
        element.style.transformOrigin = '0 0 0 ';
        element.style.transform       = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.x}, ${this.y})`;
    }
}
