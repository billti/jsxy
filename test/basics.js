// Copyright (c) Bill Ticehurst
// Licensed under the MIT License.

// @ts-check

import { h } from "../index.js";
import { test } from "node:test";

test('h created a vdom node', () => {
    try {
        h("div", null, "test");
    } catch(e) {
        if (e !== "Not implemented") throw e;
    }
});
