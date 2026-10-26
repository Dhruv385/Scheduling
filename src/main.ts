import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Account-APIs')
    .setDescription('Accounts')
    .setVersion('1.0')
    .addTag('accounts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap().catch((error) => {
  console.error('Failed to start application', error);
  process.exit(1);
});
