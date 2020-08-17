/* Lux'Materia                                                .____                 /\ __  __      _           _
 *   WebGL-based Game Engine, powered by Electron             |    |    __ _____  __)/|  \/  |__ _| |_ ___ _ _(_)__ _
 *                                                            |    |   |  |  \  \/  / | |\/| / _` |  _/ -_) '_| / _` |
 * by Harold Iedema <harold@iedema.me>                        |    |___|  |  />    <  |_|  |_\__,_|\__\___|_| |_\__,_|
 * Copyright (c) 2020, all rights reserved                    |_______ \____//__/\_ \___________________________________
 * See LICENCE.txt for licencing information                          \/           */
'use strict';

import 'reflect-metadata';
import {ServiceHost} from 'Framework/DI/ServiceHost';

/**
 * Injects a service instance into the decorated property based on the defined type.
 *
 * @decorator
 */
export function Inject(constructor: any, propertyKey: string)
{
    const type = Reflect.getMetadata('design:type', constructor, propertyKey);

    if (! ServiceHost.has(type)) {
        throw new Error('The service requested by property "' + propertyKey + '" of "' + constructor.name + '" does not exist.');
    }

    constructor[propertyKey] = ServiceHost.get(type);
}
