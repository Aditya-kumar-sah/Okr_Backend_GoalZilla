import {IsKeyResultCompletedService} from "./is-key-result-completed.service";
import {Test} from "@nestjs/testing";

describe( 'isCompleted', () => {

    let isKeyResultCompletedService : IsKeyResultCompletedService;

    beforeEach( async ()=> {
        const moduleRef = await Test.createTestingModule({
            providers: [IsKeyResultCompletedService]
        }).compile();

        isKeyResultCompletedService = await moduleRef.resolve(IsKeyResultCompletedService);
    } )

    it( 'should return true when the progress is 100%', () => {
        let isKeyResultCompletedDto = {
            progress: 100,
            description : 'test'
        }
        const result  = isKeyResultCompletedService.isCompleted(isKeyResultCompletedDto);
        expect(result).toBeTruthy();
    })

    it( 'should return false when the progress is less than 100%', () => {
        let isKeyResultCompletedDto = {
            progress: 40,
            description : 'test'
        }
        const result  = isKeyResultCompletedService.isCompleted(isKeyResultCompletedDto);
        expect(result).toBeFalsy();
    })
})