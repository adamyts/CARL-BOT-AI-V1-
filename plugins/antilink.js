// instagram.com/noureddine_ouafy
let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    if (!m.text) return
    
    let chat = global.db.data.chats[m.chat]
    if (!chat.antilink) return // ← مهم: يخدم غير ملي يكون مفعل

    // Regex للروابط ديال الواتساب مجموعات وقنوات
    const regex = /https?:\/\/(chat\.whatsapp\.com|whatsapp\.com\/channel)\/[A-Za-z0-9]+/i

    if (regex.test(m.text)) {
        if (isAdmin) return // الادمين مسموح ليه
        if (!isBotAdmin) return m.reply('*⚠️ البـوت ليــس مـشـرف فـي الـمجـمـوعـة لـذلـك لا يسـتـطيـع الـحـذف الـرابـط*')

        let user = `@${m.sender.split('@')[0]}`
        
        // 1. حذف الرسالة
        try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}
        
        // 2. تحذير + طرد
        await conn.sendMessage(
            m.chat,
            {
                text: `⚠️ *تـم اكـتـشاف رابــط مـمـنـوع!*\n\nالــعــضـو ${user} تــم طـرده لأنـه أرســل رابـط مـجـمـوعـة/قـنـاة.\n\n🚫 إرسـال الـروابـط مـمـنـوع فـي هـذه الـمـجـمـوعـة.`,
                mentions: [m.sender]
            },
            { quoted: m }
        )

        // 3. طرد العضو
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
    }
}

export default handler
