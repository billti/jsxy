type Component = (props: Props) => VNode;
type Tag = Component | string;
type Props = {
    [index: string]: any;
};
type Children = any[];
type RefObj = {
    current: any;
};
type RefCallback = (el: Element) => void;
type VNode = {
    type: Tag;
    props: Props & {
        children: Children;
    };
    key: string | number | null;
    ref?: RefObj | RefCallback;
    _children?: any;
    _parent?: VNode;
    _dom?: Element;
    _domSibling?: Element;
};
/**
 * The JSX syntax gets compiled into calls to 'h'. For example, the JSX code
 * `return <div><h1>{3 + 4}</h1></div>` becomes the code:
 *
 *     return h("div", null, h("h1", null, 3 + 4))
 *
 * Note that children are strings, VNodes, or other expressions, e.g.
 *
 *      <h1 class="test" open>When you add {3 + 4} you <br/> get 7</h1>
 *
 * Turns into:
 *
 *     h("h1", { class: "test", open: true },
 *          "When you add ",
 *          3 + 4,
 *          " you ",
 *          h("br", null),
 *          " get 7"));
 */
export declare function h(type: Tag, props: Props | null, ...children: Children): VNode;
/**
 * Used in the <>...</> syntax calls as the parent. For example, the source code:
 *
 *     <><h1>{appName}</h1><Foo id='test'/></>
 *
 * Gets compiled into:
 *
 *     h(Fragment, null,
 *       h("h1", null, appName),
 *       h(Foo, { id: 'test' }))
 */
export declare function Fragment(props: any): any;
/**
 * Used to render a component into an HTML element, e.g.
 *
 *     render(<App id={appId} />, document.body);
 */
export declare function render(vnode: VNode, parentElem: HTMLElement): void;
export declare function useState(): void;
export declare function useEffect(): void;
export declare function useMemo(): void;
export declare function useRef(): void;
export {};
