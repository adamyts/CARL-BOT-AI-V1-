// NewsMA plugin - No dependencies
// تـعـديـل : نـورديـن - ستيل عادي

let handler = async (m, { conn, args, usedPrefix }) => {
    // ===== Channel Info + Instagram =====
    const channelName = ''
    const instagram = 'adam.__.98'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363410733859643@newsletter',
            newsletterName: `IG : ${instagram}`
        }
    }
    // ======================================

    let country = args[0] || 'MA'

    await m.react('⏳')
    await conn.sendMessage(m.chat, {
        text: `*⏳ جـاري جـلـب اخـر 5 اخـبـار...*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        let news = await getMoroccoNews(country)

        if (!news.length) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: `*❌ لا يـوجـد اخـبـار*`,
                contextInfo: newsletter
            }, { quoted: m })
        }

        // Send first 5 news with details
        for(let i = 0; i < Math.min(5, news.length); i++) {
            let item = await getNewsDetail(news[i].link)
            if(!item) continue

            let cap = `*📌 خـبـر ${i + 1} - الـمـغـرب*\n\n`
            cap += `*📰 الـعـنـوان:* ${item.title}\n\n`
            cap += `*👤 الـكـاتـب:* ${item.author}\n`
            cap += `*📅 الـتـاريـخ:* ${item.date}\n`
            cap += `*🏷️ الـتـصـنـيـف:* ${item.category}\n\n`
            cap += `*${item.content}*\n\n`
            cap += `*الـرابـط:* ${item.link}`

            if(item.image) {
                await conn.sendMessage(m.chat, {
                    image: { url: item.image },
                    caption: cap,
                    contextInfo: newsletter
                })
            } else {
                await conn.sendMessage(m.chat, {
                    text: cap,
                    contextInfo: newsletter
                })
            }

            await new Promise(r => setTimeout(r, 1500))
        }

        await conn.sendMessage(m.chat, {
            text: `*✅ تـم ارسـال ${Math.min(5, news.length)} اخـبـار*`,
            contextInfo: newsletter
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        await conn.sendMessage(m.chat, {
            text: `*❌ حـدث خـطـأ اثـنـاء جـلـب الاخـبـار*`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ["newsma"]
handler.tags = ["morocco"]
handler.command = /^(newsma|اخبار_المغرب)$/i
handler.limit = false
handler.register = false
export default handler

// Using RSS from Moroccan sites with headers
async function getMoroccoNews(country) {
    try {
        const urls = [
            'https://www.hespress.com/rss',
            'https://www.le360.ma/rss'
        ]

        const HEADERS = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        let allNews = []

        for(let url of urls) {
            try {
                const res = await fetch(url, { headers: HEADERS })
                const xml = await res.text()

                const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []

                items.slice(0, 3).forEach(item => {
                    const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*)\]\]>/, '$1') || ''
                    const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || ''
                    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || ''

                    if(title && link && link.startsWith('http')) {
                        allNews.push({
                            title: title.replace(/<[^>]*>/g, '').trim(),
                            link,
                            date: new Date(pubDate).toLocaleDateString('en-GB')
                        })
                    }
                })
            } catch(err) {
                console.log('RSS fetch error:', url, err.message)
            }
        }

        return allNews.sort(() => 0.5 - Math.random()).slice(0, 5)
    } catch (e) {
        console.error(e)
        return []
    }
}

async function getNewsDetail(url) {
    try {
        const HEADERS = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        const res = await fetch(url, { headers: HEADERS })
        const html = await res.text()

        const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.replace(' - Hespress', '').replace(' - LE360', '') || 'No Title'
        const image = html.match(/property="og:image" content="(.*?)"/)?.[1] || ''
        const author = html.match(/class="author".*?>(.*?)</)?.[1] || 'Unknown'
        const date = html.match(/property="article:published_time" content="(.*?)"/)?.[1] || ''
        const category = html.match(/property="article:section" content="(.*?)"/)?.[1] || 'General'

        let content = html.match(/class="article-content"[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] || ''
        content = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').substring(0, 800) + '...'

        return { title, image, author, date, category, content, link: url }
    } catch (e) {
        console.error('Detail error:', e.message)
        return null
    }
}
