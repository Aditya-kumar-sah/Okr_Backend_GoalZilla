import { KeyResult} from "./dto/key-result.dto";

export class IsKeyResultCompletedService {
    isCompleted(keyResult:KeyResult){
        if(keyResult.progress === 100) return true;
        return false;
    }
}