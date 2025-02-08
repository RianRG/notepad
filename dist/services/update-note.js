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

// src/services/update-note.ts
var update_note_exports = {};
__export(update_note_exports, {
  UpdateNoteService: () => UpdateNoteService
});
module.exports = __toCommonJS(update_note_exports);
var UpdateNoteService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(noteId, data) {
    return await this.prisma.note.update({
      where: {
        id: noteId
      },
      data: {
        title: data.title,
        content: data.content,
        isPrivate: data.isPrivate
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateNoteService
});
