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

// src/routes/unfriend-student.ts
var unfriend_student_exports = {};
__export(unfriend_student_exports, {
  UnfriendRoute: () => UnfriendRoute
});
module.exports = __toCommonJS(unfriend_student_exports);

// src/middlewares/authorize-middleware.ts
var authorizeMiddleware = (req, res, done) => {
  if (!req.cookies.sessionId)
    return res.status(401).send({ msg: "Unauthorized!" });
  const unsignedCookie = req.unsignCookie(req.cookies.sessionId);
  if (!unsignedCookie.value)
    return res.status(401).send({ msg: "Unauthorized!" });
  if (!req.jwt.verify(unsignedCookie.value))
    return res.status(401).send({ msg: "Unauthorized!" });
  req.auth = {
    sessionId: req.cookies.sessionId
  };
  done();
};

// src/repositories/prisma/prisma-service.ts
var import_client = require("@prisma/client");
var PrismaService = class extends import_client.PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.NODE_ENV === "production" ? process.env.DATABASE_URL : "postgresql://admin:admin@localhost:5432/mypostgres?schema=public"
        }
      }
    });
  }
};

// src/services/unfriend-student.ts
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

// src/services/get-student-by-sessionId.ts
var GetStudentBySessionIdService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId) {
    const cachedStudent = await client.hGetAll(sessionId);
    if (cachedStudent)
      return cachedStudent;
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      }
    });
    if (!student) throw new Error();
    return student;
  }
};

// src/routes/unfriend-student.ts
var import_zod = require("zod");
async function UnfriendRoute(app) {
  app.delete("/unfriend/:friendName", {
    preHandler: [authorizeMiddleware],
    schema: {
      params: import_zod.z.object({
        friendName: import_zod.z.string()
      }),
      cookies: import_zod.z.object({
        sessionId: import_zod.z.string()
      })
    }
  }, async (req, res) => {
    const { sessionId } = req.auth;
    const { friendName } = req.params;
    const prismaRepository = new PrismaService();
    const unfriendService = new UnfriendService(prismaRepository);
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
    const student = await getStudentBySessionIdService.execute(sessionId);
    await unfriendService.execute(student.username, friendName);
    return res.status(200).send({ msg: "Student unfriended succesfully!" });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnfriendRoute
});
