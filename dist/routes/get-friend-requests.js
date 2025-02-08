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

// src/routes/get-friend-requests.ts
var get_friend_requests_exports = {};
__export(get_friend_requests_exports, {
  GetFriendRequestsRoute: () => GetFriendRequestsRoute
});
module.exports = __toCommonJS(get_friend_requests_exports);

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

// src/services/get-friend-requests.ts
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

// src/routes/get-friend-requests.ts
async function GetFriendRequestsRoute(app) {
  app.get("/friendRequests", {
    preHandler: [authorizeMiddleware]
  }, async (req, res) => {
    const { sessionId } = req.auth;
    const prismaRepository = new PrismaService();
    const getFriendRequestsService = new GetFriendRequestsService(prismaRepository);
    const friendRequests = await getFriendRequestsService.execute(sessionId);
    return res.status(200).send({ friendRequests });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFriendRequestsRoute
});
