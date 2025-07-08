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

// src/routes/register-student.ts
var register_student_exports = {};
__export(register_student_exports, {
  RegisterStudentRoute: () => RegisterStudentRoute
});
module.exports = __toCommonJS(register_student_exports);

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
    return student;
  }
};

// src/routes/register-student.ts
var import_bcrypt = require("bcrypt");
var import_zod = require("zod");
async function RegisterStudentRoute(app) {
  app.post("/students/register", {
    schema: {
      body: import_zod.z.object({
        username: import_zod.z.string(),
        email: import_zod.z.string().email(),
        password: import_zod.z.string().min(6)
      }),
      response: {
        201: import_zod.z.object({
          id: import_zod.z.string()
        })
      }
    }
  }, async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await (0, import_bcrypt.hash)(password, 4);
    const prismaRepository = new PrismaService();
    const registerStudentService = new RegisterStudentService(prismaRepository);
    const sessionId = app.jwt.sign({ user: username });
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
    const student = await registerStudentService.execute({ username, email, password: hashedPassword, sessionId: cookie });
    return res.status(201).send({ id: student.id });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterStudentRoute
});
