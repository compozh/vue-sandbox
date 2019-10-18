"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var components = require("./components");
__export(require("./components"));
// Vue.$formio = Formio;
Object.keys(components).forEach(function (name) {
    vue_1.default.component(name, components[name]);
});
//# sourceMappingURL=index.js.map