import { findReplyCodeName } from '../tools/ReplyCode';
import { IRetsBody } from './IRetsBody';

/**
 * Basic RETS error
 */
export class RetsError extends Error {
    public readonly errorCode: number;

    /**
     * Create a RETS error
     * @param name Error name
     * @param code Error code (Rets reply code or other reasonable code)
     * @param message Error message
     */
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

/**
 * Error that returned from RETS server
 */
export class RetsReplyError extends RetsError {
    /**
     * Create a RETS reply error
     * @param response RETS response body
     */
    public constructor(response: IRetsBody) {
        super('RetsReplyError', response.replyCode, response.replyText);
    }
}

/**
 * Error when communicating with RETS server
 */
export class RetsServerError extends RetsError {
    /**
     * Create a RETS server error
     * @param status Status code
     * @param message Status message
     */
    public constructor(status: number, message: string) {
        super('RetsServerError', status, message);
    }
}

/**
 * Error when processing RETS server's response
 */
export class RetsProcessingError extends RetsError {
    /**
     * Create a RETS processing error
     * @param error Error content
     */
    public constructor(error: Error) {
        super('RetsProcessingError', -1, error.toString());
    }
}

/**
 * Error caused by RETS request parameter
 */
export class RetsParamError extends RetsError {
    /**
     * Create a RETS param error
     * @param message Error message
     */
    public constructor(message: string) {
        super('RetsParamError', -1, message);
    }
}

/**
 * Any other error caused by RETS client
 */
export class RetsClientError extends RetsError {
    /**
     * Create a RETS client error
     * @param message Error message
     */
    public constructor(message: string) {
        super('RetsClientError', -1, message);
    }
}
