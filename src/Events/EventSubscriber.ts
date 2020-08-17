/* Lux'Materia                                                .____                 /\ __  __      _           _
 *   WebGL-based Game Engine, powered by Electron             |    |    __ _____  __)/|  \/  |__ _| |_ ___ _ _(_)__ _
 *                                                            |    |   |  |  \  \/  / | |\/| / _` |  _/ -_) '_| / _` |
 * by Harold Iedema <harold@iedema.me>                        |    |___|  |  />    <  |_|  |_\__,_|\__\___|_| |_\__,_|
 * Copyright (c) 2020, all rights reserved                    |_______ \____//__/\_ \___________________________________
 * See LICENCE.txt for licencing information                          \/           */
'use strict';

import {EventEmitter} from './EventEmitter';

export class EventSubscriber
{
    constructor(
        private emitter: EventEmitter,
        public readonly name: string,
        private callback: (...any) => any,
        private isOnce: boolean = false
    ){
    }

    /**
     * Invokes the attached callback with the given arguments.
     */
    public emit(...args): void
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
