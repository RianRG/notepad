"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/services/get-notes.ts
var get_notes_exports = {};
__export(get_notes_exports, {
  GetNotesService: () => GetNotesService
});
module.exports = __toCommonJS(get_notes_exports);
var GetNotesService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(studentId) {
    const notes = await this.prisma.note.findMany({
      where: {
        studentId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const parsedNotes = notes.map((note) => {
      const _a = note, { studentId: studentId2 } = _a, restOfAll = __objRest(_a, ["studentId"]);
      return restOfAll;
    });
    return parsedNotes;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetNotesService
});
