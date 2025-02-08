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

// src/services/get-friends.ts
var get_friends_exports = {};
__export(get_friends_exports, {
  GetFriendsService: () => GetFriendsService
});
module.exports = __toCommonJS(get_friends_exports);
var GetFriendsService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId) {
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      },
      include: {
        friendRequestsReceived: true,
        friendRequestsSent: true
      }
    });
    if (!student) throw new Error("Student not found!");
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            receiverId: student.id,
            status: "ACCEPTED"
          },
          {
            senderId: student.id,
            status: "ACCEPTED"
          }
        ]
      },
      include: {
        receiver: true,
        sender: true
      }
    });
    if (!friendRequests) throw new Error("You don't have any friends!");
    const friends = friendRequests.reduce((acm, friendRequest, k) => {
      if (friendRequest.receiver.username !== student.username) {
        acm.push(friendRequest.receiver);
      } else {
        acm.push(friendRequest.sender);
      }
      return acm;
    }, []);
    return friends;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFriendsService
});
