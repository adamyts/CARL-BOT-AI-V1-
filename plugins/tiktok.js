import axios from 'axios'

// ===== معلومات القناة + انستغرام =====
const channelName = ''
const instagram = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363410733859643@newsletter',
        newsletterName: `${instagram}`
    }
}
// =================================================

let handler = async (m, { conn, text, usedPrefix }) => {

  if (!text) {
    return conn.sendMessage(m.chat, {
        text: `*📥 تـحـميـل فـيـديـوهـات تيـكتـوك*\n\n📌 *طـريـقـة الاسـتـعـمـال:* \`${usedPrefix}تيكتوك الـرابـط\`\n💡 *مـثـال:* \`${usedPrefix}تيكتوك https://vt.tiktok.com/xxx\``,
        contextInfo: newsletter
    }, { quoted: m })
  }

  await m.react('⏳')
  let s = await conn.sendMessage(m.chat, { text: '⏳ *كـنـحـمـل الـفـيـديـو ديـال تـيـكـتـوك...*', contextInfo: newsletter }, { quoted: m })

  try {
    const encodedParams = new URLSearchParams()
    encodedParams.set("url", text)
    encodedParams.set("hd", "1")

    const { data } = await axios({
        method: "POST",
        url: "https://tikwm.com/api/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: "current_language=en",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
        data: encodedParams,
        timeout: 20000
    })

    if (!data.data || !data.data.play) {
        return conn.sendMessage(m.chat, { text: '❌ *فـشـل فـجـلـب الـفـيـديـو.* الـرابـط مـاشـي صـحـيـح', edit: s.key, contextInfo: newsletter })
    }

    let v = data.data
    let title = v.title || 'بـلا عـنـوان'
    let author = v.author?.nickname || v.author?.unique_id || 'مـجـهـول'
    let views = v.play_count?.toLocaleString() || '0'
    let likes = v.digg_count?.toLocaleString() || '0'
    let comments = v.comment_count?.toLocaleString() || '0'

    // ما كنمسحو ما كنعدلو رسالة التحميل - نخليوها
    // كنصيفطو الفيديو جديد

    let caption = `*🔍 الـعـنـوان:* ${title}
*📡 صـاحـب الـحـسـاب:* @${author}
*🎥 الـمـشـاهـدات:* ${views}
*♥️ الاعـجـابـات:* ${likes}
*🗯️ الـتـعـلـيـقـات:* ${comments}

*@${instagram}*`

    await conn.sendFile(m.chat, v.play, 'tiktok.mp4', caption, m, false, { contextInfo: newsletter })

    await m.react('✅');

  } catch(e) {
    await conn.sendMessage(m.chat, { text: `❌ *خـطـا:* ${e.message || e}`, edit: s.key, contextInfo: newsletter })
    console.log(e)
    await m.react('❌')
  }
}

handler.help = ['tiktok <الـرابـط>']
handler.tags = ['downloader'] 
handler.command = ['tiktok', 'تيكتوك']
handler.limit = false
export default handler
