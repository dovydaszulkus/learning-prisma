import type { Request, Response, NextFunction } from "express"

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode ? res.statusCode : 500

  console.log(res.statusCode)

  res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
  })
}

export default errorHandler
