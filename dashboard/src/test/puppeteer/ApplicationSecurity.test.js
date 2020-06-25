const puppeteer = require('puppeteer');
const utils = require('./test-utils');
const init = require('./test-init');
const { Cluster } = require('puppeteer-cluster');

require('should');

// user credentials
const email = utils.generateRandomBusinessEmail();
const password = '1234567890';

describe('Application Security Page', () => {
    const operationTimeOut = 500000;

    let cluster;
    beforeAll(async done => {
        jest.setTimeout(operationTimeOut);

        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            puppeteerOptions: utils.puppeteerLaunchConfig,
            puppeteer,
            timeout: operationTimeOut,
        });

        cluster.on('error', err => {
            throw err;
        });

        await cluster.execute({ email, password }, async ({ page, data }) => {
            const user = {
                email: data.email,
                password: data.password,
            };
            // user
            await init.registerUser(user, page);
            await init.loginUser(user, page);
            done();
        });
    });

    afterAll(async done => {
        await cluster.idle();
        await cluster.close();
        done();
    });

    test(
        'should create an application security',
        async done => {
            const component = 'Test Component';
            const gitUsername = utils.gitCredential.gitUsername;
            const gitPassword = utils.gitCredential.gitPassword;
            const gitRepositoryUrl = utils.gitCredential.gitRepositoryUrl;
            const applicationSecurityName = 'Test';

            await cluster.execute(null, async ({ page }) => {
                await init.addComponent(component, page);

                await page.waitForSelector('#security', { visible: true });
                await page.click('#security');
                await page.waitForSelector('#application', { visible: true });
                await page.click('#application');

                await page.waitForSelector('#applicationSecurityForm', {
                    visible: true,
                });
                await page.click('#addCredentialBtn');
                await page.waitForSelector('#gitCredentialForm', {
                    visible: true,
                });
                await page.click('#gitUsername');
                await page.type('#gitUsername', gitUsername);
                await page.click('#gitPassword');
                await page.type('#gitPassword', gitPassword);
                await page.click('#addCredentialModalBtn');
                await page.waitForSelector('#gitCredentialForm', {
                    hidden: true,
                });

                await page.click('#name');
                await page.type('#name', applicationSecurityName);
                await page.click('#gitRepositoryUrl');
                await page.type('#gitRepositoryUrl', gitRepositoryUrl);
                await page.click('#gitCredential');
                await page.type('#gitCredential', gitUsername); // select the created credential
                await page.keyboard.press('Enter'); // Enter Key
                await page.click('#addApplicationBtn');

                const applicationSecurity = await page.waitForSelector(
                    `#applicationSecurityHeader_${applicationSecurityName}`,
                    { visible: true }
                );
                expect(applicationSecurity).toBeDefined();
            });
            done();
        },
        operationTimeOut
    );
});
