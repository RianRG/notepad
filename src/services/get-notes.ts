import { PrismaService } from "../repositories/prisma/prisma-service";

export class GetNotesService{
  constructor(private prisma: PrismaService){};

  async execute(studentId: string){
    const notes = await this.prisma.note.findMany({
      where: {
        studentId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const parsedNotes = notes.map(note =>{
      const {studentId, ...restOfAll} = note

      return restOfAll;
    })

    return parsedNotes;
  }
}