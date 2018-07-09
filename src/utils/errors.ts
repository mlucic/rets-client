import { findReplyCodeName } from './ReplyCode';

export class RETSError extends Error {
    public readonly errorCode: number;

    public constructor(name: string, code: number) {
        super();
        this.name = name;
        this.errorCode = code;
        this.message = findReplyCodeName(code) || 'Unknown Reply Code';
    }

    public toString(): string {
        return `${this.name} (${this.errorCode}): ${this.message}`;
    }
}

export class RETSReplyError extends RETSError {
    public constructor(code: number) {
        super('RETSReplyError', code);
    }
}

export class RETSServerError extends RETSError {
    public constructor(code: number) {
        super('RETSServerError', code);
    }
}

export class RETSProcessingError extends RETSError {
    public constructor(code: number) {
        super('RETSProcessingError', code);
    }
}

export class RETSParamError extends RETSError {
    public constructor(code: number) {
        super('RETSParamError', code);
    }
}

export class RETSPermissionError extends RETSError {
    public constructor(code: number) {
        super('RETSPermissionError', code);
    }
}
