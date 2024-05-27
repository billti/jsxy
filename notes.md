# Implementation notes

## TODO

- Diffing of children
- Functional component implementation
- useState hook
- useRef and useEffect hooks
- Richer logging & error handling
- Support for element keys
- useMemo and useCallback hook
- useContext hook
- jsx/runtime support

## Fragments and siblings

An interesting consideration is how to render sibling fragments, for example, if
you have

    <div>
      <Foo />
      <Bar />
    </div>

If `Foo` returns `<><p/><p/></>` then any elements in `Bar` will be the 3rd child
under the parent `div`. But `Foo` could return more or less elements in the fragment
if the content is dynamic, so you can't know where to place the children of `Bar`
until `Foo` has created its tree.

That said, as long as the entire tree for the vdom is created before any comparison
starts, then it doesn't matter in which order you create them. You'll have the old
and new vdoms to compare to figure out what to update.

Looking at Preact, it looks like for a functional component in a vdom, it doesn't
create its tree until a diff is called on that vnode. I think the general constraint
here is that when a JSX expression creates a vdom, it doesn't EXECUTE the functional
components at that point. It's only once it's actually being rendered into the page
that execution occurs. It's also only at that point that you have actual DOM nodes
to parent vnodes to (if that does need to occur).

Only execution the PFC when it needs to render makes sense. This is likely the same
as what needs to happen after a call to setState within it in some handler. So basically,

- JSX expressions simply return vdom nodes, they don't execute any PFCs.
- Rendering a vnode which is a PFC causes it to execute.
- Thus it's an iterative process, as rendering one PFC will like result it in returning
  some new vnodes, which will then be rendered, possibly resulting in more PFC execution.

## When to re-render

If you know the props and state haven't changed for a component, then should you
run it again at all when rendering parent elements? According to some docs, all children
are invoked again when a parent component runs, but I'm not sure why that's needed.
If it is purely functional, seems like the vdom should be identical if the state is. Is
it to avoid holding a reference to the props passed in? Seems like hooks that track
dependencies need to hold a reference to the old values here anyway. Or maybe it's in
case it's tracking more complex outside state (e.g. context), or is accesses non-local
state that it shouldn't anyway. For simplicity and safety, probably easier to just
re-render all children.

## How to track state for an instance?

When a parent renders a child with props, or when a child re-renders itself due
to a state change (or signal), where is the state for all the hook retrieved from?

When a component instance triggers a re-render of itself that should be easy enough.

Does a parent track state for every child it renders? (including host elements as they
may in turn render functional children?) This needs to get set on the call to the child,
so it's creating the vdom at this point, thus can't be related to the real DOM in any way.

It must be tracked on the old vdom for subsequent renders. Looks like some internal
variable is set to the current 'node' as each node is called. Maybe this is the 'fiber'
which is talked about in some docs.

## How about children surrounded by other nodes

For example, if I have the below:

    return (<div>
      <span>A</span>
      <Foo />
      <span>A</span>
    </div>);
  
When it comes time to render Foo into the parent div, I believe the surrounding spans
have already been created. So it can't just 'appendChild', it has to know which sibling
it is. How? Is this similar to the sibling fragments problem above?

## Mismatched keys

Another challenge is keys. When you start rendering a child node, how to handle if
some children have keys and some don't?

Seems once you have the new vnode tree, just start iterating through the new nodes.

- If a child has a key, look for it in the old tree. If found, move/splice it to match the new position.
  - Need to move the old DOM node too?
- If a child has a key, but the old tree doesn't have it, create/insert a new node/DOM at that spot.
- Delete any remaining nodes in the old tree where the key didn't match.
- How about if some children have keys and some don't? Is that possible? Easy to handle?

## Mid-tree re-render

If you have a structure

    <div>
      <Foo>
        <Bar>
        <Baz>

And Baz needs to re-render, how does it know into where? Who knows how many parent
nodes Foo introduced, or how many nodes Bar added? Every component is rending into
some parent host element somewhere, so if it tracks its parent DOM, and its prior
sibling (if any), then it will know at which point to start rendering.

## Does every component need to render something?

No. It can return null, and results in nothing being added. Interestingly, it will
still need a component instance in the vnode tree, as it could react to some state
change and rending something at a later point. (Does that mean it also still needs
to track parent DOM and prior sibling). In this case, how would a subsequent sibling
know what it's prior sibling is if it didn't use to exist, and now it does? Maybe
it should keep track of it prior sibling component, not DOM node. If that doesn't
have a DOM node, check ITS prior sibling, and repeat until a prior DOM node is found
or no prior component.

## Preact differences

- Preact has special handling for `[default]Value` and `[default]Checked` for some reason. Removed those.
