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

// src/services/delete-note.ts
var delete_note_exports = {};
__export(delete_note_exports, {
  DeleteNoteService: () => DeleteNoteService
});
module.exports = __toCommonJS(delete_note_exports);
var DeleteNoteService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(noteId) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: noteId
      }
    });
    if (!note)
      throw new Error("Note not found!");
    await this.prisma.note.delete({
      where: {
        id: noteId
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteNoteService
});
