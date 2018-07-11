import { IRetsBody } from './IRetsBody';
import { findReplyCodeName } from '../tools/ReplyCode';

export class RetsError extends Error {
    public readonly errorCode: number;

    public constructor(name: string, code: number, message?: string) {
        super();
        this.name = name;
        this.errorCode = code;
        this.message = message || findReplyCodeName(code) || 'Unknown Reply Code';
    }

    public toString(): string {
        return `${this.name} (${this.errorCode}): ${this.message}`;
    }
}

export class RetsReplyError extends RetsError {
    public constructor(response: IRetsBody) {
        super('RetsReplyError', response.replyCode, response.replyText);
    }
}

export class RetsServerError extends RetsError {
    public constructor(status: number, message: string) {
        super('RetsServerError', status, message);
    }
}

export class RetsProcessingError extends RetsError {
    public constructor(error: Error) {
        super('RetsProcessingError', -1, error.toString());
    }
}

export class RetsParamError extends RetsError {
    public constructor(message: string) {
        super('RetsParamError', -1, message);
    }
}

export class RetsClientError extends RetsError {
    public constructor(message: string) {
        super('RetsClientError', -1, message);
    }
}

export class RetsPermissionError extends RetsError {
    public constructor(permission: string | string[]) {
        const permissions = permission instanceof Array ? permission : [permission];
        super('RetsPermissionError', -1, `Missing permission: ${permissions.join(', ')}`);
    }
}
