/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import 'reflect-metadata';
import {ServiceHost} from './ServiceHost';

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
