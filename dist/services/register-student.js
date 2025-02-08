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

// src/services/register-student.ts
var register_student_exports = {};
__export(register_student_exports, {
  RegisterStudentService: () => RegisterStudentService
});
module.exports = __toCommonJS(register_student_exports);

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

// src/services/register-student.ts
var RegisterStudentService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute({ username, email, password, sessionId }) {
    const studentWithSameEmail = await this.prisma.student.findUnique({
      where: {
        email
      }
    });
    const studentWithSameUsername = await this.prisma.student.findUnique({
      where: {
        username
      }
    });
    if (studentWithSameEmail || studentWithSameUsername)
      throw new Error("Student already exists!");
    const student = await this.prisma.student.create({
      data: {
        username,
        email,
        password,
        sessionId
      }
    });
    await client.hSet(sessionId, {
      id: student.id,
      username,
      email,
      password,
      createdAt: student.createdAt.toString()
    });
    return student;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterStudentService
});
