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

// src/routes/block-friend.ts
var block_friend_exports = {};
__export(block_friend_exports, {
  BlockFriendRoute: () => BlockFriendRoute
});
module.exports = __toCommonJS(block_friend_exports);
var import_zod = require("zod");

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

// src/services/block-friend.ts
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

// src/services/get-student-by-sessionId.ts
var GetStudentBySessionIdService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(sessionId) {
    return __async(this, null, function* () {
      const student = yield this.prisma.student.findUnique({
        where: {
          sessionId
        }
      });
      if (!student) throw new Error();
      return student;
    });
  }
};

// src/routes/block-friend.ts
function BlockFriendRoute(app) {
  return __async(this, null, function* () {
    app.delete("/block/:friendName", {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod.z.object({
          friendName: import_zod.z.string()
        }),
        cookies: import_zod.z.object({
          sessionId: import_zod.z.string()
        })
      }
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const { friendName } = req.params;
      const prismaRepository = new PrismaService();
      const blockFriendService = new BlockFriendService(prismaRepository);
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const student = yield getStudentBySessionIdService.execute(sessionId);
      yield blockFriendService.execute(student.username, friendName);
      return res.status(200).send({ msg: "Student blocked succesfully!" });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockFriendRoute
});
