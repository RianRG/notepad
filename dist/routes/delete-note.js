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

// src/routes/delete-note.ts
var delete_note_exports = {};
__export(delete_note_exports, {
  DeleteNoteRoute: () => DeleteNoteRoute
});
module.exports = __toCommonJS(delete_note_exports);

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

// src/services/delete-note.ts
var DeleteNoteService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(noteId) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: noteId
      }
    });
    if (!note)
      throw new Error("Note not found!");
    await this.prisma.note.delete({
      where: {
        id: noteId
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

// src/routes/delete-note.ts
var import_zod = require("zod");
async function DeleteNoteRoute(app) {
  app.delete(
    "/notes/:noteId",
    {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod.z.object({
          noteId: import_zod.z.string()
        })
      }
    },
    async (req, res) => {
      const { sessionId } = req.auth;
      const { noteId } = req.params;
      const prismaRepository = new PrismaService();
      const deleteNoteService = new DeleteNoteService(prismaRepository);
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const student = await getStudentBySessionIdService.execute(sessionId);
      if (!student)
        return res.status(400).send({ msg: "Student not found!" });
      await deleteNoteService.execute(noteId);
      return res.status(200).send({ msg: "Note deleted succesfully!" });
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteNoteRoute
});
