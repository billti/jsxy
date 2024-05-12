// Copyright (c) Bill Ticehurst
// Licensed under the MIT License.

type Component = (props: Props) => VNode; // Signature for a functional component
type Tag = Component | string;            // A component function, or a string such as "div"
type Props = { [index: string]: any };    // The set of properties passed to a component
type Children = any[];                    // The child nodes for a VNode
type RefObj = { current: any };           // Used in <foo ref={obj_from_useRef} />
type RefCallback = (el: Element) => void; // Used in <foo ref={el => useElement(el)} />

// A VNode is what all components render into via 'h' calls. They form a tree
// with the rendered element being the 'root' VNode. On re-render the old VNode
// tree is compared to the new, and only the changes are applied to the DOM.
type VNode = {
  type: Tag;
  props: Props & { children: Children };
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
export function h(
  type: Tag,
  props: Props | null,
  ...children: Children
): VNode {
  // Pull out ref and key from props
  // Add children into the props
  // return a VNode
  throw "Not implemented";
}

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
export function Fragment(props: any) {
    return props.children;
}

/**
 * Used to render a component into an HTML element, e.g.
 *
 *     render(<App id={appId} />, document.body);
 */
export function render(vnode: VNode, parentElem: HTMLElement): void {
  throw "Not implemented";
}

function diff() {
  // This is where most of the magic happens, comparing old and new VNode
  // trees and add/removing/updating DOM elements and attributes to match.
  throw "Not implemented";
}

export function useState() {
  throw "Not implemented";
}

export function useEffect() {
  throw "Not implemented";
}

export function useMemo() {
  throw "Not implemented";
}

export function useRef() {
  throw "Not implemented";
}
