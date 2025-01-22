import { PrismaService } from "../repositories/prisma/prisma-service";

export class GetFriendRequestsService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string){
    return await this.prisma.friendRequest.findMany({
      where: {
        receiver: {
          sessionId
        },
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            username: true
          }
        }
      }
    })
  }
}