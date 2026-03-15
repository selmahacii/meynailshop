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
        let message = 'An error occurred';
        let errors = [];
        if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            if (Array.isArray(exceptionResponse.message)) {
                errors = exceptionResponse.message;
                message = 'Validation failed';
            }
            else if (typeof exceptionResponse.message === 'string') {
                message = exceptionResponse.message;
            }
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
        let message = 'Internal server error';
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : res.message || 'Http Error';
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        console.error('🔥 [AllExceptionsFilter] Exception caught:', exception);
        response.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            error: process.env.NODE_ENV === 'development' ? (exception instanceof Error ? exception.name : 'Error') : undefined,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map