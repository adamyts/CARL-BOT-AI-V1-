import fs from 'fs'

const channelName = 'GI : adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter'
const IMG_URL = 'https://files.catbox.moe/7w2ny2.jpg' // صورتك

const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

const dbPath = './database/ratings.json'
if(!fs.existsSync('./database')) fs.mkdirSync('./database')
if(!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}))

let loadDB = () => JSON.parse(fs.readFileSync(dbPath))
let saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

async function sendToChannel(conn, text) {
    try {
        await conn.sendMessage(CHANNEL_ID, { text: text, contextInfo: newsletter })
    } catch(e) {
        console.log('خطأ في الإرسال للقناة:', e)
    }
}

// رسائل مختلفة لكل تقييم
const messages = {
    1: `*شكراً على تقييمك* ⭐\n\nنأسف إذا لم يعجبك البوت 💔\nسنحاول تحسينه أكثر إن شاء الله. رأيك يهمنا كثيراً`,
    2: `*شكراً على تقييمك* ⭐⭐\n\nنعلم أننا بحاجة للمزيد من العمل 🙏\nنوعدك أننا سنطور البوت حتى ينال إعجابك في المرة القادمة`,
    3: `*شكراً على تقييمك* ⭐⭐⭐\n\nتقييم متوسط ومقبول 😄\nإن شاء الله في المرات القادمة سنصل للمستوى الذي تستحقه`,
    4: `*شكراً على تقييمك* ⭐⭐⭐⭐\n\nجزاك الله خيراً ❤️\nأسعدنا تقييمك. سنستمر في العمل للوصول إلى 5⭐`,
    5: `*شكراً على تقييمك* ⭐⭐⭐⭐⭐\n\nالبوت رائع بالنسبة لك 😍\nشكراً على دعمك. هذا يمنحنا دافعاً أكبر للتطوير`,
    6: `*شكراً على تقييمك* ⭐⭐⭐⭐⭐⭐\nما شاء الله 6/6!!! 👑🔥\nأنت رسمياً من الداعمين لنا. بارك الله فيك`
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let db = loadDB()
    let chatId = m.chat

    // إذا ضغط على نجمة من 1 إلى 6
    if(text && /^[1-6]$/.test(text)) {
        let stars = parseInt(text)
        if(!db[chatId]) db[chatId] = { ratings: [] }

        // نحذف التقييم السابق للمستخدم ونضيف الجديد
        db[chatId].ratings = db[chatId].ratings.filter(r => r.user !== m.sender)
        db[chatId].ratings.push({ user: m.sender, stars, date: Date.now() })
        saveDB(db)

        let avg = (db[chatId].ratings.reduce((a,b) => a + b.stars, 0) / db[chatId].ratings.length).toFixed(1)

        let channelMsg = `*📊 تصويت جديد*\n\nالتقييم: ${'⭐'.repeat(stars)}\n*المتوسط:* ${avg} ⭐\n*المجموع:* ${db[chatId].ratings.length} تصويت\nمن: @${m.sender.split('@')[0]}`
        await sendToChannel(conn, channelMsg)

        // رد نص فقط
        return m.reply(messages[stars])
    }

    // القائمة الرئيسية - نفس sendButton الموجود في menu.js
    await conn.sendButton(m.chat, {
        image: { url: IMG_URL },
        caption: `*🎉 تــقــيــيــم الــبــوت 🎉*\n\nكـيـف كـانـت تـجـربـتـك مـع الـبـوت؟\n\n*اخــتــر مــن 1⭐ إلــى 6⭐*`,
        footer: { text: 'CARL-BOT' },
        buttons: [
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '⭐', id: `${usedPrefix}rate 1`}) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '⭐⭐', id: `${usedPrefix}rate 2`}) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '⭐⭐⭐', id: `${usedPrefix}rate 3`}) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '⭐⭐⭐⭐', id: `${usedPrefix}rate 4`}) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '⭐⭐⭐⭐⭐', id: `${usedPrefix}rate 5`}) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '⭐⭐⭐⭐⭐⭐', id: `${usedPrefix}rate 6`}) }
        ],
        contextInfo: newsletter
    }, { quoted: m, mentions: [m.sender] })
}

handler.help = ['rate', 'تقييم']
handler.tags = ['info']
handler.command = /^(rate|تقييم|قيم)$/i
export default handler
