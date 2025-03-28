import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    try {
        const playerData = await getPlayerData();

        if (playerData.length === 0) {
            return res.status(500).json({ error: 'No player data found' });
        }

        // এলোমেলোভাবে একটি প্লেয়ার নির্বাচন করুন (Gacha প্যাক সিস্টেম)
        const selectedPlayer = playerData[Math.floor(Math.random() * playerData.length)];

        res.status(200).json(selectedPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
}

async function getPlayerData() {
    const url = 'https://efootballhub.net/efootball23/compare-players';  // eFootballHub প্লেয়ার লিস্ট URL

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let playerData = [];

        $('table tbody tr').each((index, element) => {
            const tds = $(element).find('td');

            const name = $(tds[0]).text().trim();
            const image = $(tds[0]).find('img').attr('src'); // প্লেয়ার ইমেজ
            const position = $(tds[1]).text().trim();
            const playingStyle = $(tds[2]).text().trim();
            const cost = $(tds[3]).text().trim();
            const height = $(tds[4]).text().trim();
            const weight = $(tds[5]).text().trim();
            const age = $(tds[6]).text().trim();
            const strongerFoot = $(tds[7]).text().trim();

            const stats = {
                offensiveAwareness: $(tds[8]).text().trim(),
                dribbling: $(tds[9]).text().trim(),
                finishing: $(tds[10]).text().trim(),
                speed: $(tds[11]).text().trim(),
                acceleration: $(tds[12]).text().trim(),
                stamina: $(tds[13]).text().trim(),
                defensiveAwareness: $(tds[14]).text().trim(),
                tackling: $(tds[15]).text().trim(),
            };

            if (name && image) {
                playerData.push({ name, image, position, playingStyle, cost, height, weight, age, strongerFoot, stats });
            }
        });

        return playerData;
    } catch (error) {
        console.error('Error fetching data from eFootballHub:', error);
        return [];
    }
}