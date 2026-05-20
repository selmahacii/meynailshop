"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message = 'Une erreur est survenue';
        let errors = [];
        const frenchFallback = {
            [common_1.HttpStatus.UNAUTHORIZED]: "Votre session a expiré ou vos identifiants sont incorrects.",
            [common_1.HttpStatus.FORBIDDEN]: "Vous n'avez pas l'autorisation d'accéder à cette section.",
            [common_1.HttpStatus.NOT_FOUND]: "La ressource demandée n'existe pas ou plus.",
            [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: "Le serveur rencontre une difficulté technique. Veuillez réessayer plus tard.",
            [common_1.HttpStatus.BAD_REQUEST]: "Veuillez vérifier les informations saisies.",
        };
        if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            if (Array.isArray(exceptionResponse.message)) {
                errors = exceptionResponse.message;
                message = 'Certains champs sont invalides.';
            }
            else if (typeof exceptionResponse.message === 'string') {
                const rawMsg = exceptionResponse.message;
                if (rawMsg === 'Unauthorized' || rawMsg === 'Forbidden' || rawMsg === 'Not Found' || rawMsg === 'Bad Request') {
                    message = frenchFallback[status] || rawMsg;
                }
                else {
                    message = rawMsg;
                }
            }
        }
        else {
            message = frenchFallback[status] || message;
        }
        response.status(status).json({
            statusCode: status,
            message,
            errors: errors.length > 0 ? errors : undefined,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let message = 'Désolé, une erreur technique est survenue.';
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();
            const rawMessage = typeof res === 'string' ? res : res.message || 'Erreur inconnue';
            const mappings = {
                'Unauthorized': "Désolé, vous n'êtes pas autorisé à faire cela. Veuillez vous connecter.",
                'Forbidden': "Accès refusé. Veuillez vérifier vos droits.",
                'Not Found': "Désolé, cette page ou ce produit n'existe pas.",
                'Bad Request': "Les données saisies ne sont pas valides.",
            };
            message = mappings[rawMessage] || rawMessage;
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        console.error('🔥 [AllExceptionsFilter] Exception caught:', exception);
        response.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            error: exception instanceof Error ? exception.name : 'Error',
            stack: exception instanceof Error ? exception.stack : undefined,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map