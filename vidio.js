const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const delay = require('delay');

const randstr = length => {
    var text = "";
    var possible =
        "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const randnmr = length => {
    var text = "";
    var possible =
        "0123456789109876543210";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const get_start = () => new Promise((resolve, reject) => {
    fetch(`https://www.vidio.com/api/partner/auth`, {
        method: "POST",
        headers: {
            'referer': 'androidtv-app://com.vidio.android.tv',
            'x-api-platform': 'tv-android',
            'x-api-auth': 'laZOmogezono5ogekaso5oz4Mezimew1',
            'user-agent': 'tv-android/1.84.0 (405)',
            'x-api-app-info': 'tv-android/7.1.2/1.84.0-405',
            'accept-language': 'en',
            'x-visitor-id': `${randstr(16)}`,
            'content-type': 'application/json; charset=UTF-8',
            'accept-encoding': 'gzip',
        },
        body: JSON.stringify({
            'serial_number': randnmr(8),
            'partner_agent': 'tcl'
        })
    })
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(err => reject(err))
});

const get_login = (emailPartner, tokenPartner, email, password) => new Promise((resolve, reject) => {
    fetch(`https://www.vidio.com/api/login`, {
        method: "POST",
        headers: {
            'referer': 'androidtv-app://com.vidio.android.tv',
            'x-api-platform': 'tv-android',
            'x-api-auth': 'laZOmogezono5ogekaso5oz4Mezimew1',
            'user-agent': 'tv-android/1.84.0 (405)',
            'x-api-app-info': 'tv-android/7.1.2/1.84.0-405',
            'accept-language': 'en',
            'x-visitor-id': `${randstr(16)}`,
            'x-user-email': `${emailPartner}`,
            'x-user-token': `${tokenPartner}`,
            'content-type': 'application/x-www-form-urlencoded',
            'accept-encoding': 'gzip',
        },
        body: `login=${email}&password=${password}`
    })
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(err => reject(err))
});

(async () => {
    console.log("////////////////////////////////////// ")
    console.log("//////////  Vidio nodejs  //////////// ")
    console.log("///// Auto create & Subscription ///// ")
    console.log("//////////// By Wahdalo ////////////// ")
    console.log("////////////////////////////////////// ")
    console.log("\n")
    const numberOfAccounts = 10;
        for (let i = 0; i < numberOfAccounts; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const email = `${firstName}${lastName}${await randstr(5)}@gmail.com`.toLowerCase();
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('https://www.vidio.com/users/sign_up?user_return_to=https%3A%2F%2Fwww.vidio.com%2F', { waitUntil: 'networkidle2' });
            await page.type('#onboarding-register-email', email);
            const password = 'Tytydkuda123#';
            await page.type('#onboarding-register-password', password);
            await page.click('#onboarding-form-submit');
            await page.waitForSelector('.error-message, .success-message', { timeout: 10000 }).catch(() => {})
            await delay(2000)
            try {
                console.log("[+] Proses Upgrade Akun..");
                const start = await get_start();
                const emailPartner = start.auth.email
                const tokenPartner = start.auth.authentication_token
                const login_subs = await get_login(emailPartner, tokenPartner, email, password);
                const userToken = login_subs.auth.authentication_token
                console.log("[+] Email : ", email);
                console.log("[=] User token : ", userToken);
                console.log("[=] UUID =", randstr(16))
                console.log("[√] Sukses Upgrade Akun")
                await delay(2000)
                await page.goto("https://www.vidio.com/dashboard/transaction/histories")
                const subs = await page.$eval("#section-dashboard-history-subscription > ul > li > a > div > div > h3", el => el.innerText)
                const active = await page.$eval("#section-dashboard-history-subscription > ul > li > a > div > span.dashboard-transaction-history__detail-transaction-description", el => el.innerText)
                console.log(`[√] ${subs}, Aktif ${active}`)
                const inputData = `${email}|${password}|${subs}|Aktif ${active}\n`;
                fs.appendFile('vidio.txt', inputData, (err) => {
                    if (err) throw err;
                    console.log(`[=] Data ${email} telah disimpan ke vidio.txt`); 
                });
                await delay(3000)
                await browser.close();
                console.log("\n")
            } catch (err) {
                console.log(err)
                await browser.close();
                console.log("\n")
                continue
            }
        }
})();