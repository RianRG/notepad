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

// src/services/get-friend-notes.ts
var get_friend_notes_exports = {};
__export(get_friend_notes_exports, {
  GetFriendNotesService: () => GetFriendNotesService
});
module.exports = __toCommonJS(get_friend_notes_exports);
var GetFriendNotesService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId) {
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
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
        receiver: {
          include: {
            notes: true
          }
        },
        sender: {
          include: {
            notes: true
          }
        }
      }
    });
    const friends = friendRequests.reduce((acm, friendRequest, k) => {
      if (friendRequest.sender.id !== student.id) {
        acm.push(friendRequest.sender);
      } else {
        acm.push(friendRequest.receiver);
      }
      return acm;
    }, []);
    const friendsNotes = [];
    friends.forEach((friend) => {
      if (friend.notes.length === 0) return;
      console.log(friend);
      friendsNotes.push({
        owner: friend.username,
        notes: friend.notes
      });
    });
    return friendsNotes;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFriendNotesService
});
