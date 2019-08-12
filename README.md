# NodeJS RETS/DDF Client

A RETS (Real Estate Transaction Standard) and DDF (Data Distribution Facility) client.

Forked from sbruno81/rets-client but totally rewritten by TypeScript.

## Features

* Search
* GetObject

## How to use

```typescript
import { RetsClient, RetsVersion } from 'rets-ddf-client';

const client = new RetsClient({
    url: '...',
    username: '...',
    password: '...',
    version: RetsVersion.CREA_DDF
});

await client.login();
const listing = await client.search({
    format: RetsFormat.StandardXml,
    query: '...',
    searchType: '...',
    class: '...',
    culture: DdfCulture.EN_CA
});
const result = await client.getObjects({
    resource: '...',
    type: '...',
    content: {
        '...': '* or specific object ID(s)'
    }
    withLocation: false
});
await client.logout();

```
