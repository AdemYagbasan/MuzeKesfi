import https from 'https';

const newArticles = [
    { file: 'beylerbeyi.jpg', article: 'Beylerbeyi_Palace' },
    { file: 'yedikule.jpg', article: 'Yedikule_Fortress' },
    { file: 'tekfur.jpg', article: 'Palace_of_the_Porphyrogenitus' },
    { file: 'askeri.jpg', article: 'Istanbul_Military_Museum' },
    { file: 'tiesm.jpg', article: 'Museum_of_Turkish_and_Islamic_Arts' },
    { file: 'sadberk.jpg', article: 'Sadberk_Hanım_Museum' },
    { file: 'islambilim.jpg', article: 'Museum_of_the_History_of_Science_and_Technology_in_Islam' },
    { file: 'santral.jpg', article: 'SantralIstanbul' },
    { file: 'pelit.jpg', article: 'Pelit_Chocolate_Museum' },
    { file: 'madame.jpg', article: 'Madame_Tussauds_Istanbul' },
    { file: 'sealife.jpg', article: 'Sea_Life_Istanbul' },
    { file: 'borusan.jpg', article: 'Borusan_Contemporary' },
    { file: 'dogancay.jpg', article: 'Doğançay_Museum' },
    { file: 'kucuksu.jpg', article: 'Küçüksu_Palace' },
    { file: 'ataturk.jpg', article: 'Atatürk_Museum_(Şişli)' },
    { file: 'florence.jpg', article: 'Florence_Nightingale_Museum' },
    { file: 'isbank.jpg', article: 'İş_Bank_Museum' },
    { file: 'havaalani.jpg', article: 'Rahmi_M._Koç_Museum' }, // fallback
    { file: 'mozaik.jpg', article: 'Great_Palace_Mosaic_Museum' },
    { file: 'whirling.jpg', article: 'Galata_Mevlevi_Lodge' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'MuzeKasifPro/1.0 (museum-guide-app; contact@example.com)',
                'Accept': 'application/json',
            }
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchJSON(res.headers.location).then(resolve).catch(reject);
                return;
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`Invalid JSON`)); }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('Fetching new museum image URLs...\n');
    for (const { file, article } of newArticles) {
        try {
            const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`;
            const data = await fetchJSON(apiUrl);
            const thumb = data.thumbnail?.source || 'NO_THUMB';
            const url800 = thumb !== 'NO_THUMB' ? thumb.replace(/\/\d+px-/, '/800px-') : 'NO_IMAGE';
            console.log(`${file}|${url800}`);
        } catch (err) {
            console.log(`${file}|ERROR: ${err.message}`);
        }
        await sleep(1000);
    }
}

main().catch(console.error);
