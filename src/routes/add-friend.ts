import { z } from "zod";
import { FastifyTypedInstance } from "../types";

export async function AddFriendRoute(app: FastifyTypedInstance){
  app.post('/add', 
    {
      schema: {
        body: z.object({
          username: z.string()
        })
      }
    },async (req, res) =>{

  })
}