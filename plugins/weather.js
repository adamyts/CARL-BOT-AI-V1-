// Weather plugin - No dependencies
// تـعـديـل : نـورديـن - ستيل عادي

let handler = async (m, { conn, args, usedPrefix }) => {
    // ===== Channel Info + Instagram =====
    const channelName = ''
    const instagram = 'adam.__.98'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363410733859643@newsletter',
            newsletterName: `IG : ${instagram}`
        }
    }
    // ======================================

    let city = args.join(' ')
    if(!city) return conn.sendMessage(m.chat, {
        text: `*📌 الـطـريـقـة:* ${usedPrefix}weather <city>\n\n*مـثـال:* ${usedPrefix}weather Oujda`,
        contextInfo: newsletter
    }, { quoted: m })

    await m.react('⏳')

    try {
        // 1. Get coordinates
        let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`)
        let geoJson = await geoRes.json()
        if(!geoJson.results) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: '*❌ الـمـديـنـة غـيـر مـوجـودة*',
                contextInfo: newsletter
            }, { quoted: m })
        }

        let { latitude, longitude, name, country } = geoJson.results[0]

        // 2. Get weather
        let weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
        let w = await weatherRes.json()

        // 3. Weather codes
        const codes = {
            0: '🌞 صـافـي', 1: '🌤️ غـائـم جـزئـيـا', 2: '⛅ غـائـم جـزئـيـا', 3: '☁️ غـائـم',
            45: '🌫️ ضـبـاب', 48: '🌫️ ضـبـاب كـثـيـف',
            51: '🌦️ رشـاش خـفـيـف', 53: '🌦️ رشـاش', 55: '🌧️ رشـاش قـوي',
            61: '🌧️ مـطـر خـفـيـف', 63: '🌧️ مـطـر', 65: '🌧️ مـطـر غـزيـر',
            71: '🌨️ ثـلـج خـفـيـف', 73: '🌨️ ثـلـج', 75: '🌨️ ثـلـج كـثـيـف',
            95: '⛈️ عـاصـفـة', 96: '⛈️ عـاصـفـة + بـرد', 99: '⛈️ عـاصـفـة قـويـة'
        }

        let weather = codes[w.current.weather_code] || '☁️ غـيـر مـعـروف'

        // Result
        let txt = `*📌 حـالـة الـطـقـس - ${name}*\n\n`
        txt += `*📍 الـدولـة:* ${country}\n`
        txt += `*🌡️ الـحـرارة:* ${w.current.temperature_2m}°C\n`
        txt += `*☁️ الـحـالـة:* ${weather}\n`
        txt += `*💧 الـرطـوبـة:* ${w.current.relative_humidity_2m}%\n`
        txt += `*💨 الـريـاح:* ${w.current.wind_speed_10m} km/h\n`
        txt += `*🔥 الـعـظـمـى:* ${w.daily.temperature_2m_max[0]}°C\n`
        txt += `*❄️ الـصـغـرى:* ${w.daily.temperature_2m_min[0]}°C`

        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: newsletter
        }, { quoted: m })

        await m.react('✅')

    } catch(e) {
        console.log(e)
        await m.react('❌')
        conn.sendMessage(m.chat, {
            text: '*❌ حـدث خـطـأ* تـأكـد مـن اسـم الـمـديـنـة و الـنـت',
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
