//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | تـحـويـل سـتـيـكـر لـصـورة

let handler = async (m, { conn, usedPrefix, command }) => {
    // ===== مـعـلـومـات الـقـنـاة + انـسـتـا =====
    const channelName = '' // خـلـيـتـو خـاوي
    const instagram = 'adam.__.98'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363410733859643@newsletter',
            newsletterName: `IG : ${instagram}` // نـفـس yts
        }
    }
    // ==============================================

    const notStickerMessage = `*⚠️ الـرجـاء الـرد عـلـى سـتـيـكـر*\n\n*📌 مـثـال:*\n*${usedPrefix + command}*`
    
    if (!m.quoted) return conn.sendMessage(m.chat, {
        text: notStickerMessage,
        contextInfo: newsletter
    }, { quoted: m })

    const q = m.quoted || m
    let mime = (q.mtype || q.mediaType || '').toLowerCase()
    
    if (mime.includes('webp') || q.mtype === 'stickerMessage') {
        await m.react('⏳')
        let media = await q.download()
        
        // Convert sticker to image + signature فقط
        await conn.sendMessage(m.chat, {
            image: media, 
            caption: `*📥 مـحـول الـسـتـيـكـر*\n\n*✅ تـم الـتـحـويـل بـنـجـاح*\n\n*by ${instagram}*`, // نـفـس تـوقـيـع yts
            contextInfo: newsletter
        }, { quoted: m })
        
        await m.react('✅')
        
    } else {
        return conn.sendMessage(m.chat, {
            text: notStickerMessage,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['toimg <الـرد عـلـى سـتـيـكـر>'];
handler.tags = ['تـحـويـل'];
handler.command = /^(s2img|toimg|stickertoimg)$/i;
handler.limit = false;
export default handler
