// ============================================
// Description: AI Image Generation using Nano Banana Pro API
// تـعـديـل : نـورديـن - ستيل عادي
// ============================================

// ─── Channel Info ─────────────────────────────────────────────
const channelName = 'GI : adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter' // <-- حط هنا معرف القناة ديال daily
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        return conn.sendMessage(m.chat, { 
            text: `*📌 الـطـريـقـة:* ${usedPrefix + command} <description>\n\n*مـثـال:* ${usedPrefix + command} نـهـر بـانـمـي واضـح`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, { 
        text: `*⏳ جـاري تـولـيـد الـصـورة...*`,
        contextInfo: newsletter
    }, { quoted: m })

    const prompt = encodeURIComponent(text)

    try {
        const apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro?prompt=${prompt}`
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!data.success || !data.image) {
            throw new Error('Failed to get image URL')
        }

        await conn.sendMessage(m.chat, {
            image: { url: data.image },
            caption: `*✅ تـم تـولـيـد الـصـورة بـنـجـاح*\n\n*الـوصـف:* ${text}`,
            contextInfo: newsletter
        }, { quoted: m })

        await m.react('✅')

    } catch (err) {
        console.error(err)
        await m.react('❌')
        await conn.sendMessage(m.chat, { 
            text: `*❌ فـشـل تـولـيـد الـصـورة*\n\n*الـسـبـب:* ${err.message}`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['imagine <description>']
handler.tags = ['ai']
handler.command = /^(imagine|aiimg)$/i
handler.limit = false 

export default handler
