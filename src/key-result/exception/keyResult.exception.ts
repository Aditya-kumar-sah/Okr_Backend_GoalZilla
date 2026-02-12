export class KeyResultNotFoundException extends Error {
    constructor(errorMessage:string,keyResultId:string) {
        super(`${errorMessage} ${keyResultId}`);
    }

}