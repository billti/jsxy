// Copyright (c) Bill Ticehurst
// Licensed under the MIT License.

// @ts-check

import assert from "node:assert";
import { test } from "node:test";

import { h, render, setMockWindow } from "../index.js";

import {JSDOM} from "jsdom";

test('h created a vdom node', () => {
    // <h1>Hello, world</h1> => h("h1", null, "Hello, world")
    const h1 = h("h1", null, "Hello, world");

    const expected = {
        "type": "h1",
        "key": null,
        "ref": null,
        "props": {
            "children": ["Hello, world"]
        }
    };

    assert.deepStrictEqual(h1, expected);

    /*
    <div>
        <h1 class="test" open>When you add {3 + 4} you <br/> get 7</h1>
    </div>

    becomes

    h("div", null,
        h("h1", { class: "test", open: true },
            "When you add ",
            3 + 4,
            " you ",
            h("br", null),
            " get 7"));
    */

});

const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head> </head>
<body></body>
</html>`;

test('renders a basic div', () => {
    const dom = new JSDOM(htmlDoc, {runScripts: "dangerously"});
    /** @type {any} */
    const mock = dom.window;
    setMockWindow(mock);
    
    const body = dom.window.document.body;
    const div = h("div", null, "Hello, world");
    render(div, body);

});

// test('deepEquals', () => {
//     const a = {
//         "type": "h1",
//         "key": null,
//         "props": {
//             "children": ["test"]
//         }
//     };

//     const b = {
//         "type": "h1",
//         "key": null,
//         "ref": undefined,
//         "props": {
//             "children": ["test"]
//         }
//     };

//     assert.deepStrictEqual(a, b);
// });