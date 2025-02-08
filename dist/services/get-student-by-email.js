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

// src/services/get-student-by-email.ts
var get_student_by_email_exports = {};
__export(get_student_by_email_exports, {
  GetStudentByEmailService: () => GetStudentByEmailService
});
module.exports = __toCommonJS(get_student_by_email_exports);
var GetStudentByEmailService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(email) {
    const student = await this.prisma.student.findUnique({
      where: {
        email
      }
    });
    if (!student) throw new Error("Student not found!");
    return student;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetStudentByEmailService
});
