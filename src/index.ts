// Copyright (c) Bill Ticehurst
// Licensed under the MIT License.

// *****************************************************************
// The below are the various types used throughout the implmentation
// *****************************************************************

type Component = (props: Props) => VNode; // Signature for a functional component
type Tag = Component | string | null; // A component function, or a string such as "div", or null for text nodes
type Props = { [index: string]: any }; // The set of properties passed to a component
type NormalizedProps = Props & { children: Children }; // Normalized props should always have children
type Children = any[]; // The child nodes for a VNode
type RefObj = { current: any }; // Used in <foo ref={obj_from_useRef} />
type RefCallback = (el: Element) => void; // Used in <foo ref={el => useElement(el)} />

// A VNode is what all components render into via 'h' calls. They form a tree
// with the rendered element being the 'root' VNode. On re-render the old VNode
// tree is compared to the new, and only the changes are applied to the DOM.
type VNode = {
  type: Tag;
  props: NormalizedProps;
  key: string | number | null;
  ref?: RefObj | RefCallback;
  // TODO: Check we need the below, and remove if not (else comment if yes)
  _children?: any;
  _parent?: VNode;
  _dom?: Node;
  _domSibling?: Node;
};

type HtmlObj = { __html: string };

// ***********************************************************
// The below are used for testing, and to provide a substitute
// window/document object for use when manipulating the DOM.
// ***********************************************************

let windowObj: Window = typeof window === "object" && window;

export function setMockWindow(mock: Window) {
  windowObj = mock;
}

const _createTextNode = (data: string) =>
  windowObj.document.createTextNode(data);

const _createElement = (tagName: string) =>
  windowObj.document.createElement(tagName);

const _createElementNS = (ns: string, tagName: string) =>
  windowObj.document.createElementNS(ns, tagName);

// **********************************************************
// Below are the main functions used in the public interface
// **********************************************************

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
  const normalizedProps: NormalizedProps = { children: [] };
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
  normalizedProps.children = children;

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
 *     <><h1>{appName}</h1>Some interim text<Foo id='test'/></>
 *
 * Gets compiled into:
 *
 *     h(Fragment, null,
 *       h("h1", null, appName),
 *       "Some interim text",
 *       h(Foo, { id: 'test' }))
 */
export function Fragment(props: NormalizedProps) : Children {
  return props.children;
}

/**
 * Used to render a component into an HTML element, e.g.
 *
 *     render(<App id={appId} />, document.body);
 */
export function render(vnode: VNode, parentElem: HTMLElement): void {
  // If rendered into previously, the old VNode will be set on the DOM '_children' element
  const oldVNode: VNode | undefined = parentElem["_children"];

  // Set the DOM element to the new VNode
  // TODO: Preact always uses a new Fragment here via "createElement(Fragment, null, [vnode]);". Why?
  // Maybe it should always be an array of nodes, and Fragment ensures that
  parentElem["_children"] = vnode;

  // TODO: Implement these
  const commitQueue = [];
  const refQueue = [];
  const excessDomChildren = [];

  // TODO: Some params used in Preact not included here. Do we need them?
  // Provide a good explanations here of exactly what this will do.
  diff(
    parentElem,
    vnode,
    oldVNode,
    null, /* Global context */
    false,/* isSvg */
    excessDomChildren,
    commitQueue,
    refQueue
  );

  // TODO: Implement
  // Provide a good explanations here of exactly what this will do.
  commitRoot(commitQueue, vnode, refQueue);
}

// **********************************************************
// Below are the hooks implementations
// **********************************************************

export function useState() {
  throw "Not implemented";
}

export function useRef() {
  throw "Not implemented";
}

export function useEffect() {
  throw "Not implemented";
}

export function useMemo() {
  throw "Not implemented";
}

export function useCallback() {
  throw "Not implemented";
}

// **********************************************************
// Below are the various helping methods used internally
// **********************************************************

function diff(
  parentElem: HTMLElement,
  newVNode: VNode,
  oldVNode: VNode | undefined,
  globalContext: any,
  isSvg: boolean,
  excessDomChildren: HTMLElement[],
  commitQueue: any[],
  refQueue: any[]
) {
  // This is where most of the magic happens, comparing old and new VNode
  // trees and add/removing/updating DOM elements and attributes to match.
  if (typeof newVNode.type === "function") {
    // This is a custom component
    throw "Not implemented";
  } else {
    // This is a 'host element', e.g. div, span, br, TEXT_NODE, etc.
    newVNode._dom = diffElementNodes(
      oldVNode?._dom,
      newVNode,
      oldVNode,
      globalContext,
      isSvg,
      excessDomChildren,
      commitQueue,
      refQueue
    );
  }
  // TODO: Fire the 'diffed' hook event
}

