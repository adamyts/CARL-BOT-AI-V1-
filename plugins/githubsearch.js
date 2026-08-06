import axios from 'axios'

// ===== معلومات القناة =====
const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
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

    // 1. امر githubinfo / جيتهاب_معلومات
    if(command === 'githubinfo' || command === 'جيتهاب_معلومات'){
        if(!text) return m.reply(`📌 *الـطـريـقـة:*\n${_p}githubinfo owner/repo\n${_p}جيتهاب_معلومات owner/repo`)
        let [owner, repo] = text.replace('https://github.com/', '').split('/')
        if(!owner ||!repo) return m.reply('❌ *الـرابـط خـطـأ*\n📌 *مـثـال صـحـيـح:* owner/repo')

        await conn.sendMessage(m.chat, { text: '⏳ *جـاري جـلـب مـعـلـومـات الـمـسـتـودع...*', contextInfo: newsletter }, { quoted: m })

        try{
            let { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}`)

            let caption = `╮──〔 📦 مـعـلـومـات الـمـسـتـودع 〕──╭
│📦 *الاسـم:* ${data.full_name}
│📝 *الـوصـف:* ${data.description || 'لا يـوجـد'}
│👤 *الـمـالـك:* ${data.owner.login}
│📅 *تـاريـخ الانـشـاء:* ${formatDate(data.created_at)}
│🔄 *اخـر تـحـديـث:* ${formatDate(data.updated_at)}
│⭐ *الـنـجـوم:* ${data.stargazers_count.toLocaleString()}
│🍴 *الـفـورك:* ${data.forks.toLocaleString()}
│🐛 *الـمـشـاكـل:* ${data.open_issues}
│🔗 *الـرابـط:* ${data.html_url}
╯────────────────╰
> ${channelName}`

            return await conn.sendButton(m.chat, {
                image: { url: data.owner.avatar_url },
                caption: caption,
                buttons: [
                    {name: 'cta_url', buttonParamsJson: JSON.stringify({display_text: '📦 فـتـح الـمـسـتـودع', url: data.html_url})},
                    {name: 'cta_url', buttonParamsJson: JSON.stringify({display_text: '📢 قــنــاة الـواتــســاب', url: channelLink})},
                ],
                contextInfo: newsletter
            }, { quoted: m })
        }catch(e){
            return m.reply(`❌ *خـطـأ:* الـمـسـتـودع غـيـر مـوجـود`)
        }
    }

    // 2. امر البحث githubsearch / جيتهاب
    if (!text) {
        return await conn.sendMessage(m.chat, {
            text: `╮──〔 🔍 جـيـتـهـاب سـيـرش 〕──╭
│📌 *الـطـريـقـة:*
│${_p}githubsearch <اسـم الـمـسـتـودع>
│${_p}جيتهاب <اسـم الـمـسـتـودع>
│
│📝 *امـثـلـة:*
│• ${_p}githubsearch adam.__.98
│• ${_p}جيتهاب whatsapp-bot
╯────────────────╰`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, {
        text: `*🔍 كـانـقـلـب فـي جـيـتـهـاب عـلـى:* \`${text}\``,
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

        let thumbnail = json.items[0].owner.avatar_url

        let caption = `╮──〔 🔍 نـتـائـج الـبـحـث 〕──╭
│🔍 *الـبـحـث:* ${text}
│📊 *عـدد الـنـتـائـج:* ${json.items.length}
╯────────────────╰
> ${channelName}`

        let sections = [
          {
            title: "📦 اخـتـر مـسـتـودع لـعـرض الـتـفـاصـيـل",
            rows: json.items.map((repo, i) => ({
              title: `${i+1}. ${repo.full_name.substring(0, 60)}`,
              description: `⭐ ${repo.stargazers_count} | 🍴 ${repo.forks}`,
              id: `${_p}githubinfo ${repo.full_name}`
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
                        title: '⬇️ اضـــغـــط هــنــا لـلاخـتـيـار',
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

handler.help = ['githubsearch <query>', 'githubinfo <owner/repo>', 'جيتهاب <query>', 'جيتهاب_معلومات <owner/repo>']
handler.tags = ['search']
handler.command = /^githubsearch$|^githubinfo$|^جيتهاب$|^جيتهاب_معلومات$/i
handler.limit = false
handler.name = 'جيتهاب 
export default handler

function formatDate(n, locale = 'ar-MA') {
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
}
