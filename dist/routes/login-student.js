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

// src/routes/login-student.ts
var login_student_exports = {};
__export(login_student_exports, {
  LoginStudentRoute: () => LoginStudentRoute
});
module.exports = __toCommonJS(login_student_exports);

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

// src/services/get-student-by-email.ts
var GetStudentByEmailService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(email) {
    const student = await this.prisma.student.findUnique({
      where: {
        email
      }
    });
    if (!student) throw new Error("Student not found!");
    return student;
  }
};

// src/routes/login-student.ts
var import_zod = require("zod");
var import_bcrypt = require("bcrypt");

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
    if (await client.hGetAll(oldStudent.sessionId))
      await client.del(oldStudent.sessionId);
    await client.hSet(sessionId, {
      id: updatedStudent.id,
      username: updatedStudent.username,
      email: updatedStudent.email,
      password: updatedStudent.password,
      sessionId,
      createdAt: updatedStudent.createdAt.toString()
    });
    return updatedStudent;
  }
};

// src/routes/login-student.ts
async function LoginStudentRoute(app) {
  app.post("/login", {
    schema: {
      body: import_zod.z.object({
        email: import_zod.z.string().email(),
        password: import_zod.z.string().min(6)
      })
    }
  }, async (req, res) => {
    const { email, password } = req.body;
    const prismaRepository = new PrismaService();
    const getStudentByEmailService = new GetStudentByEmailService(prismaRepository);
    const updateSessionIdService = new UpdateSessionIdService(prismaRepository);
    const student = await getStudentByEmailService.execute(email);
    if (!await (0, import_bcrypt.compare)(password, student.password)) {
      return res.status(401).send({ msg: "Email or password incorrect!" });
    }
    const sessionId = app.jwt.sign({ user: student.username });
    res.setCookie("sessionId", sessionId, {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
      maxAge: 1e3 * 3600 * 24 * 7
      // 7 days
    });
    const cookie = app.signCookie(sessionId);
    const loggedStudent = await updateSessionIdService.execute(cookie, student.id);
    return res.status(201).send({ login: loggedStudent });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginStudentRoute
});