function diffElementNodes(
  dom: Node,
  newVNode: VNode,
  oldVNode: VNode | undefined,
  globalContext: any,
  isSvg: boolean,
  excessDomChildren: Node[],
  commitQueue: any[],
  refQueue: any[]
): Node {
  const nodeType = newVNode.type; // Will be null for a text node
  if (nodeType === "svg") isSvg = true;

  // TODO: Clarify this
  // if newVNode matches an element in excessDomChildren or the `dom`
  // argument matches an element in excessDomChildren, remove it from
  // excessDomChildren so it isn't later removed in diffChildren
  for (let idx = 0; idx < excessDomChildren.length; ++idx) {
    const elem = excessDomChildren[idx] as Element;

    // Check it is a DOM element and not a text node,
    const isMatchingElem =
      nodeType && elem?.setAttribute && elem.localName === nodeType;
    const isMatchingText =
      !nodeType && !elem?.setAttribute && elem.nodeType === elem.TEXT_NODE;

    if (elem && (isMatchingElem || isMatchingText)) {
      dom = elem;
      excessDomChildren[idx] = null;
      break;
    }
  }

  if (!dom) {
    if (nodeType === null) {
      const newText: string = newVNode.props as any; // TODO: Check this is a string
      return _createTextNode(newText);
    } else {
      if (isSvg) {
        dom = _createElementNS(
          "http://www.w3.org/2000/svg",
          nodeType as string
        );
      } else {
        // TODO: props.is
        dom = _createElement(nodeType as string);
      }

      // Created a new parent, so none of the previous attached children can be reused
      excessDomChildren = null;
    }
  }

  if (nodeType === null) {
    // TODO: What is this for?
    const newText: string = newVNode.props as any; // TODO: Check this is indeed a string
    if (oldVNode.props !== newVNode.props) (dom as Text).data = newText;
  } else {
    // If excessDomChildren was not null, repopulate it with the current element's children:
    excessDomChildren = excessDomChildren && Array.from(dom.childNodes);

    let oldProps = oldVNode?.props || {};
    const newProps = newVNode.props;
    if (excessDomChildren != null) {
      let oldProps = {};
      for (let i = 0; i < (dom as Element).attributes.length; ++i) {
        let value = (dom as Element).attributes[i];
        oldProps[value.name] = value.value;
      }
    }

    let newHtml: HtmlObj;
    let oldHtml: HtmlObj;
    let newChildren: Children;

    for (let propName in oldProps) {
      let value = oldProps[propName];
      if (propName == "children") {
        // Skip
      } else if (propName == "dangerouslySetInnerHTML") {
        oldHtml = value;
      } else if (propName !== "key" && !(propName in newProps)) {
        setProperty(dom, propName, null, value, isSvg);
      }
    }

    for (let propName in newProps) {
      let value = newProps[propName];
      if (propName == "children") {
        newChildren = value;
      } else if (propName == "dangerouslySetInnerHTML") {
        newHtml = value;
      } else if (propName !== "key" && oldProps[propName] !== value) {
        setProperty(dom, propName, value, oldProps[propName], isSvg);
      }
    }

    // If the new vnode didn't have dangerouslySetInnerHTML, diff its children
    if (newHtml) {
      // Avoid re-applying the same '__html' if it did not changed between re-render
      if (
        !oldHtml ||
        (newHtml.__html !== oldHtml.__html &&
          newHtml.__html !== (dom as Element).innerHTML)
      ) {
        (dom as Element).innerHTML = newHtml.__html;
      }

      newVNode._children = [];
    } else {
      if (oldHtml) (dom as Element).innerHTML = "";

      diffChildren(
        dom,
        Array.isArray(newChildren) ? newChildren : [newChildren],
        newVNode,
        oldVNode,
        isSvg,
        excessDomChildren,
        commitQueue,
        excessDomChildren
          ? excessDomChildren[0]
          : oldVNode?._children && getDomSibling(oldVNode, 0),
        refQueue
      );

      // Remove children that are not part of any vnode.
      if (excessDomChildren != null) {
        for (let i = excessDomChildren.length; i--; ) {
          if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]);
        }
      }
    }
  }

  return dom;
}

// TODO

function diffChildren(
  parentDom: Node,
  renderResult: Children,
  newParentVNode: VNode,
  oldParentVNode: VNode,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  refQueue
) {
  let oldChildren = oldParentVNode?._children || [];

  throw "Not implemented";
}

function setProperty(
  dom: Node,
  propName: string,
  newValue: any,
  oldValue: any,
  isSvg: boolean
) {
  throw "Not implemented";
}

function getDomSibling(vnode: VNode, childIndex?: number) {
  throw "Not implemented";
}

function removeNode(node: Node) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function commitRoot(commitQueue: any[], vnode: VNode, refQueue: any[]) {
  throw "Not implemented";
}
