"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConfig = exports.MikroORM = void 0;
/* istanbul ignore file */
__exportStar(require("@mikro-orm/knex"), exports);
__exportStar(require("./MySqlDriver"), exports);
var MySqlMikroORM_1 = require("./MySqlMikroORM");
Object.defineProperty(exports, "MikroORM", { enumerable: true, get: function () { return MySqlMikroORM_1.MySqlMikroORM; } });
Object.defineProperty(exports, "defineConfig", { enumerable: true, get: function () { return MySqlMikroORM_1.defineMySqlConfig; } });
