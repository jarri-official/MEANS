import * as express from 'express';

export class RoutesController {
    constructor(protected app: express.Application,
                protected router: express.Router) {
    }

    public static bootstrap(app: express.Application, router: express.Router) {
    }
}