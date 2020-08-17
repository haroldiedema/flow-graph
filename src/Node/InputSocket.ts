/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Node}                            from '@/Node/Node';
import {NodeEdgeSocket, NodeInputSocket} from '@/Node/NodeTemplate';
import {Socket, SocketDirection}         from '@/Node/Socket';

export class InputSocket extends Socket
{
    private labelElement: HTMLElement;
    private inputElement: HTMLInputElement | HTMLSelectElement;

    constructor(targetElement: HTMLElement, private data: NodeInputSocket)
    {
        super(targetElement, SocketDirection.INPUT);

        this.labelElement           = this.createElement('div', [], this.textElement);
        this.labelElement.innerHTML = data.label;

        switch (data.type) {
            case 'string':
                this.iconElement.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAABXUlEQVRIid3WPUtcURAG4EdZxYAKLqawEAs7bS0Vq/wBq9ha5l+kCK4W/gMLwY8uooZYGMFCW2tBBJusYikhaJq1OCNer3eDC94V9oXhznDmzMt8nHMPnYheLKGOxhvLb9SCQ60EgrzUlJRJXq66Qikd3e0ggUpG7yqJo0EbM3p3oj5cYKGFWF9wJs5MER5HMIsF/MGHsIelQ32MTQzF2nf8CJ8B3GG+Wfwioh38ytgfMYGj8P2KtdCvPA3SCdZbITrHqpeYC98bfMYnjGbWN3BaRFRRjB6pDHkc4J9Upl38za3feSr3MzQjukY1Y49hMoLcSj2bxX5uXzX2FqKodMvSBJHqfx0+W/gW+k9pKAYz+y6l/hXGLyIaxz2mwt6TBqQfIziU+rge2cK0VMpRz/FfIliRRvm12JayzaOBRvb27py7rh76dAnxZ+Jbpz2/8kXSJViTHhKlPk46Cw9Uz8hd1xH5NQAAAABJRU5ErkJggg==\')';
                this.inputElement                      = this.createElement<HTMLInputElement>('input', [],
                    this.textElement);
                this.inputElement.setAttribute('type', 'text');
                break;
            case 'number':
                this.iconElement.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAu0lEQVRIid2VXQrCMBCEv4r0Jt5Cb2d/vKfpBfRBn+pLAmm6TZauxZ+BpYQMM8kMpPBPqIELMADjynFA77Vm6A3C6XSSgeXk6QxBtIoMRjm51agAdm8WnWG/5GzAJInNb5AzCIXFaIE70BR4asF0/QQOwCPDm+hsHlF6itINGuAGnDO8xcjUWRagjkhTqMTROaMrVOJ8T8maQiXO50oOT+zRIH7yXydtdpG7dVrJoPYmziB89eLiL/M38QJjtZXHfnE6qQAAAABJRU5ErkJggg==\')';
                this.inputElement                      = this.createElement<HTMLInputElement>('input', [],
                    this.textElement);
                this.inputElement.setAttribute('type', 'number');
                break;
            case 'boolean':
                this.iconElement.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAvklEQVRIie3W0QnCMBDG8b9SBxCnECexziKuIu5SHEBHkA7Q+igOoA/1SS2N1x70jij2g7yE434hKU1gyL9lBZyByniUwLINLh3Q5yjq0KgBV4pd6ZOXN3aGxESDE2G+eQR9ExzhT251arYK3p9+VxLgZNlXC2+UdabwFLjEgHfKOlN4Dtz4/EvMPOG9gN6BhScs1W+VdabwFZjFgNfKOlM4ByYx4NZXhSesTdBXuha9XyLB7XR0tA6OvYd8YR4/f35FQU+kTwAAAABJRU5ErkJggg==\')';
                this.inputElement                      = this.createElement<HTMLInputElement>('input', [],
                    this.textElement);
                this.inputElement.setAttribute('type', 'checkbox');
                break;
            case 'select':
                this.iconElement.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAATklEQVRIiWNgGAUEACMa/z+1zWWikoE4wdC3gAWHOHrcEAsw4nD4BhEMwLzMiMZHBziDdMB9gO4ykiN/wH0wGgfDOKNRq16gvQ9GAUEAAE8SBzOvUho6AAAAAElFTkSuQmCC\')';
                this.inputElement                      = this.createElement<HTMLSelectElement>('select', [],
                    this.textElement);
                Object.keys((data.items || {})).forEach((value: string) => {
                    const opt     = this.createElement<HTMLOptionElement>('option', [], this.inputElement);
                    opt.innerHTML = data.items[value].toString();
                    opt.setAttribute('value', value);
                });
                break;
        }
    }
}
