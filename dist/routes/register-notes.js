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

// src/routes/register-notes.ts
var register_notes_exports = {};
__export(register_notes_exports, {
  RegisterNoteRoute: () => RegisterNoteRoute
});
module.exports = __toCommonJS(register_notes_exports);

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

// src/services/get-student-by-sessionId.ts
var GetStudentBySessionIdService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(sessionId) {
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      }
    });
    if (!student) throw new Error();
    return student;
  }
};

// src/services/register-notes.ts
var RegisterNotesService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute({ title, content, isPrivate, studentId }) {
    return await this.prisma.note.create({
      data: {
        title,
        content,
        isPrivate,
        studentId
      }
    });
  }
};

// src/routes/register-notes.ts
var import_zod = require("zod");
async function RegisterNoteRoute(app) {
  app.post("/notes/register", {
    preHandler: [authorizeMiddleware],
    schema: {
      body: import_zod.z.object({
        title: import_zod.z.string(),
        content: import_zod.z.string(),
        isPrivate: import_zod.z.boolean()
      })
      // response: {
      //     201: z.object({
      //         notes: z.object({
      //         })
      //     })
      // }
    }
  }, async (req, res) => {
    const { sessionId } = req.auth;
    const { title, content, isPrivate } = req.body;
    const prismaRepository = new PrismaService();
    const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
    const registerNotesService = new RegisterNotesService(prismaRepository);
    const student = await getStudentBySessionIdService.execute(sessionId);
    if (!student) throw new Error();
    const notes = await registerNotesService.execute({ title, content, isPrivate, studentId: student.id });
    return res.status(201).send({ notes });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterNoteRoute
});
