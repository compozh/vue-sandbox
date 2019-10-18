/* eslint-disable */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* globals console, Promise */
var vue_1 = require("vue");
var vue_property_decorator_1 = require("vue-property-decorator");
var FormBuilder_1 = require("formiojs/FormBuilder");
var components_1 = require("formiojs/components");
var Components_1 = require("formiojs/components/Components");
Components_1.default.setComponents(components_1.default);
var FormBuilder = /** @class */ (function (_super) {
    __extends(FormBuilder, _super);
    function FormBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormBuilder.prototype.formChange = function (value) {
        if (this.builder) {
            this.builder.instance.form = value;
        }
    };
    FormBuilder.prototype.mounted = function () {
        this.initializeBuilder()
            .catch(function (err) {
            /* eslint-disable no-console */
            console.warn(err);
            /* eslint-enable no-console */
        });
    };
    FormBuilder.prototype.destroyed = function () {
        if (this.builder) {
            this.builder.instance.destroy(true);
        }
    };
    FormBuilder.prototype.initializeBuilder = function () {
        var _this = this;
        if (this.form) {
            // @ts-ignore
            this.builder = new FormBuilder_1.default(this.$refs.formio, this.form, this.options).then(function () {
                _this.builder.instance.events.onAny(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var eventParts = args[0].split('.');
                    // Only handle formio events.
                    if (eventParts[0] !== 'formio' || eventParts.length !== 2) {
                        return;
                    }
                    // Remove formio. from event.
                    args[0] = eventParts[1];
                    _this.$emit.apply(_this, args);
                    // Emit a change event if the schema changes.
                    if (['saveComponent', 'updateComponent', 'deleteComponent'].includes(eventParts[1])) {
                        args[0] = 'change';
                        _this.$emit.apply(_this, args);
                    }
                });
            });
        }
        else {
            // If we get to here there is no src or form
            return Promise.reject('Must set form attribute');
        }
    };
    FormBuilder.prototype.render = function (createElement) {
        return createElement('div', { ref: 'formio' });
    };
    __decorate([
        vue_property_decorator_1.Prop(),
        __metadata("design:type", Object)
    ], FormBuilder.prototype, "form", void 0);
    __decorate([
        vue_property_decorator_1.Prop(),
        __metadata("design:type", Object)
    ], FormBuilder.prototype, "options", void 0);
    __decorate([
        vue_property_decorator_1.Watch('form'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormBuilder.prototype, "formChange", null);
    FormBuilder = __decorate([
        vue_property_decorator_1.Component
    ], FormBuilder);
    return FormBuilder;
}(vue_1.default));
exports.FormBuilder = FormBuilder;
;
//# sourceMappingURL=FormBuilder.js.map