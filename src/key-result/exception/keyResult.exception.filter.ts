import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {Response} from "express";
import {KeyResultNotFoundException} from "./keyResult.exception";

@Catch(KeyResultNotFoundException)
export class KeyResultNotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: KeyResultNotFoundException, host: ArgumentsHost): any {
        const context = host.switchToHttp();
        const res:Response = context.getResponse();

        return res.status(404).send({message: exception.message});
    }

}
