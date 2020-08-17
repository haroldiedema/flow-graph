/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {EventEmitter} from './EventEmitter';

export class EventSubscriber
{
    constructor(
        private emitter: EventEmitter,
        public readonly name: string,
        private callback: (...any: any[]) => any,
        private isOnce: boolean = false
    ){
    }

    /**
     * Invokes the attached callback with the given arguments.
     */
    public emit(...args: any[]): void
    {
        this.callback(...args);
        if (this.isOnce) {
            this.emitter.off(this);
        }
    }

    /**
     * Unsubscribe this event subscriber.
     */
    public unsubscribe(): void
    {
        this.emitter.off(this);
    }
}
