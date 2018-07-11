const {
    RetsClient,
    RetsVersion,
    RetsFormat
} = require('./dist');

async function main() {
    const client = new RetsClient({
        url: 'http://data.crea.ca/Login.svc/Login',
        username: 'nQdsQXSJqSVqEUPA1yUg0mSQ',
        password: '2YHMkJogyjgdc7jsnskVb4GW',
        version: RetsVersion.CREA_DDF
    });

    await client.login();
    const result = await client.search({
        format: RetsFormat.StandardXml,
        query: '(ID=19155156)',
        searchType: 'Property',
        class: 'Property'
    });
    await client.logout();
}

main().then(() => {
    conosole.log('Test finished');
});
