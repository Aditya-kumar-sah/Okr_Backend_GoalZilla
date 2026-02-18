import { Module } from '@nestjs/common';
import { ObjectiveModule } from './objective/objective.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ObjectiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
