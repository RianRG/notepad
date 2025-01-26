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

// src/routes/add-friend.ts
var add_friend_exports = {};
__export(add_friend_exports, {
  AddFriendRoute: () => AddFriendRoute
});
module.exports = __toCommonJS(add_friend_exports);

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
    super();
  }
};

// src/services/add-friend.ts
var AddFriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(requesterName, receiverName) {
    return __async(this, null, function* () {
      if (requesterName === receiverName)
        throw new Error("You cannot add yourself!");
      const requester = yield this.prisma.student.findUnique({
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
      const receiver = yield this.prisma.student.findUnique({
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
      const isAlreadyFriend = yield this.prisma.friendRequest.findFirst({
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
          yield this.prisma.friendRequest.update({
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
      yield this.prisma.friendRequest.create({
        data: {
          receiverId: receiver.id,
          senderId: requester.id,
          status: "PENDING"
        }
      });
      return 3;
    });
  }
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

// src/routes/add-friend.ts
var import_zod = require("zod");
function AddFriendRoute(app) {
  return __async(this, null, function* () {
    app.post("/add/:friendName", {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod.z.object({
          friendName: import_zod.z.string()
        }),
        response: {
          201: import_zod.z.object({
            msg: import_zod.z.string()
          })
        }
      }
    }, (req, res) => __async(this, null, function* () {
      const { friendName } = req.params;
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const addFriend = new AddFriendService(prismaRepository);
      const student = yield getStudentBySessionIdService.execute(sessionId);
      yield addFriend.execute(student.username, friendName);
      return res.status(201).send({ msg: "Friend request sent!" });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddFriendRoute
});
