// @noureddine_ouafy
// APK Downloader Plugin using NexOracle API
// تـعـديـل : نـورديـن - ستيل عادي

import axios from 'axios';

// ===== Channel Info + Instagram =====
const channelName = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const CHANNEL_ID = '120363410733859643@newsletter' // <-- معرف قناة daily
const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// =====================================

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const appName = args.join(" ")
  if (!appName) {
    return conn.sendMessage(m.chat, {
        text: `*📌 الـطـريـقـة:* ${usedPrefix + command} <اسم التطبيق>\n\n*مـثـال:* ${usedPrefix + command} whatsapp`,
        contextInfo: newsletter
    }, { quoted: m })
  }

  await m.react('⏳')
  await conn.sendMessage(m.chat, {
    text: `*⏳ جـاري الـبـحـث عـن ${appName}...*`,
    contextInfo: newsletter
  }, { quoted: m })

  try {
    const apiUrl = `https://api.nexoracle.com/downloader/apk`
    const params = {
      apikey: 'free_key@maher_apis',
      q: appName
    }

    const response = await axios.get(apiUrl, { params })

    if (!response.data || response.data.status !== 200 || !response.data.result) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: `*❌ لـم يـتـم الـعـثـور عـلـى الـتـطـبـيـق*`,
        contextInfo: newsletter
      }, { quoted: m })
    }

    const { name, lastup, package: pkg, size, icon, dllink } = response.data.result

    // إرسال صورة التطبيق
    await conn.sendMessage(m.chat, {
      image: { url: icon },
      caption: `*📦 جـاري تـحـمـيـل ${name}...*`,
      contextInfo: newsletter
    }, { quoted: m })

    const apkRes = await axios.get(dllink, { responseType: 'arraybuffer' })
    const apkBuffer = Buffer.from(apkRes.data, 'binary')

    const caption = `*📌 مـعـلـومـات الـتـطـبـيـق*\n\n` +
                    `*🔖 الاسـم:* ${name}\n` +
                    `*📅 اخـر تـحـديـث:* ${lastup}\n` +
                    `*📦 الـحـزمـة:* ${pkg}\n` +
                    `*📏 الـحـجـم:* ${size}\n\n` +
                    `*✅ تـم الـتـحـمـيـل بـنـجـاح*`

    await conn.sendMessage(m.chat, {
      document: apkBuffer,
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${name}.apk`,
      caption: caption,
      contextInfo: newsletter
    }, { quoted: m })

    await m.react('✅')

  } catch (error) {
    console.error('خطأ أثناء تحميل التطبيق:', error)
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: `*❌ حـدث خـطـأ اثـنـاء تـحـمـيـل الـتـطـبـيـق*`,
      contextInfo: newsletter
    }, { quoted: m })
  }
}

handler.help = ['apk <اسم>']
handler.tags = ['downloader']
handler.command = ['apk', 'apkdownload']
handler.limit = true
export default handler
