// ===== معلومات القناة =====
const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const CHANNEL_ID = '120363410733859643@newsletter'

const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// =================================================

let handler = async (m, { conn }) => {
    let q = m.quoted? m.quoted : m
    let msg = q.msg || q
    let mime = msg.mimetype || ''

    if (!mime) return conn.sendMessage(m.chat, { text: '*❌ رد عـلـى صـورة او فيـديـو او مـلـف*', contextInfo: newsletter }, { quoted: m })

    let loading = await conn.sendMessage(m.chat, { text: '*⏱️ انتــظــر ثــوانــــي*', contextInfo: newsletter }, { quoted: m })

    try {
        // تحميل
        let buffer = await q.download?.() || await conn.downloadMediaMessage(q)

        // رفع
        const fileName = msg.fileName || `file.${mime.split('/')[1] || 'bin'}`
        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', new Blob([buffer]), fileName)

        let res = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: form
        })

        let url = await res.text()
        if (!url || url.includes('error')) throw new Error(url)

        let directLink = url.replace('https://catbox.moe/', 'https://files.catbox.moe/')

        await conn.sendMessage(m.chat, { delete: loading.key })
        
        // النتيجة بمعرف القناة
        await conn.sendMessage(m.chat, {
            text: `✅ *تـــم رفــع بنــجــاح*

📎 *المــلـف:* ${fileName}
🔗 *الــرابــط المبـاشـر:*
${directLink}`,
            contextInfo: newsletter
        }, { quoted: m })

    } catch(e) {
        await conn.sendMessage(m.chat, { delete: loading.key })
        conn.sendMessage(m.chat, { text: `❌ *خـطـأ*\n${e.message}`, contextInfo: newsletter }, { quoted: m })
    }
}

handler.help = ['رفع']
handler.tags = ['tools']
handler.command = /^(رفع|رابط|الرابط)$/i
handler.limit = false

export default handler
