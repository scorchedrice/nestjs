import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostsModel} from "./posts/entities/posts.entity";
import { UsersModule } from './users/users.module';
import {UsersModel} from "./users/entity/users.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        PostsModel,
        UsersModel,
      ],
      // 개발환경에선 싱크 맞추는게 편리. 그 외는 false
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
