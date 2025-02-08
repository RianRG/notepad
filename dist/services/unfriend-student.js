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

// src/services/unfriend-student.ts
var unfriend_student_exports = {};
__export(unfriend_student_exports, {
  UnfriendService: () => UnfriendService
});
module.exports = __toCommonJS(unfriend_student_exports);
var UnfriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(username, friendName) {
    if (username === friendName) throw new Error("You cannot unfriend yourself!");
    const friend = await this.prisma.student.findUnique({
      where: {
        username: friendName
      }
    });
    const student = await this.prisma.student.findUnique({
      where: {
        username
      }
    });
    if (!friend || !student)
      throw new Error("Student not found!");
    const friendship = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            receiverId: friend.id,
            senderId: student.id
          },
          {
            receiverId: student.id,
            senderId: friend.id
          }
        ]
      }
    });
    if (!friendship) throw new Error(`You and ${friendName} are not friends!`);
    await this.prisma.friendRequest.delete({
      where: {
        id: friendship.id
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnfriendService
});
