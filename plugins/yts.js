//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | بـحـث يـوتـيـوب بـشـكـل فـيـش + قـنـاة

import axios from 'axios'

const handler = async (m, { text, conn, usedPrefix, command }) => {
    try {
        // ===== مـعـلـومـات الـقـنـاة =====
        const channelName = 'GI : adam.__.98'
        const newsletter = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363410733859643@newsletter',
                newsletterName: channelName
            }
        }
        // ========================

        if (!text) return m.reply(`🔍*الـرجـاء إدخـال اسـم الـفـيـديـو لـلـبـحـث عـنـه*

*📌 مـثـال :* \`${usedPrefix}${command} alan walker faded\``, m.chat, { contextInfo: newsletter })

        await m.react('🔍')
        await conn.sendMessage(m.chat, { text: '🔍 *جـاري الـبـحـث...*', contextInfo: newsletter }, { quoted: m })

        let { data } = await axios.post('https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8', {
          context: { client: { clientName: "WEB", clientVersion: "2.20240101.01.00" } },
          query: text
        }, { timeout: 15000 })

        let videos = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
.filter(x => x.videoRenderer)
.slice(0, 5)
.map(x => x.videoRenderer)

        if (!videos.length) {
            return m.reply("❌ *مـالـقـيـتـش نـتـائـج. جـرب كـلـمـة خـرى*", m.chat, { contextInfo: newsletter })
        }

        await m.react('✅')

        let thumbnail = videos[0].thumbnail.thumbnails.pop().url

        let caption = `🔍 *نـتـائـج الـبـحـث :* ${text}\n\n`

        caption += videos.map((v, i) => {
          let title = v.title.runs[0].text
          let id = v.videoId
          let duration = v.lengthText?.simpleText || 'مـبـاشـر'
          let views = v.viewCountText?.simpleText || '0 مـشـاهـدة'
          let channel = v.ownerText.runs[0].text
          return `*❑ الـفيـديـــــــو  ${i+1}*\n
*🌐 الـعنـوان* *${title}*\n
*📺 الـقـنـاة :* ${channel}\n
*⏰ الـمـدة :* ${duration} | *👀 ${views}*

*🔗 الـرابـط* https://youtu.be/${id}`
        }).join('\n\n')

        caption += ``

        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption,
            contextInfo: newsletter
        }, { quoted: m })

    } catch (e) {
        console.error("YTS ERROR:", e)
        m.reply(`❌ *خـطـأ:* ${e.message}\nجـرب مـرة خـرى`)
    }
}

handler.command = ["yts", "ytsearch", "بـحـث"]
handler.help = ["yts <الـبـحـث>"]
handler.tags = ["بـحـث"]
handler.limit = false
export default handler
