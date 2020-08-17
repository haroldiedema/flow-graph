/* Lux'Materia                                                .____                 /\ __  __      _           _
 *   WebGL-based Game Engine, powered by Electron             |    |    __ _____  __)/|  \/  |__ _| |_ ___ _ _(_)__ _
 *                                                            |    |   |  |  \  \/  / | |\/| / _` |  _/ -_) '_| / _` |
 * by Harold Iedema <harold@iedema.me>                        |    |___|  |  />    <  |_|  |_\__,_|\__\___|_| |_\__,_|
 * Copyright (c) 2020, all rights reserved                    |_______ \____//__/\_ \___________________________________
 * See LICENCE.txt for licencing information                          \/           */
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
