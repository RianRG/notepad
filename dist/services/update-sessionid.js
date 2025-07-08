"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/update-sessionid.ts
var update_sessionid_exports = {};
__export(update_sessionid_exports, {
  UpdateSessionIdService: () => UpdateSessionIdService
});
module.exports = __toCommonJS(update_sessionid_exports);
var UpdateSessionIdService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId, id) {
    const oldStudent = await this.prisma.student.findUnique({
      where: {
        id
      }
    });
    if (!oldStudent) throw new Error("Student not found!");
    const updatedStudent = await this.prisma.student.update({
      where: {
        id
      },
      data: {
        sessionId
      }
    });
    return updatedStudent;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateSessionIdService
});
