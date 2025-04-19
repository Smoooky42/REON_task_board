import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe({ transform: true })) // Иначе писать у каждого метода @UsePipes(new ValidationPipe())

	app.enableCors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	const configSwagger = new DocumentBuilder()
		.setTitle('Reon-task-board API')
		.setDescription('The Reon-task-board API description')
		.setVersion('1.0')
		.addTag('Reon-task-board')
		.build()
	const documentFactory = () =>
		SwaggerModule.createDocument(app, configSwagger);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(process.env.PORT ?? 5000)
}
bootstrap()
