import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';

async function main() {
    const appOptions = { cors: true };
    const app = await NestFactory.create(ApplicationModule, appOptions);
    app.setGlobalPrefix('api');

    const options = new DocumentBuilder()
        .setTitle('Zombie API')
        .setDescription('Zombie API desc')
        .setVersion('1.0')
        .setBasePath('api')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);
    await app.listen(3000);
}
main();
