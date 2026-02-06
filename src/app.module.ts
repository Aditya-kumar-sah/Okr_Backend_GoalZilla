import { Module } from '@nestjs/common';
import { ObjectiveController } from './objective/objective.controller';
import { ObjectiveService } from './objective/objective.service';
import { ObjectiveModule } from './objective/objective.module';
import {ConfigModule} from "@nestjs/config";
import { KeyResultModule } from './key-result/key-result.module';

@Module({
  imports: [ObjectiveModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
})
export class AppModule {}
