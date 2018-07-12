import { DdfCulture } from './DdfCulture';

export interface IRetsObjectOptions {
    mime?: string;
    resource: string;
    type: string;
    contentId: string;
    objectId?: string;
    withLocation?: boolean;
    culture?: DdfCulture;
}
