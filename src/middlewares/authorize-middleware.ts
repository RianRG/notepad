import { FastifyReply, FastifyRequest } from "fastify";
export const authorizeMiddleware = (req: FastifyRequest, res: FastifyReply, done: any) =>{
  if(!req.cookies.sessionId)
    return res.status(401).send({ msg: 'Unauthorized!' })

  const unsignedCookie = req.unsignCookie(req.cookies.sessionId)
  
  if(!unsignedCookie.value)
    return res.status(401).send({ msg: 'Unauthorized!' })


  if(!req.jwt.verify(unsignedCookie.value))
    return res.status(401).send({ msg: 'Unauthorized!' })

  req.auth = {
    sessionId: req.cookies.sessionId
  }

  done();
}