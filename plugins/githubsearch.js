import axios from 'axios'

// ===== Channel Info + Instagram =====
const channelName = 'GI : adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter'
const instaLink = 'https://instagram.com/adam.__.98'
const channelLink = 'https://whatsapp.com/channel/0029VbCxraN7T8bbAyc2j31J'

const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: CHANNEL_ID,
    newsletterName: channelName
  }
}
// ========================

let handler = async (m, { conn, text, command, usedPrefix: _p }) => {

    // 1. امر githubinfo باش يجيب التفاصيل
    if(command === 'githubinfo'){
        if(!text) return m.reply('ارسل رابط المستودع')
        let [owner, repo] = text.replace('https://github.com/', '').split('/')
        if(!owner ||!repo) return m.reply('الرابط خطأ')

        await conn.sendMessage(m.chat, { text: '⏳*جـاري جـلـب مـعـلـومـات الـمـسـتـودع...*', contextInfo: newsletter }, { quoted: m })

        try{
            let { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}`)

            let caption = `📦 *${data.full_name}*\n\n`
            caption += `📝 *الـوصـف:* ${data.description || 'لا يوجد'}\n`
            caption += `👤 *الـمـلـك:* ${data.owner.login}\n`
            caption += `📅 *تـاريـخ الانـشـاء:* ${formatDate(data.created_at)}\n`
            caption += `🔄 *اخـر تـحـديـث:* ${formatDate(data.updated_at)}\n`
            caption += `⭐ *الـنـجـوم:* ${data.stargazers_count.toLocaleString()}\n`
            caption += `🍴 *الـفـورك:* ${data.forks.toLocaleString()}\n`
            caption += `🐛 *المشاكل:* ${data.open_issues}\n`
            caption += `🔗 *الـرابـط:* ${data.html_url}`

            return await conn.sendButton(m.chat, {
                image: { url: data.owner.avatar_url }, // صورة الحساب
                caption: caption,
                buttons: [
                    {name: 'cta_url', buttonParamsJson: JSON.stringify({display_text: '📦 فـتـح الـمـسـتـودع', url: data.html_url})},
                    {name: 'cta_url', buttonParamsJson: JSON.stringify({display_text: '📢 قــنــاة الـواتــســاب', url: channelLink})},
                ],
                contextInfo: newsletter
            }, { quoted: m })
        }catch(e){
            return m.reply(`❌ خطأ: المستودع غير موجود`)
        }
    }

    // 2. امر البحث
    if (!text) {
        return await conn.sendMessage(m.chat, {
            text: `*📌 الـطـريـقـة:*\n${_p + 'githubsearch'} <اسـم الـمـسـتـودع>\n\n*📝 امـثـلـة:*\n• ${_p}githubsearch adam.__.98\n• ${_p}githubsearch whatsapp-bot`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, {
        text: `*🔍 كـانـقـلـب فـي جـيـت هـاب عـلـى:* \`${text}\`\n`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&per_page=5`

        let res = await fetch(url, {
            headers: {
                'User-Agent': 'WhatsApp-Bot',
                'Accept': 'application/vnd.github.v3+json'
            }
        })

        let json = await res.json()
        if (res.status!== 200) return await conn.sendMessage(m.chat, { text: `*❌ خـطـأ:* ${json.message || 'فـشـل الـبـحـث'}`, contextInfo: newsletter }, { quoted: m })

        if (!json.items.length) return await conn.sendMessage(m.chat, { text: `*😕 مـالـقـيـت والـو عـلـى* \`${text}\``, contextInfo: newsletter }, { quoted: m })

        let thumbnail = json.items[0].owner.avatar_url // المشكل 1: خذينا صورة اول حساب

        let caption = `🔍 *نـتـائـج الـبـحـث عـلـى:* ${text}\n📊 *عـدد الـنـتـائـج:* ${json.items.length}\n\n*BY adam.__.98*`

        let sections = [
          {
            title: "📦 اخـتـر مـسـتـودع لـعـرض الـتـفـاصـيـل",
            rows: json.items.map((repo, i) => ({
              title: `${i+1}. ${repo.full_name.substring(0, 60)}`,
              description: `⭐ ${repo.stargazers_count} | 🍴 ${repo.forks}`,
              id: `${_p}githubinfo ${repo.full_name}` // المشكل 2: صلحنا هنا درنا owner/repo ماشي الرابط كامل
            }))
          }
        ]

        await conn.sendButton(m.chat, {
            image: { url: thumbnail },
            caption: caption,
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '⬇️ اضـــغـــط هــنــا',
                        sections: sections
                    }),
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 قــنــاة الـواتــســاب',
                        url: channelLink
                    }),
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📸 حـسابــي انـسـتـغـرام',
                        url: instaLink
                    }),
                },
            ],
            contextInfo: newsletter
        }, { quoted: m, mentions: [m.sender] })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        return await conn.sendMessage(m.chat, { text: `*❌ فـشـل الـبـحـث:* ${e.message || e}`, contextInfo: newsletter }, { quoted: m })
    }
}

handler.help = ['githubsearch <query>', 'جيتهاب <owner/repo>']
handler.tags = ['search']
handler.command = /^githubsearch$|^جيتهاب$/i
handler.limit = false
export default handler

function formatDate(n, locale = 'ar-MA') {
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
}
