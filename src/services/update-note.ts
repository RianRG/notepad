import { PrismaService } from "../repositories/prisma/prisma-service";

export interface UpdateNoteDTO{
  title: string,
  content: string,
  isPrivate: boolean
}

export class UpdateNoteService{
  constructor(private prisma: PrismaService){};

  async execute(noteId: string, data: UpdateNoteDTO){
    return await this.prisma.note.update({
      where: {
        id: noteId
      },
      data: {
        title: data.title,
        content: data.content,
        isPrivate: data.isPrivate
      }
    })
  }
}