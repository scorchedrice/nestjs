import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 모든 클래스 validation 사용 명령어
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // class validator을 기준으로 임의로 타입 변형하는 것을 허용한다.
        enableImplicitConversion: true,
      },
      // validator decorator 없는 경우 입력 불가하도록 처리
      whitelist: true,
      // 잘못 보내면 에러까지 반환
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
