import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/exception.filter';
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function whitelist(app) {

	app.use(function (req, res, next) {
		req.headers.origin = req.headers.origin || req.headers.host;
		next();
	});

	var whitelist = process.env.CORS_OPTION_ORIGIN.split(",");
	const corsOptions = {
		exposedHeaders: ['Content-Disposition'],
		'origin': function (origin, callback) {
			if (whitelist.indexOf(origin) !== -1) {
				console.log("allowed cors for:", origin)
				callback(null, true)
			} else {
				console.log("blocked cors for:", origin)
				callback(new Error('Not allowed by CORS'))
			}
		},
		'methods': "GET,HEAD,PUT,PATCH,POST,DELETE",
		'preflightContinue': false,
		'optionsSuccessStatus': 204,
		'credentials': true
	}

	app.enableCors(corsOptions);

	app.use(helmet());

}

function generateSwagger(app) {
	if (process.env.NODE_ENV !== 'production') {

		const config = new DocumentBuilder()
			.setTitle('API Documentation')
			.setDescription('API Overview The Book API provides access to information about books, including their title, author, ISBN number, and publication date. This API is intended for use by developers and businesses who want to build applications that provide information about books.')
			.setVersion('v1.0.0')
			.setContact('Yuma Andhika', 'https://www.linkedin.com/in/yuma-andhika/', 'yumandhika@gmail.com')
			.addBearerAuth()
			.build();

		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('api', app, document);
	}
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// whitelist(app)

	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(new ValidationPipe());

	generateSwagger(app);

	await app.listen(process.env.APP_PORT);
}
bootstrap();
