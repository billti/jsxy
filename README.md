# JSXY

_JSX for functional components with hooks_

__!!Under development!!__ Not ready for usage at this point

Minimal React-like rendering engine supporting only functional components and
the useState, useEffect, useMemo, and useRef hooks.

Written for my own education. Its goal is not to be fast, but it does aim to
be correct and comprehensible. It is largely based off reading parts of the
[Preact source code](https://github.com/preactjs/preact) along with various
blogs and tutorials on how similar frameworks are implemented.

Note: This does not support the newer 'jsx' transform introduced in React 17.
To use in TypeScript for example, set the compiler options to:

        "jsx": "react",
        "jsxFactory": "h",
        "jsxFragmentFactory": "Fragment"

And then in .tsx files you would explicitly import the functions needed, e.g.

    import {h, Fragment, render} from "jsxy";

    // Assume MyApp and 'bar' are defined somewhere
    render(<MyApp foo={bar} />, document.body);
