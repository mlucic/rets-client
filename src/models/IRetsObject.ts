import { IRetsBody } from './IRetsBody';

export interface IRetsObject {
    type: string;
    id?: string;
    description?: string;
    address?: string;
    content?: Buffer;
    error?: IRetsBody;
}
