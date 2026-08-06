// Prayer Times plugin - No dependencies
// تـعـديـل : نـورديـن - ستيل عادي

let handler = async (m, { conn, args, usedPrefix }) => {
    // ===== Channel Info + Instagram =====
    const channelName = ''
    const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363410733859643@newsletter',
            newsletterName: `${instagram}`
        }
    }
    // ======================================

    let city = args.join(' ')
    if(!city) {
        return conn.sendMessage(m.chat, {
            text: `*📌 الـطـريـقـة:* ${usedPrefix}prayer <city>\n\n*مـثـال:* ${usedPrefix}prayer Oujda`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('⏳')

    try {
        let res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=MA&method=2`)
        let json = await res.json()
        
        if(json.code !== 200) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: `*❌ الـمـديـنـة غـيـر مـوجـودة*`,
                contextInfo: newsletter
            }, { quoted: m })
        }

        let timings = json.data.timings
        let date = json.data.date.readable
        let hijri = json.data.date.hijri.date

        let txt = `*📌 اوقـات الـصـلاة - ${city}*\n\n`
        txt += `*📅 الـتـاريـخ:* ${date}\n`
        txt += `*📆 هـجـري:* ${hijri}\n\n`
        txt += `*🌅 الـفـجـر:* ${timings.Fajr}\n`
        txt += `*☀️ الـشـروق:* ${timings.Sunrise}\n`
        txt += `*🌞 الـظـهـر:* ${timings.Dhuhr}\n`
        txt += `*🌤️ الـعـصـر:* ${timings.Asr}\n`
        txt += `*🌆 الـمـغـرب:* ${timings.Maghrib}\n`
        txt += `*🌙 الـعـشـاء:* ${timings.Isha}\n\n`
        txt += `*مـلاحـظـة:* الاوقـات حـسـب تـوقـيـت الـمـغـرب`

        await conn.sendMessage(m.chat, { 
            text: txt, 
            contextInfo: newsletter 
        }, { quoted: m })

        await m.react('✅')

    } catch(e) {
        console.log(e)
        await m.react('❌')
        await conn.sendMessage(m.chat, {
            text: `*❌ حـدث خـطـأ* تـأكـد مـن اسـم الـمـديـنـة`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['prayer <city>']
handler.tags = ['islam']
handler.command = /^(prayer|اوقات_الصلاة)$/i
handler.limit = false
handler.register = false
export default handler
