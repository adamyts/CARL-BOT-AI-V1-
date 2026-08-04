import axios from 'axios'

// ===== معلومات القناة + الانستغرام =====
const channelName = 'IG : adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter'
const instagram = 'adam.__.98'
const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: CHANNEL_ID,
    newsletterName: channelName
  }
}
// ========================

class MeverClient {
  constructor() {
    this.base = 'https://mever.zeabur.app/api/'
    this.headers = {
      'X-Package-Name': 'com.dapascript.mever',
      'User-Agent': 'okhttp/4.11.0',
    }
    this.map = {
      tiktok: 'tiktok',
      youtube: 'youtube',
      facebook: 'fb',
      instagram: 'ig',
      pinterest: 'pin-v2',
      twitter: 'twitter',
      threads: 'threads',
      soundcloud: 'soundcloud',
      spotify: 'spotify',
      pixiv: 'pixiv',
      terabox: 'terabox',
      videy: 'videy',
      applemusic: 'applemusic',
      douyin: 'douyin',
    }
  }

  async run({ mode, url, quality = '720p', type = 'video' }) {
    if (!this.map[mode]) throw new Error(`نـوع غـيـر مـدعـوم: ${mode}`)
    if (!url) throw new Error('الـرابـط مـطـلـوب')

    const { data } = await axios.get(`${this.base}${this.map[mode]}`, {
      params: { url, quality, type },
      headers: this.headers,
      timeout: 45_000,
    })

    return data?.data || data
  }
}

function detectMode(url) {
  const u = url.toLowerCase()
  if (u.includes('tiktok.com')) return 'tiktok'
  if (u.includes('douyin.com')) return 'douyin'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube'
  if (u.includes('facebook.com') || u.includes('fb.watch')) return 'facebook'
  if (u.includes('instagram.com')) return 'instagram'
  if (u.includes('pinterest.com') || u.includes('pin.it')) return 'pinterest'
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter'
  if (u.includes('threads.net')) return 'threads'
  if (u.includes('soundcloud.com')) return 'soundcloud'
  if (u.includes('open.spotify.com')) return 'spotify'
  if (u.includes('pixiv.net')) return 'pixiv'
  if (u.includes('terabox.com')) return 'terabox'
  if (u.includes('videy.co')) return 'videy'
  if (u.includes('music.apple.com')) return 'applemusic'
  return null
}

function extractMediaUrl(data) {
  const candidates = [
    data?.url,
    data?.download_url,
    data?.downloadUrl,
    data?.video_url,
    data?.videoUrl,
    data?.audio_url,
    data?.audioUrl,
    data?.medias?.[0]?.url,
    data?.result?.[0]?.url,
    data?.data?.[0]?.url,
    data?.urls?.[0],
  ...(Array.isArray(data?.medias)? data.medias.map(x => x?.url) : []),
  ...(Array.isArray(data?.results)? data.results.map(x => x?.url) : []),
  ]
  return candidates.find(u => typeof u === 'string' && u.startsWith('http')) || null
}

function extractTitle(data) {
  return data?.title || data?.caption || data?.description || data?.name || 'الـوسـائـط'
}

const GUIDE = (p, cmd) => `
*📌 تـحـمـيـل مـن كـل الـمـنـصـات*

حـمـل الـفـيـديـوهـات والـصـوت مـن اشـهـر الـمـنـصـات بـسـرعـة

*━━━━━━━━━━━━━━━━━━━*
*📌 الـطـريـقـة:*
  ${p}${cmd} <الـرابـط>

*📌 امـثـلـة:*
  ${p}${cmd} https://www.tiktok.com/@user/video/123
  ${p}${cmd} https://youtu.be/dQw4w9WgXcQ
  ${p}${cmd} https://www.instagram.com/reel/abc123
  ${p}${cmd} https://twitter.com/user/status/123

*━━━━━━━━━━━━━━━━━━━*
*✅ الـمـنـصـات الـمـدعـومـة:*
  • تيك توك و Douyin
  • يوتيوب
  • فيسبوك
  • انستغرام
  • تويتر / X
  • Threads
  • بنترست
  • SoundCloud
  • Spotify
  • Pixiv
  • Terabox
  • Videy
  • Apple Music

*⚠️ مـلاحـظـات:*
  • الـرابـط خـصـو يـكـون عـام مـاشـي خـاص
  • جـودة يـوتـيـوب 720p بـالـتـلـقـائـي
  • الـمـلـفـات الـكـبـيـرة كـتـاخـد شـويـة وقـت
`.trim()

const handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!args[0]) return conn.sendMessage(m.chat, { text: GUIDE(usedPrefix, command), contextInfo: newsletter }, { quoted: m })

  const url = args[0].trim()

  if (!url.startsWith('http')) {
    return conn.sendMessage(m.chat, {
      text: `*❌ عـطـيـنـي رابـط صـحـيـح*\n\n*مـثـال:* ${usedPrefix}${command} https://www.tiktok.com/@user/video/123`,
      contextInfo: newsletter
    }, { quoted: m })
  }

  const mode = detectMode(url)
  if (!mode) {
    return conn.sendMessage(m.chat, {
      text: `*❌ هـاد الـمـنـصـة غـيـر مـدعـومـة*\n\nسـيـفـط *${usedPrefix}${command}* بـلا رابـط بـاش تـشـوف كـل الـمـنـصـات`,
      contextInfo: newsletter
    }, { quoted: m })
  }

  await m.react('⏳')
  await conn.sendMessage(m.chat, {
    text: `*⏳ كـانـجـيـب الـوسـائـط مـن* ${mode}... *سـنـى شـويـة*`,
    contextInfo: newsletter
  }, { quoted: m })

  const client = new MeverClient()
  let data
  try {
    data = await client.run({ mode, url })
  } catch (e) {
    return conn.sendMessage(m.chat, {
      text: `*❌ فـشـل جـلـب الـوسـائـط*\n\n*الـخـطـأ:* ${e.message}`,
      contextInfo: newsletter
    }, { quoted: m })
  }

  if (!data) return conn.sendMessage(m.chat, {
    text: `*❌ الـرابـط خـاص او غـيـر مـدعـوم*`,
    contextInfo: newsletter
  }, { quoted: m })

  const mediaUrl = extractMediaUrl(data)
  const title = extractTitle(data)

  if (!mediaUrl) {
    return conn.sendMessage(m.chat, {
      text: `*❌ مـالـقـيـتـش رابـط الـتـحـمـيـل*\n*هـاد الـمـحـتـوى مـحـمـي او خـاص`,
      contextInfo: newsletter
    }, { quoted: m })
  }

  const isAudio = ['soundcloud', 'spotify', 'applemusic'].includes(mode)
    || mediaUrl.includes('.mp3')
    || mediaUrl.includes('.m4a')

  const caption = `*📥 ${title}*\n\n*الـمـنـصـة:* ${mode}\n*المطور:* @adam.__.98`

  try {
    if (isAudio) {
      await conn.sendMessage(
        m.chat,
        { audio: { url: mediaUrl }, mimetype: 'audio/mp4', fileName: `${title}.mp3`, contextInfo: newsletter },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        { video: { url: mediaUrl }, caption, mimetype: 'video/mp4', contextInfo: newsletter },
        { quoted: m }
      )
    }
    await m.react('✅')
  } catch (sendErr) {
    try {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: mediaUrl },
          mimetype: isAudio? 'audio/mp4' : 'video/mp4',
          fileName: `${title}.${isAudio? 'mp3' : 'mp4'}`,
          caption,
          contextInfo: newsletter
        },
        { quoted: m }
      )
      await m.react('✅')
    } catch {
      await conn.sendMessage(m.chat, {
        text: `*✅ لـقـيـت الـمـلـف ولـكـن مـاقـدرتـش نـصـيـفـطـو*\n\n*الـرابـط الـمـبـاشـر:* ${mediaUrl}\n*الـعـنـوان:* ${title}`,
        contextInfo: newsletter
      }, { quoted: m })
    }
  }
}

handler.help = ['تحميل <الرابط>', 'alldownload <link>']
handler.command = /^(تحميل|alldownload|تنزيل)$/i
handler.tags = ['ادوات', 'tools']
handler.limit = false
export default handler
