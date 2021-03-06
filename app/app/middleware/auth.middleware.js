"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../modules/security/user.model");
exports.default = (req, res, next, unprotected) => {
    if (unprotected.indexOf(req.url) !== -1) {
        return next();
    }
    user_model_1.User.findById(req.auth.id)
        .then(({ username, firstname, surname }) => {
        if (username) {
            req.user = {
                username,
                firstname,
                surname
            };
            return next();
        }
        res.status(500).send('Nie znaleziono użytkownika');
    })
        .catch(err => {
        res.status(500).send('Wystąpił bład autoryzacji');
    });
};
