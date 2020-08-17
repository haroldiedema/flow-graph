/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {ServiceHost} from './ServiceHost';

/**
 * Registers the given constructor as a service.
 * Use the @Inject annotation on class properties to dynamically inject a singleton instance of the registered service.
 * The property type is used to determine which service instance should be injected.
 *
 * @decorator
 */
export function Service(constructor: Function)
{
    ServiceHost.register(constructor);
}
