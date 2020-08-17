/* FlowGraph                                                                   ___ _             ___               _
 *   An interactive zero-dependency flow graph editor                         | __| |_____ __ __/ __|_ _ __ _ _ __| |_
 *                                                                            | _|| / _ \ V  V / (_ | '_/ _` | '_ \ ' \
 * by Harold Iedema <harold@iedema.me>                                        |_| |_\___/\_/\_/ \___|_| \__,_| .__/_||_|
 * Licensed under MIT.                                                                                       |*/
'use strict';

import {Inject}          from '@/DI/Inject';
import {Service}         from '@/DI/Service';
import {EventEmitter}    from '@/Events/EventEmitter';
import {NODE_TYPE_ICONS} from '@/Node/Node';
import {NodeRegistry}    from '@/Node/NodeRegistry';
import {NodeTemplate}    from '@/Node/NodeTemplate';
import {Viewport}        from '@/Viewport/Viewport';

@Service
export class FuzzyFinder extends EventEmitter
{
    @Inject private readonly viewport: Viewport;
    @Inject private readonly registry: NodeRegistry;

    private element: HTMLElement;
    private searchField: HTMLInputElement;
    private searchResults: HTMLElement;
    private resultFunc: (systemName: string) => any;

    /**
     * Opens the fuzzy-finder and the given location.
     *
     * @param {Vector2} point
     * @returns {Promise<string>}
     */
    public open(point: Vector2): Promise<string>
    {
        if (!this.element) {
            this.initialize();
        }

        // Clear out the search results.
        this.searchResults.innerHTML = '';

        // Populate the options with registered nodes.
        this.registry.all.forEach((tpl: NodeTemplate) => this.createOption(tpl));

        // Position the pop-up.
        this.element.style.display = 'flex';
        this.element.style.left    = point.x + 'px';
        this.element.style.top     = point.y + 'px';

        return this.handleFuzzyFinderResponse();
    }

    private handleFuzzyFinderResponse(): Promise<string>
    {
        return new Promise((resolve) => {
            // Register a one-time mouse down event on anything but the finder pop-up to close it.
            const cancel = (function(e: MouseEvent) {
                if (e.target !== this.element && !(e.target as HTMLElement).closest('.flow-graph--fuzzy-finder')) {
                    this.element.style.display = 'none';
                    this.emit('cancel');
                    document.removeEventListener('click', cancel);
                    resolve(undefined);
                }
            }).bind(this);
            document.addEventListener('mousedown', cancel);

            // Focus the search field.
            this.element.getElementsByTagName('input')[0].focus();

            this.resultFunc = resolve;
        });
    }

    private createOption(tpl: NodeTemplate): void
    {
        const el      = this.createElement('div', ['fgff-search-item'], this.searchResults);
        const icon    = this.createElement('div', ['fgff-icon'], el);
        const item    = this.createElement('div', ['fgff-item'], el);
        const name    = this.createElement('div', ['fgff-name'], item);
        const sysName = this.createElement('div', ['fgff-sys-name'], item);

        name.innerHTML    = tpl.name;
        sysName.innerHTML = tpl.systemName;

        if (tpl.description) {
            el.setAttribute('title', tpl.description);
        }

        el.dataset.name       = tpl.name.toString().trim().toLowerCase();
        el.dataset.systemName = tpl.systemName.toString().trim().toLowerCase();

        icon.style.backgroundImage = NODE_TYPE_ICONS.get(tpl.type);

        el.addEventListener('click', () => {
            this.element.style.display = 'none';
            this.resultFunc(tpl.systemName);
        });
    }

    private initialize(): void
    {
        this.element     = this.createElement('div', ['flow-graph--fuzzy-finder'], document.body);
        this.searchField = this.createElement<HTMLInputElement>('input', [], this.element);

        this.searchResults = this.createElement('div', ['fgff-search-results'], this.element);

        this.searchField.setAttribute('placeholder', 'Search...');
        this.searchField.addEventListener('keyup', () => {
            const pattern = this.searchField.value.toString().toLowerCase().trim();
            const items   = Array.from(this.searchResults.getElementsByClassName('fgff-search-item'));

            if (pattern === '') {
                items.forEach((item: HTMLElement) => item.style.display = 'flex');
                return;
            }

            items.forEach((item: HTMLElement) => {
                item.style.display = (item.dataset.name.indexOf(pattern) === -1 && item.dataset.systemName.indexOf(pattern) === -1)  ? 'none' : 'flex';
            });
        });
    }

    /**
     * Creates a new HTML element by the given type.
     *
     * @param {string} type
     * @param {string[]} classList
     * @param {HTMLElement} parentNode
     * @returns {HTMLElement}
     * @private
     */
    private createElement<T>(type: string, classList: string[], parentNode?: HTMLElement): HTMLElement & T
    {
        const el = document.createElement(type);
        el.classList.add(...classList);

        if (parentNode) {
            parentNode.appendChild(el);
        }

        return el as HTMLElement & T;
    }
}

type Vector2 = { x: number, y: number };
