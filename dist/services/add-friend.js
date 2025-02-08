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

// src/services/add-friend.ts
var add_friend_exports = {};
__export(add_friend_exports, {
  AddFriendService: () => AddFriendService
});
module.exports = __toCommonJS(add_friend_exports);
var AddFriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(requesterName, receiverName) {
    if (requesterName === receiverName)
      throw new Error("You cannot add yourself!");
    const requester = await this.prisma.student.findUnique({
      where: {
        username: requesterName
      },
      include: {
        friendRequestsReceived: true,
        friendRequestsSent: true
      }
    });
    if (!requester)
      throw new Error("Student not found!");
    const receiver = await this.prisma.student.findUnique({
      where: {
        username: receiverName
      },
      include: {
        friendRequestsReceived: true,
        friendRequestsSent: true
      }
    });
    if (!receiver)
      throw new Error("Student not found!");
    const isAlreadyFriend = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: requester.id,
            receiverId: receiver.id,
            status: "ACCEPTED"
          },
          {
            senderId: receiver.id,
            receiverId: requester.id,
            status: "ACCEPTED"
          }
        ]
      }
    });
    if (isAlreadyFriend)
      throw new Error(`You and ${receiverName} are already friends!`);
    const isAlreadySent = receiver.friendRequestsReceived.filter((request) => {
      return request.senderId === requester.id;
    });
    if (isAlreadySent.length > 0)
      throw new Error(`You have already sent a request to ${receiverName}`);
    const isAlreadyReceived = receiver.friendRequestsSent.filter((request) => {
      return request.receiverId === requester.id;
    });
    if (isAlreadyReceived.length > 0) {
      if (isAlreadyReceived[0].status !== "REJECTED") {
        await this.prisma.friendRequest.update({
          where: {
            id: isAlreadyReceived[0].id
          },
          data: {
            status: "ACCEPTED"
          }
        });
      } else {
        throw new Error(`Unfortunately, this friendship is BLOCKED :(`);
      }
      return 2;
    }
    await this.prisma.friendRequest.create({
      data: {
        receiverId: receiver.id,
        senderId: requester.id,
        status: "PENDING"
      }
    });
    return 3;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddFriendService
});
