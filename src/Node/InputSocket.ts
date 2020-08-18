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
            case '':
                this.iconElement.style.backgroundImage = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAH5SURBVEiJ7ZTPalNBFMa/M3fSUhvTcm+iBjc+QWoQRNBeLBq1vkFpwCewKi5cZ+tGmj5CxWxduFBx09ZY3Hi52foK+QPaIu29cz43RtKQYKBm1281zHzz/YYznCMkMU2ZqaafAaYOWHn0/G1YfXxzagBVfWBM5v2t6saNqQAAoFwuZ62X+Riub1z/7wAS4vs+ri4tnTee/bS8/uTasEcGGk3WXrwsHh/pZSAtqnOXCC0kigKcBgr6VLeoygV1LueU2Yz1ZpbDcB4A2u024jj+wSS9vdOoRyMBtca7wPtlA9rUF5hAwUDAACoBgUAEAYAAAh/8swbm+gF9iGMa7m3X4+EScSZJ6KxykC40pIAiQhEQMn625PN5lEqlnGfszsrasyvDABwn5+ip0qhHHRpSBEmCoFAIAkIAo2GEVaMZALCD+7NzKY9UaWhoHKkwBEgRkpC/1wn2w08A2u02Wq3WoUv0zl5j8/sJgNRqZrWD+VlY3zEtQvWiABcSagFEoOp8VS5SdUGdyymZtdYiDEMAQKfTQRzHh6mmdz836l8HyzyupP9UWH2aVCoV2+12EUXRQZLyXvPNq/1Bjx13eVL1ej1EUXTAxN1vNjb3h89PCaB8i6KfqsnqbmPryyjHqTrZGPvBJe7h7uut5jjPqf5gokdMNf0MMIl+Az2oCQS/ILc5AAAAAElFTkSuQmCC\')';
                break;
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

    public get name(): string
    {
        return this.data.name;
    }

    public get value(): any
    {
        switch (this.data.type) {
            case 'string':
            case 'select':
                return this.inputElement.value;
            case 'number':
                return parseFloat(this.inputElement.value);
            case 'boolean':
                return !! (this.inputElement as HTMLInputElement).checked;
        }

        return undefined;
    }

    public set value(v: any)
    {
        switch (this.data.type) {
            case 'string':
            case 'select':
            case 'number':
                this.inputElement.value = v;
                break;
            case 'boolean':
                (this.inputElement as HTMLInputElement).checked = !!v;
                break;
        }
    }
}
