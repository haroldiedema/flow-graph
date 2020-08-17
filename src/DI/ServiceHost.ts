/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

const SERVICES = new Map();

class ServiceHostImpl
{
    /**
     * Registers the given service.
     *
     * @param {Function} constructor
     */
    public register(constructor: Function)
    {
        SERVICES.set(constructor, new (constructor as any)());
    }

    public has(constructor: Function)
    {
        return SERVICES.has(constructor);
    }

    public get<T>(constructor: Function): T
    {
        if (! this.has(constructor)) {
            console.error('The requested service does not exist:', constructor);
            throw new Error('Service does not exist.');
        }

        return SERVICES.get(constructor);
    }
}

export const ServiceHost = new ServiceHostImpl();
