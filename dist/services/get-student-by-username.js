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

// src/services/get-student-by-username.ts
var get_student_by_username_exports = {};
__export(get_student_by_username_exports, {
  GetStudentByUsernameService: () => GetStudentByUsernameService
});
module.exports = __toCommonJS(get_student_by_username_exports);
var GetStudentByUsernameService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(username) {
    const student = await this.prisma.student.findUnique({
      where: {
        username
      },
      include: {
        notes: {
          where: {
            isPrivate: false
          }
        },
        _count: {
          select: {
            friendRequestsReceived: {
              where: {
                status: "ACCEPTED"
              }
            },
            friendRequestsSent: {
              where: {
                status: "ACCEPTED"
              }
            }
          }
        }
      }
    });
    if (!student)
      throw new Error("Student not found!");
    const studentWithFriends = {
      id: student.id,
      sessionId: student.sessionId,
      username: student.username,
      email: student.email,
      password: student.password,
      createdAt: student.createdAt,
      notes: student.notes,
      friends: student._count.friendRequestsReceived + student._count.friendRequestsSent
    };
    return studentWithFriends;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetStudentByUsernameService
});
