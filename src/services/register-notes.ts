import { PrismaService } from "../repositories/prisma/prisma-service";

interface RegisterNotesDTO {
    title: string;
    content: string;
    isPrivate: boolean;
    studentId: string;
}

export class RegisterNotesService {
    constructor(private prisma: PrismaService) {}

    async execute({ title, content, isPrivate, studentId }: RegisterNotesDTO) {
        return await this.prisma.note.create({
            data: {
                title,
                content,
                isPrivate,
                studentId
            }
        });
    }
}
