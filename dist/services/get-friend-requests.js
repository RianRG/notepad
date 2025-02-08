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

// src/services/get-friend-requests.ts
var get_friend_requests_exports = {};
__export(get_friend_requests_exports, {
  GetFriendRequestsService: () => GetFriendRequestsService
});
module.exports = __toCommonJS(get_friend_requests_exports);
var GetFriendRequestsService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId) {
    return await this.prisma.friendRequest.findMany({
      where: {
        receiver: {
          sessionId
        },
        status: "PENDING"
      },
      include: {
        sender: {
          select: {
            username: true
          }
        }
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFriendRequestsService
});
