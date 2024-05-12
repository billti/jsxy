// Copyright (c) Bill Ticehurst
// Licensed under the MIT License.
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
export function h(type, props, ...children) {
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
export function Fragment(props) {
    return props.children;
}
/**
 * Used to render a component into an HTML element, e.g.
 *
 *     render(<App id={appId} />, document.body);
 */
export function render(vnode, parentElem) {
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
