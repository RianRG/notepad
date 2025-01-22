import { PrismaService } from "../repositories/prisma/prisma-service";

export class DeleteNoteService{
  constructor(private prisma: PrismaService){};

  async execute(noteId: string){
    const note = await this.prisma.note.findUnique({
      where: {
        id: noteId,
        
      }
    })

    if(!note)
      throw new Error('Note not found!');

    await this.prisma.note.delete({
      where: {
        id: noteId
      }
    })
  }
}