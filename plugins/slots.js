let handler = async (m, { conn, usedPrefix, command }) => {
    // ===== Channel Info =====
    const channelName = 'GI : adam.__.98'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363410733859643@newsletter', // بدّلها بالـ ID ديالك
            newsletterName: channelName
        }
    }
    // ========================

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

    let caption = `*🎰 SLOTS FREE*\n\n`
    caption += `${result[0]} | ${result[1]} | ${result[2]}\n\n`

    // 3 same = Jackpot
    if (result[0] === result[1] && result[1] === result[2]) {
        caption += `*النتيجة:* جاكبوت! 🎉🎉\n*مبروك فزت*`
    }
    // 2 same
    else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        caption += `*النتيجة:* فـــزت! 🥳\n*مـبروك علـيـك*`
    }
    // Lose
    else {
        caption += `*الــنتـيــجــة:* خـسرت 💀\n*حـاول مـرة أخـــرى*`
    }

    caption += `\n\n`

    let buttons = [
        { buttonId: `${usedPrefix}slots`, buttonText: { displayText: '🔄 إعادة' }, type: 1 },
        { buttonId: `${usedPrefix}slotrules`, buttonText: { displayText: '📜 القوانين' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        text: caption,
        footer: 'اضغط على الأزرار للعب',
        buttons: buttons,
        headerType: 1,
        contextInfo: newsletter
    }, { quoted: m })
}

// أمر القوانين
let rulesHandler = async (m, { conn }) => {
    let rules = `*📜 قوانين لعبة السلوتس:*\n\n`
    rules += `• 3 متشابهين = جاكبوت 🎉\n`
    rules += `• 2 متشابهين = فوز 🥳\n`
    rules += `• لا شيء = خسارة 💀\n`
    rules += `• كولداون: 3 ثواني`
    
    await conn.sendMessage(m.chat, { text: rules }, { quoted: m })
}

handler.help = ['slots']
handler.tags = ['game']
handler.command = /^(slots|slot)$/i
handler.limit = false

rulesHandler.help = ['slotrules']
rulesHandler.tags = ['game']
rulesHandler.command = /^(slotrules)$/i

export { handler, rulesHandler }
export default handler
