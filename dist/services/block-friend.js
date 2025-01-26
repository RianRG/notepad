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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/services/block-friend.ts
var block_friend_exports = {};
__export(block_friend_exports, {
  BlockFriendService: () => BlockFriendService
});
module.exports = __toCommonJS(block_friend_exports);
var BlockFriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(studentName, friendName) {
    return __async(this, null, function* () {
      if (studentName === friendName) throw new Error("You cannot block yourself!");
      const student = yield this.prisma.student.findUnique({
        where: {
          username: studentName
        }
      });
      const friend = yield this.prisma.student.findUnique({
        where: {
          username: friendName
        }
      });
      if (!student || !friend) throw new Error("Student not found!");
      const friendship = yield this.prisma.friendRequest.findFirst({
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
      return yield this.prisma.friendRequest.update({
        where: {
          id: friendship.id
        },
        data: {
          status: "REJECTED"
        }
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockFriendService
});
