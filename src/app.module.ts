import { Module } from '@nestjs/common';
import { ObjectiveModule } from './objective/objective.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ObjectiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiModule,
  ],
})
export class AppModule {}
