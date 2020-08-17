/* Lux'Materia                                                .____                 /\ __  __      _           _
 *   WebGL-based Game Engine, powered by Electron             |    |    __ _____  __)/|  \/  |__ _| |_ ___ _ _(_)__ _
 *                                                            |    |   |  |  \  \/  / | |\/| / _` |  _/ -_) '_| / _` |
 * by Harold Iedema <harold@iedema.me>                        |    |___|  |  />    <  |_|  |_\__,_|\__\___|_| |_\__,_|
 * Copyright (c) 2020, all rights reserved                    |_______ \____//__/\_ \___________________________________
 * See LICENCE.txt for licencing information                          \/           */
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
