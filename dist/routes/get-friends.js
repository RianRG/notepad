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

// src/routes/get-friends.ts
var get_friends_exports = {};
__export(get_friends_exports, {
  GetFriendsRoute: () => GetFriendsRoute
});
module.exports = __toCommonJS(get_friends_exports);

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

// src/services/get-friends.ts
var GetFriendsService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(sessionId) {
    return __async(this, null, function* () {
      const student = yield this.prisma.student.findUnique({
        where: {
          sessionId
        },
        include: {
          friendRequestsReceived: true,
          friendRequestsSent: true
        }
      });
      if (!student) throw new Error("Student not found!");
      const friendRequests = yield this.prisma.friendRequest.findMany({
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
    });
  }
};

// src/routes/get-friends.ts
function GetFriendsRoute(app) {
  return __async(this, null, function* () {
    app.get("/friends", {
      preHandler: [authorizeMiddleware]
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getFriendsService = new GetFriendsService(prismaRepository);
      const friends = yield getFriendsService.execute(sessionId);
      return res.status(200).send({ friends });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFriendsRoute
});
