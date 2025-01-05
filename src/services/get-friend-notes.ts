import { skip } from "node:test";
import { PrismaService } from "../repositories/prisma/prisma-service";

export interface FriendsNotesDTO {
  owner: string;
  notes: NotesDTO[]
}
interface NotesDTO{
  id: string;
  title: string;
  content: string;
  isPrivate: boolean;
  createdAt: Date;
}


export class GetFriendNotesService{
  constructor(private prisma: PrismaService){};

  async execute(sessionId: string){
    const student = await this.prisma.student.findUnique({
      where: {
        sessionId
      },
    })

    if(!student) throw new Error('Student not found!')

    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            receiverId: student.id,
            status: "ACCEPTED"
          },
          {
            senderId: student.id,
            status: "ACCEPTED"
          }
        ]
      },
      include: {
        receiver: {
          include: {
            notes: true
          }
        },
        sender: {
          include: {
            notes: true
          }
        }
      }
    })

    const friends = friendRequests.reduce((acm: Object[], friendRequest, k): Object[] =>{

      if(friendRequest.sender.id !== student.id){
        acm.push(friendRequest.sender)
      } else{
        acm.push(friendRequest.receiver)
      }

      return acm;
    }, [])

    const friendsNotes: FriendsNotesDTO[] = []

    friends.forEach((friend: any) =>{
      if(friend.notes.length ===0) return;

      console.log(friend)
      friendsNotes.push({
        owner: friend.username,
        notes: friend.notes
      });
    })

    return friendsNotes;
  }
}