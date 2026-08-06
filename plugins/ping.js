//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | فـحـص سـرعـة الـبـوت

import { performance } from 'perf_hooks'

// ===== مـعـلـومـات الـقـنـاة + انـسـتـا =====
const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const newsletterJid = '120363410733859643@newsletter' // حـط الـمـعـرف ديـال الـقـنـاة ديـالـك هـنـا
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: newsletterJid,
        newsletterName: `${instagram}`
    }
}
// =================================================

let handler = async (m, { conn }) => {
    let timestamp = performance.now()
    let latency = (performance.now() - timestamp).toFixed(6)

    // الـرد نـقـي: الـوقـت فـقـط
    let txt = `*⚡ سـرعـة الاسـتـجـابـة:* ${latency} ثـانـيـة`
    
    await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: newsletter
    }, { quoted: m })
}

handler.help = ['ping'];
handler.tags = ['مـعـلـومـات'];
handler.command = /^(ping|فحص)$/i;
handler.limit = false;
handler.register = false;

export default handler;
