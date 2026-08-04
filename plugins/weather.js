import moment from 'moment-timezone'

// ===== Channel Info + Instagram =====
const channelName = 'WEATHER MA'
const instagram = 'adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: `IG : ${instagram}`
    }
}
const instaLink = `https://instagram.com/${instagram}`
// ======================================

// لائحة 20 مدينة مغربية مشهورة
const MOROCCO_CITIES = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier',
    'Agadir', 'Oujda', 'Kenitra', 'Tetouan', 'Safi',
    'Meknes', 'Nador', 'El Jadida', 'Beni Mellal', 'Taza',
    'Khouribga', 'Mohammedia', 'Laayoune', 'Guelmim', 'Dakhla'
]

let handler = async (m, { conn, args, usedPrefix: _p }) => {
    let city = args.join(' ')

    // إلا كتب المدينة مباشرة.weather casablanca
    if(city) {
        return await getWeather(m, conn, city, _p)
    }

    // إلا كتب.weather بوحدها → طلع القائمة
    let sections = [
        {
            title: "🇲🇦 مـدن الـمـغـرب",
            rows: MOROCCO_CITIES.map((c, i) => ({
                title: `${i + 1}. ${c}`,
                description: `الـطـقـس فـي ${c}`,
                id: `${_p}weather ${c}`
            }))
        }
    ]

    let caption = `🌤️ *الـطـقـس فـي الـمـغـرب* 🌤️

*اخـتـر الـمـديـنـة لـمـعـرفـة الـطـقـس*
*او كـتـب.weather اسـم الـمـديـنـة*

© Powered By 👑 ${instagram} 👑`

    await conn.sendMessage(m.chat, {
        image: { url: 'https://i.imgur.com/8Km9tLL.jpg' },
        caption: caption,
        footer: { text: `WEATHER MA` },
        buttons: [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: '🌤️ اخـتـر مـديـنـتـك',
                    sections: sections
                }),
            },
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '📸 الانـسـتـغـرام',
                    url: instaLink
                }),
            }
        ],
        contextInfo: newsletter
    }, { quoted: m, mentions: [m.sender] })
}

async function getWeather(m, conn, city, _p) {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    await conn.sendMessage(m.chat, {
        text: `⏳ *كـنـشـوف الـطـقـس فـي ${city}...*`,
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
        let txt = `*🌤️ الـطـقـس فـي ${name}* 🌤️

📍 *الـبـلـد*: ${country}
🌡️ *الـحـرارة*: ${w.current.temperature_2m}°C
☁️ *الـحـالـة*: ${weather}
💧 *الـرطـوبـة*: ${w.current.relative_humidity_2m}%
💨 *الـريـاح*: ${w.current.wind_speed_10m} km/h
🔥 *الـعـظـمـى*: ${w.daily.temperature_2m_max[0]}°C
❄️ *الـصـغـرى*: ${w.daily.temperature_2m_min[0]}°C
📅 *الـتـحـديـث*: ${date}`

        await conn.sendMessage(m.chat, {
            text: txt,
            footer: { text: `WEATHER MA` },
            buttons: [
                {name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '🌤️ الـرجـوع لائـحـة الـمـدن', id: _p + 'weather'})}
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

handler.help = ['weather <city>']
handler.tags = ['info']
handler.command = /^(weather|حالة_الطقس)$/i
handler.limit = false
handler.register = false

export default handler
