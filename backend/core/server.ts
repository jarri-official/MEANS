'use strict';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import * as swaggerTools from 'swagger-tools';
import * as jsyaml from 'js-yaml';
import * as fs from 'fs';
import {AppConfig} from './app.config';
import appModule from '../app/app.module';
import passportConfig from './passport.config';

class Server {
    public app: express.Application;
    private router = express.Router();

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.swagger();
    }

    public static bootstrap(): Server {
        return new Server();
    }

    private config(): void {
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'ejs');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static('public'));
        passportConfig(passport);
        this.app.use(passport.initialize());
    }

    private routes(): void {
        this.homeRoute();
        // this.userRoutes();
        this.app.use(this.router);
    }

    private homeRoute() {
        this.router.get('/', (req, res) => {
            res.render('index', {
                title: AppConfig.TITLE ? AppConfig.TITLE : ''
            });
        });
    }

    private userRoutes(): void {
        appModule(this.app);
    }

    private swagger() {
        const spec = fs.readFileSync(path.join(__dirname,'../../swagger/security.yaml'), 'utf8');
        const swaggerDoc = jsyaml.safeLoad(spec);

        const options = {
            swaggerUi: path.join(__dirname, '/swagger.json'),
            controllers: path.join(__dirname, '../controllers'),
            useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
        };

        swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
            // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
            this.app.use(middleware.swaggerMetadata());

            // Validate Swagger requests
            this.app.use(middleware.swaggerValidator());

            // Route validated requests to appropriate controller
            this.app.use(middleware.swaggerRouter(options));

            // Serve the Swagger documents and Swagger UI
            this.app.use(middleware.swaggerUi());
        });
    }
}

const server = Server.bootstrap();
module.exports = server.app;
