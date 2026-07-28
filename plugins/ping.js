//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | فـحـص سـرعـة الـبـوت

import { performance } from 'perf_hooks'

// ===== مـعـلـومـات الـقـنـاة + انـسـتـا =====
const instagram = 'adam.__.98'
const newsletterJid = '120363410733859643@newsletter' // حـط الـمـعـرف ديـال الـقـنـاة ديـالـك هـنـا
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: newsletterJid,
        newsletterName: `IG : ${instagram}`
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
handler.command = /^(ping)$/i;
handler.limit = false;
handler.register = false;

export default handler;
