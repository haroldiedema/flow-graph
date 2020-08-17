/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Service}      from '@/DI/Service';
import {NodeTemplate} from '@/Node/NodeTemplate';

@Service
export class NodeRegistry
{
    private templates: Map<string, NodeTemplate> = new Map();

    /**
     * Registers the given node template within the registry.
     *
     * @param {NodeTemplate} template
     * @returns {this}
     */
    public add(template: NodeTemplate): this
    {
        this.templates.set(template.systemName, template);

        return this;
    }

    /**
     * Returns a node template by the given system name.
     *
     * @param {string} systemName
     * @returns {NodeTemplate}
     */
    public get(systemName: string): NodeTemplate
    {
        return this.templates.get(systemName);
    }

    /**
     * Returns true if a template with the given system name exists.
     *
     * @param {string} systemName
     * @returns {boolean}
     */
    public has(systemName: string): boolean
    {
        return this.templates.has(systemName);
    }

    /**
     * Returns all registered node templates.
     *
     * @returns {NodeTemplate[]}
     */
    public get all(): NodeTemplate[]
    {
        return Array.from(this.templates.values());
    }
}
