import moment from 'moment-timezone'

// ===== Channel Info + Instagram =====
const channelName = 'WEATHER MA'
const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: `${instagram}`
    }
}
const instaLink = `https://instagram.com/${instagram}`
// ======================================

let handler = async (m, { conn, args, usedPrefix: _p }) => {
    let city = args.join(' ')

    // إلا كتب المدينة مباشرة.الطقس casablanca
    if(city) {
        return await getWeather(m, conn, city, _p)
    }

    // إلا كتب.الطقس بوحدها → طلع رسالة الشرح بلا قائمة
    let caption = `🌤️ *الـطـقـس فـي الـمـغـرب* 🌤️\n\n`
    caption += `*اخـتـر الـمـديـنـة لـمـعـرفـة الـطـقـس*\n\n`
    caption += `*مـثـل*\n\`${_p}الـطـقـس casablanca\`\n`
    caption += `\`${_p}الـطـقـس agadir\`\n`
    caption += `\`${_p}الـطـقـس rabat\`\n\n`
    caption += `By adam.__.98`

    await conn.sendMessage(m.chat, {
        text: caption,
        footer: { text: `WEATHER MA` },
        buttons: [
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '📸 الانـسـتـغـرام',
                    id: instaLink
                }),
            }
        ],
        contextInfo: newsletter
    }, { quoted: m, mentions: [m.sender] })
}

async function getWeather(m, conn, city, _p) {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    await conn.sendMessage(m.chat, {
        text: `⏳ *يـتـم البـحـث عـن حـالـة الطـقس ${city}...*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        // 1. Get coordinates
        let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ar`)
        let geoJson = await geoRes.json()
        if(!geoJson.results) {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
            return conn.sendMessage(m.chat, {
                text: '❌ *الـمـديـنـة غـيـر مـوجـودة*',
                contextInfo: newsletter
            }, { quoted: m })
        }

        let { latitude, longitude, name, country } = geoJson.results[0]

        // 2. Get weather
        let weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Africa/Casablanca`)
        let w = await weatherRes.json()

        // 3. Weather codes
        const codes = {
            0: '🌞 صـافـي', 1: '🌤️ غـائـم جـزئـيـا', 2: '⛅ غـائـم جـزئـيـا', 3: '☁️ غـائـم',
            45: '🌫️ ضـبـاب', 48: '🌫️ ضـبـاب كـثـيـف',
            51: '🌦️ رذاذ خـفـيـف', 53: '🌦️ رذاذ', 55: '🌧️ رذاذ كـثـيـف',
            61: '🌧️ مـطـر خـفـيـف', 63: '🌧️ مـطـر', 65: '🌧️ مـطـر غـزيـر',
            71: '🌨️ ثـلـج خـفـيـف', 73: '🌨️ ثـلـج', 75: '🌨️ ثـلـج كـثـيـف',
            95: '⛈️ عـاصـفـة', 96: '⛈️ عـاصـفـة مـع بـرد', 99: '⛈️ عـاصـفـة شـديـدة'
        }

        let weather = codes[w.current.weather_code] || '☁️ غـيـر مـعـروف'
        let date = moment().tz('Africa/Casablanca').format('DD/MM/YYYY HH:mm')

        // Result
        let txt = `*🌤️ الـطـقـس فـي ${name}* 🌤️\n\n`
        txt += `📍 *الـبـلـد*: ${country}\n`
        txt += `🌡️ *الـحـرارة*: ${w.current.temperature_2m}°C\n`
        txt += `☁️ *الـحـالـة*: ${weather}\n`
        txt += `💧 *الـرطـوبـة*: ${w.current.relative_humidity_2m}%\n`
        txt += `💨 *الـريـاح*: ${w.current.wind_speed_10m} km/h\n`
        txt += `🔥 *الـعـظـمـى*: ${w.daily.temperature_2m_max[0]}°C\n`
        txt += `❄️ *الـصـغـرى*: ${w.daily.temperature_2m_min[0]}°C\n`
        txt += `📅 *الـتـحـديـث*: ${date}`

        await conn.sendMessage(m.chat, {
            text: txt,
            footer: { text: `WEATHER MA` },
            buttons: [
                {name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '🌤️ بـحـث جـديـد', id: _p + 'الـطـقـس'})}
            ],
            contextInfo: newsletter
        }, { quoted: m, mentions: [m.sender] })

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

    } catch(e) {
        console.log(e)
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        conn.sendMessage(m.chat, {
            text: '❌ *خـطـأ* تـحـقـق مـن اسـم الـمـديـنـة والانـتـرنـت',
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['الـطـقـس <المدينة>'];
handler.tags = ['info'];
handler.command = /^(الـطـقـس|weather|حالة_الطقس)$/i;
handler.limit = false;
handler.register = false;

export default handler;
