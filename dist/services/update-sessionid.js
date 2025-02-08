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

// src/services/update-sessionid.ts
var update_sessionid_exports = {};
__export(update_sessionid_exports, {
  UpdateSessionIdService: () => UpdateSessionIdService
});
module.exports = __toCommonJS(update_sessionid_exports);

// src/lib/redis.ts
var import_redis = require("redis");
var client = (0, import_redis.createClient)({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT
  }
});
client.on("error", (err) => console.log("Redis Client Error:: ", err));
client.connect();

// src/services/update-sessionid.ts
var UpdateSessionIdService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId, id) {
    const oldStudent = await this.prisma.student.findUnique({
      where: {
        id
      }
    });
    if (!oldStudent) throw new Error("Student not found!");
    const updatedStudent = await this.prisma.student.update({
      where: {
        id
      },
      data: {
        sessionId
      }
    });
    await client.del(oldStudent.sessionId);
    await client.hSet(sessionId, {
      username: updatedStudent.username,
      email: updatedStudent.email,
      password: updatedStudent.password,
      sessionId
    });
    return updatedStudent;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateSessionIdService
});
