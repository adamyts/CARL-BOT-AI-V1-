// plugin by noureddine ouafy - Command: register
// instagram.com/noureddine_ouafy
// تـعـديـل : نـورديـن

// ─── Channel Info Only ─────────────────────────────────────────────
const channelName = 'GI : adam.__.98'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363410733859643@newsletter', // <-- change this to yours
        newsletterName: channelName
    }
}

let handler = async (m, { conn, usedPrefix, text }) => {
    try {
        global.db.data.users = global.db.data.users || {}
        let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
        user.points = Number(user.points) || 0 

        let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/Q9vVJcM/default.jpg')

        // 1. If no text, show info / how to register
        if(!text) {
            if(!user.registered) return conn.sendMessage(m.chat, {
                text: `*📌 الـطـريـقـة:* \n${usedPrefix}register <name> <age> <country>\n\n*مـثـال:* ${usedPrefix}register Ahmed 17 Morocco`,
                contextInfo: newsletter
            }, { quoted: m })

            let time = new Date(user.regTime).toLocaleString('en-US', { timeZone: 'Africa/Casablanca' })
            let txt = `*📌 مـعـلـومـاتـك:*\n\n`
            txt += `*👤 الاسـم:* ${user.name}\n`
            txt += `*🎂 الـعـمـر:* ${user.age}\n`
            txt += `*🌍 الـدولـة:* ${user.country}\n`
            txt += `*📅 تـاريـخ الـتـسـجـيـل:* ${time}`

            return await conn.sendMessage(m.chat, { image: { url: pp }, caption: txt, contextInfo: newsletter }, { quoted: m })
        }

        // 2. If text exists, update info
        let args = text.trim().split(/ +/) 
        let country = args.slice(2).join(' ') 
        let [name, age] = args

        if (!name || !age || !country) return conn.sendMessage(m.chat, {
            text: `*❌ تـنـسـيـق خـاطـئ*\n\n*الـصـحـيـح:* ${usedPrefix}register <name> <age> <country>`,
            contextInfo: newsletter
        }, { quoted: m })

        age = Number(age)
        if (isNaN(age)) return conn.sendMessage(m.chat, { text: `*❌ الـعـمـر خـاصـو يـكـون رقـم*`, contextInfo: newsletter }, { quoted: m })
        if (age < 5 || age > 100) return conn.sendMessage(m.chat, { text: `*❌ عـمـر غـيـر صـالـح*`, contextInfo: newsletter }, { quoted: m })

        let wasRegistered = user.registered

        user.name = name
        user.age = age
        user.country = country
        user.regTime = Date.now()
        user.registered = true

        let text2 = `*✅ ${wasRegistered? 'تـم الـتـحـديـث' : 'تـم الـتـسـجـيـل بـنـجـاح'}*\n\n`
        text2 += `*👤 الاسـم:* ${user.name}\n`
        text2 += `*🎂 الـعـمـر:* ${user.age}\n`
        text2 += `*🌍 الـدولـة:* ${user.country}`

        await conn.sendMessage(m.chat, { image: { url: pp }, caption: text2, contextInfo: newsletter }, { quoted: m })

    } catch (e) {
        console.log(e)
        conn.sendMessage(m.chat, { text: `*❌ خـطـأ:* ${e.message}`, contextInfo: newsletter }, { quoted: m })
    }
}

handler.help = ['register <name> <age> <country>'];
handler.tags = ['main'];
handler.command = /^(daftar|تسجيل|register)$/i;
export default handler;
