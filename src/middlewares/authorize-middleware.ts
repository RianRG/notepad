import { FastifyReply, FastifyRequest } from "fastify";
export const authorizeMiddleware = (req: FastifyRequest, res: FastifyReply, done: any) =>{
  if(!req.cookies.sessionId)
    throw new Error('Unauthorized!');

  const unsignedCookie = req.unsignCookie(req.cookies.sessionId)
  
  if(!unsignedCookie.value)
    throw new Error('Unauthorized')

  if(!req.jwt.verify(unsignedCookie.value))
    throw new Error('Unauthorized!')
  done();
}