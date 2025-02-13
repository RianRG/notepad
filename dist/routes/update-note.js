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

// src/routes/update-note.ts
var update_note_exports = {};
__export(update_note_exports, {
  UpdateNoteRoute: () => UpdateNoteRoute
});
module.exports = __toCommonJS(update_note_exports);
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

// src/services/update-note.ts
var UpdateNoteService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async execute(noteId, data) {
    return await this.prisma.note.update({
      where: {
        id: noteId
      },
      data: {
        title: data.title,
        content: data.content,
        isPrivate: data.isPrivate
      }
    });
  }
};

// src/routes/update-note.ts
async function UpdateNoteRoute(app) {
  app.put(
    "/notes/:noteId",
    {
      preHandler: [authorizeMiddleware],
      schema: {
        body: import_zod.z.object({
          title: import_zod.z.string(),
          content: import_zod.z.string(),
          isPrivate: import_zod.z.boolean()
        }),
        params: import_zod.z.object({
          noteId: import_zod.z.string()
        })
      }
    },
    async (req, res) => {
      const { sessionId } = req.auth;
      const { noteId } = req.params;
      const { title, content, isPrivate } = req.body;
      const prismaRepository = new PrismaService();
      const updateNoteService = new UpdateNoteService(prismaRepository);
      const note = await updateNoteService.execute(noteId, { title, content, isPrivate });
      return res.status(201).send({ note });
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateNoteRoute
});
