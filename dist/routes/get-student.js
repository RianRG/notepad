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

// src/routes/get-student.ts
var get_student_exports = {};
__export(get_student_exports, {
  GetStudentRoute: () => GetStudentRoute
});
module.exports = __toCommonJS(get_student_exports);
var import_zod = require("zod");

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

// src/services/get-student-by-username.ts
var GetStudentByUsernameService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(username) {
    const student = await this.prisma.student.findUnique({
      where: {
        username
      },
      include: {
        notes: {
          where: {
            isPrivate: false
          }
        },
        _count: {
          select: {
            friendRequestsReceived: {
              where: {
                status: "ACCEPTED"
              }
            },
            friendRequestsSent: {
              where: {
                status: "ACCEPTED"
              }
            }
          }
        }
      }
    });
    if (!student)
      throw new Error("Student not found!");
    const studentWithFriends = {
      id: student.id,
      sessionId: student.sessionId,
      username: student.username,
      email: student.email,
      password: student.password,
      createdAt: student.createdAt,
      notes: student.notes,
      friends: student._count.friendRequestsReceived + student._count.friendRequestsSent
    };
    return studentWithFriends;
  }
};

// src/routes/get-student.ts
async function GetStudentRoute(app) {
  app.get(
    "/students/:username",
    {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod.z.object({
          username: import_zod.z.string()
        })
      }
    },
    async (req, res) => {
      const { sessionId } = req.auth;
      const { username } = req.params;
      const prismaRepository = new PrismaService();
      const getStudentByUsernameService = new GetStudentByUsernameService(prismaRepository);
      const student = await getStudentByUsernameService.execute(username);
      return res.status(200).send({ student });
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetStudentRoute
});
