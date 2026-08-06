// ===== معلومات القناة =====
const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID, // بدّلها بالـ ID ديالك
        newsletterName: channelName
    }
}
// ========================

let handler = async (m, { conn, usedPrefix, command }) => {
    global.db.data.users = global.db.data.users || {}
    let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
    user.points = user.points || 0

    let cooldown = 3000
    if (new Date - user.lastslot < cooldown) return conn.sendMessage(m.chat, {
        text: `*انتـظـر 3 ثـوانـي قـبـل الـمحـاولة مـرة أخـــرى* ⏳`,
        contextInfo: newsletter
    }, { quoted: m })

    user.lastslot = new Date * 1

    let emojis = ['🍒', '🍋', '🍇', '🔔', '⭐', '💎', '7️⃣']
    let result = Array.from({length: 3}, () => emojis[Math.floor(Math.random() * emojis.length)])

    let caption = `*🎰 مـاكـيـنـة الـقـمـار*\n\n`
    caption += `${result[0]} | ${result[1]} | ${result[2]}\n\n`

    // 3 same = Jackpot
    if (result[0] === result[1] && result[1] === result[2]) {
        caption += `*الـنـتـيـجـة:* جـاكـبـوت! 🎉🎉\n*مـبـروك فـزت بـالـجـائـزة الـكـبـرى*`
    }
    // 2 same
    else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        caption += `*الـنـتـيـجـة:* فـــزت! 🥳\n*مـبـروك عـلـيـك*`
    }
    // Lose
    else {
        caption += `*الــنـتـيـجـة:* خـسـرت 💀\n*حـاول مـرة أخـــرى*`
    }

    caption += `\n\n`

    let buttons = [
        { buttonId: `${usedPrefix}لعبة_قمار`, buttonText: { displayText: '🔄 إعـادة' }, type: 1 },
        { buttonId: `${usedPrefix}قوانين_القمار`, buttonText: { displayText: '📜 الـقـوانـيـن' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        text: caption,
        footer: 'اضـغـط عـلـى الأزرار لـلـعـب',
        buttons: buttons,
        headerType: 1,
        contextInfo: newsletter
    }, { quoted: m })
}

// أمر القوانين
let rulesHandler = async (m, { conn }) => {
    let rules = `*📜 قـوانـيـن لـعـبـة الـقـمـار:*\n\n`
    rules += `• 3 مـتـشـابـهـيـن = جـاكـبـوت 🎉\n`
    rules += `• 2 مـتـشـابـهـيـن = فـوز 🥳\n`
    rules += `• لا شـيء = خـسـارة 💀\n`
    rules += `• كـولـداون: 3 ثـوانـي`
    
    await conn.sendMessage(m.chat, { text: rules, contextInfo: newsletter }, { quoted: m })
}

handler.help = ['لعبة_قمار', 'slots'];
handler.tags = ['العاب', 'game'];
handler.command = /^(لعبة_قمار|slots|slot|قمار)$/i;
handler.limit = false;

rulesHandler.help = ['قوانين_القمار', 'slotrules'];
rulesHandler.tags = ['العاب', 'game'];
rulesHandler.command = /^(قوانين_القمار|slotrules)$/i;

export { handler, rulesHandler };
export default handler;
