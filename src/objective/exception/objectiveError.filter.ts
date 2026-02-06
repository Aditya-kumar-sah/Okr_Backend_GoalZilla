import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {
    ObjectiveNotFoundException, ObjectiveTitleDuplicateException
} from "./objectiveError";
import {Response} from "express";

@Catch(ObjectiveNotFoundException)
export class ObjectiveNotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: ObjectiveNotFoundException, host: ArgumentsHost): any {
         const context = host.switchToHttp();
         const res:Response = context.getResponse();

         return res.status(404).send({message: exception.message});
    }

}

@Catch(ObjectiveTitleDuplicateException)
export class ObjectiveTitleDuplicateExceptionFilter implements ExceptionFilter {
    catch(exception: ObjectiveTitleDuplicateException, host: ArgumentsHost): any {
         const context = host.switchToHttp();
         const res:Response = context.getResponse();

         return res.status(400).send({message: exception.message});
    }

}