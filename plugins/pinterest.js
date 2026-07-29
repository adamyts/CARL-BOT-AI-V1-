import fs from 'fs'

// ===== Channel Info + Instagram =====
const channelName = 'GI : adam.__.98'
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

async function getSession() {
    const res = await fetch("https://id.pinterest.com/", {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0",
            "accept-language": "en-US,en;q=0.9"
        }
    })
    const raw = res.headers.getSetCookie?.() || []
    const cookies = raw.map(c => c.split(";")[0]).join("; ")
    const csrf = raw.find(c => c.startsWith("csrftoken="))?.match(/csrftoken=([^;]+)/)?.[1] || ""
    return { cookies, csrf }
}

async function pinterestSearch(query, options = {}) {
    const { limit = 5, scope = "pins", bookmark = null } = options
    const session = await getSession()

    const data = {
        options: {
            query,
            scope,
            page_size: limit,
            refine_search_with_filters: true,
           ...(bookmark? { bookmarks: [bookmark] } : {})
        },
        context: {}
    }

    const sourceUrl = `/search/${scope}/?q=${encodeURIComponent(query)}`
    const url = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(data))}&_=${Date.now()}`

    const res = await fetch(url, {
        headers: {
            "accept": "application/json, text/javascript, */*, q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0",
            "referer": `https://id.pinterest.com${sourceUrl}`,
            "x-requested-with": "XMLHttpRequest",
            "x-app-version": "6d51d5a",
            "x-pinterest-appstate": "active",
            "x-pinterest-pws-handler": "www/search/[scope].js",
            "x-pinterest-source-url": sourceUrl,
           ...(session.csrf? { "x-csrftoken": session.csrf } : {}),
           ...(session.cookies? { "cookie": session.cookies } : {})
        }
    })

    if (!res.ok) return { results: [], bookmark: null, error: `HTTP ${res.status}` }

    const json = await res.json().catch(() => null)
    const payload = json?.resource_response?.data
    if (!payload) return { results: [], bookmark: null, error: "no data" }

    const arr = Array.isArray(payload)? payload : payload.results || []

    const mapPin = (pin) => ({
        title: pin.title || pin.grid_title || "",
        image: pin.images?.orig?.url || pin.images?.["736x"]?.url || null,
        video: pin.videos?.video_list?.V_HLSV4?.url
            || pin.videos?.video_list?.V_EXP7?.url
            || pin.videos?.video_list?.V_720P?.url
            || null,
        username: pin.pinner?.username || null,
        fullName: pin.pinner?.full_name || null,
        pinUrl: `https://id.pinterest.com/pin/${pin.id}/`
    })

    return {
        query,
        count: arr.length,
        bookmark: payload.bookmark || null,
        results: arr.filter(x => x?.id).map(mapPin)
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `*📌 الـطـريـقـة:* ${usedPrefix + command} <كـلـمـة الـبـحـث>\n\n*مـثـال:* \n• ${usedPrefix + command} logo design\n• ${usedPrefix + command} aesthetic room\n• ${usedPrefix + command} anime wallpaper\n\n*الـنـتـائـج:* يـرسـل 5 صـور مـن بـنـتـرست مـع الـرابـط`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    const query = text.trim()
    await m.react('⏳')
    await conn.sendMessage(m.chat, {
        text: `*🔍  أبـحث في بـنـتـرست  عـن :* "${query}"...`,
        contextInfo: newsletter
    }, { quoted: m })

    let data
    try {
        data = await pinterestSearch(query, { limit: 5 })
    } catch (err) {
        return conn.sendMessage(m.chat, {
            text: `*❌ فـشـل الاتـصـال بـبـنـتـرست*\n\n*الـخـطـأ:* ${err.message}`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    if (data.error ||!data.results?.length) {
        return conn.sendMessage(m.chat, {
            text: `*😕  لـم أجـــد أي شـيء عــن* "${query}"\n*جـرب كـلـمـة خـرى*`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
        text: `*📌 لـقـيـت ${data.count} نـتـيـجـة عـلـى* "${query}"`,
        contextInfo: newsletter
    }, { quoted: m })

    for (let i = 0; i < data.results.length; i++) {
        const pin = data.results[i]
        const caption = `*📌 صـورة ${i + 1}/${data.results.length}*\n` +
            (pin.title? `*الـعـنـوان:* ${pin.title}\n` : "") +
            (pin.fullName? `*صـاحـب الـحـسـاب:* ${pin.fullName}` + (pin.username? ` (@${pin.username})` : "") + "\n" : "") +
            `*الـرابـط:* ${pin.pinUrl}` +
            (pin.video? `\n*فـيـديـو:* ${pin.video}` : "")

        if (pin.image) {
            try {
                await conn.sendMessage(m.chat, {
                    image: { url: pin.image },
                    caption,
                    contextInfo: newsletter
                }, { quoted: m })
            } catch {
                await conn.sendMessage(m.chat, { text: caption, contextInfo: newsletter }, { quoted: m })
            }
        } else {
            await conn.sendMessage(m.chat, { text: caption, contextInfo: newsletter }, { quoted: m })
        }
    }
    await m.react('✅')
}

handler.help = ['pinterest <text>']
handler.tags = ['tools']
handler.command = /^pinterest$/i
handler.limit = true
export default handler
