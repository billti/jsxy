// Copyright (c) Bill Ticehurst
// Licensed under the MIT License.

// Note: May want to move the types into a separate .d.ts for readability
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
  props: Props & { children: Children }; // Normalized props should always have children
  key: string | number | null;
  ref?: RefObj | RefCallback;
  // TODO: Check we need the below, and remove if not (else comment if yes)
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
  // Pull out ref and key from props if present, and extract the rest
  const normalizedProps: Props & { children: Children } = { children: [] };
  let key = null;
  let ref = null;

  for (const i in props) {
    if (i === "key") {
      key = props[i];
    } else if (i === "ref") {
      ref = props[i];
    } else {
      normalizedProps[i] = props[i];
    }
  }

  // The children args become the 'children' value on the props.
  // If more than 1, it becomes and array, else it's just the child value directly
  switch (children.length) {
    case 0:
      // Already initialized
      break;
    case 1:
      props.children = children[0];
      break;
    default:
      props.children = children;
  }

  return {
    type,
    props: normalizedProps,
    key,
    ref,
  };
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
  // If it's already a normalized VNode, then the children are on the props.
  return props.children;
}

/**
 * Used to render a component into an HTML element, e.g.
 *
 *     render(<App id={appId} />, document.body);
 */
export function render(vnode: VNode, parentElem: HTMLElement): void {
  // If rendered into previously, the old VNode will be set on the DOM element
  const oldVNode: VNode | undefined = parentElem["_children"];

  // Set the DOM element to the new VNode
  // TODO: Preact always uses a new Fragment here via "createElement(Fragment, null, [vnode]);". Why?
  parentElem["_children"] = vnode;

  // TODO: Implement these
  const commitQueue = [];
  const refQueue = [];

  // TODO: Some params used in Preact not included here. Do we need them?
  // Provide a good explanations here of exactly what this will do.
  diff(parentElem, vnode, oldVNode, commitQueue, refQueue);

  // TODO: Implement
  // Provide a good explanations here of exactly what this will do.
  commitRoot(commitQueue, vnode, refQueue);
}

// Note: May want to move diff and commitRoot into separate files for readability
function diff(
  parentElem: HTMLElement,
  vnode: VNode,
  oldVNode: VNode | undefined,
  commitQueue: any[],
  refQueue: any[]
) {
  // This is where most of the magic happens, comparing old and new VNode
  // trees and add/removing/updating DOM elements and attributes to match.
  throw "Not implemented";
}

function commitRoot(commitQueue: any[], vnode: VNode, refQueue: any[]) {
    throw "Not implemented";
}

// Note: May want to move the below into a separate hooks.ts for readability
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
