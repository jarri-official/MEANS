import {SecurityService} from './security.service';
import {LoginParameters} from '../../models/models';
import {errorHandler} from '../../../core/core.controller';

const securityService: SecurityService = new SecurityService();

export function loginHandler(req, res, next) {
    const content: LoginParameters = req.swagger.params['content'].value;

    securityService.validateUser(content)
        .subscribe(userId => {
            if (userId) {
                SecurityService.setCookie(res, userId);
                return res.status(200).send();
            }

            return res.status(403).send();
        }, err => errorHandler(res, err));
}

export function userNewHandler(req, res, next) {
    const content: any = req.swagger.params['content'].value;
    securityService.createUser(content)
        .subscribe(() => {
            return res.status(200).send();
        }, err => errorHandler(res, err));
}

export function currentUserQuery(req, res, next) {
    res.send('user!');
}
