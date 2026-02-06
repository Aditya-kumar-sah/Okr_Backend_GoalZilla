import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";

import {Response} from "express";
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
   catch(exception:any,host:ArgumentsHost){
       const context = host.switchToHttp();
       const res : Response = context.getResponse();

       if(exception instanceof HttpException){
           return res.status(exception.getStatus()).send(exception.getResponse());
       }

       return res.status(500).send({message:"Internal Server Error!"})

   }
}