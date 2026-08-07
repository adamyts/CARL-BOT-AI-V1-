import axios from 'axios';

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
const IMG_GITHUB = 'https://files.catbox.moe/00p88l.png'

const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363410733859643@newsletter',
    newsletterName: '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
  }
}

// البحث في GitHub
const searchGitHub = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.sendMessage(m.chat, {
    image: { url: IMG_GITHUB },
    caption: `🚨 يـرجـى إدخـال اسـم المـشـروع\n🔍 مـثــال:\n ${usedPrefix + command} WhatsApp-Bot`,
    contextInfo: newsletter
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

  try {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&per_page=10`;
    const { data } = await axios.get(url);

    if (!data.items.length) throw new Error("❌ لـم يتـم العثور على أي مـستـودع مـطابـق!");

    let rows = data.items.slice(0, 10).map((repo) => ({
      title: `📂 ${repo.name}`,
      description: `⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}`,
      id: `${usedPrefix}info ${repo.html_url}` // بدلنا تحميل ب info
    }));

    let sections = [{ title: "📜 نــتائــج الـبــحث", rows: rows }]

    await conn.sendButton(m.chat, {
        image: { url: IMG_GITHUB },
        caption: `🔎 تــم الـعـثـور عـلـى ${data.items.length} مـســتودع\n> اخــتر المــســـتودع لـعــرض الـمعلـومـات`,
        footer: { text: `🚀 GitHub Search` },
        buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ title: '⬇️ اضــغــط هـنا للاخـتـيار', sections: sections }),
        }],
        headerType: 4,
        contextInfo: newsletter
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.sendMessage(m.chat, {
      image: { url: IMG_GITHUB },
      caption: `❌ حدث خطأ: ${error.message}`,
      contextInfo: newsletter
    }, { quoted: m });
  }
};

// عرض معلومات المستودع + الصورة + الرابط
const getRepoInfo = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `🚨 مثال: ${usedPrefix}info https://github.com/user/repo`, m);

  if (!regex.test(args[0])) return conn.reply(m.chat, "⚠️ الرابط غير صحيح!", m);

  let [_, user, repo] = args[0].match(regex) || [];
  repo = repo.replace(/.git$/, '');
  let repoUrl = `https://github.com/${user}/${repo}`
  let imgUrl = `https://opengraph.githubassets.com/1/${user}/${repo}` // صورة الكارد ديال جيتهاب

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    // نجيبو معلومات اضافية
    const { data } = await axios.get(`https://api.github.com/repos/${user}/${repo}`);

    let caption = `⭐ اســم ${data.name}\n\n`
    caption += `📝 الـوصـف: ${data.description || 'لا يــوجد وصـف'}\n`
    caption += `👤 المـطـور: ${data.owner.login}\n`
    caption += `⭐ النـجـوم: ${data.stargazers_count}\n`
    caption += `🍴 الـفـروع: ${data.forks_count}\n`
    caption += `👀 المـشـاهدات: ${data.watchers_count}\n`
    caption += `💻 اـللغـة: ${data.language || 'غير محدد'}\n`
    caption += `📅 اخـر تـحديـث: ${new Date(data.updated_at).toLocaleDateString('ar')}\n\n`
    caption += `🔗 الـرابـط: ${repoUrl}`

    await conn.sendMessage(m.chat, {
      image: { url: imgUrl }, // صورة المشروع من جيتهاب
      caption: caption,
      footer: { text: `🚀 GitHub Info` },
      contextInfo: newsletter
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.reply(m.chat, `❌ فـشل جـلب المـعلومـات: ${error.message}`, m);
  }
};

// الامر الرئيسي
const handler = async (m, context) => {
  const { usedPrefix, command } = context;
  if (command === 'جيتهاب') return searchGitHub(m, context);
  if (command === 'info') return getRepoInfo(m, context); // بدلنا تحميل
};

// باش يلتقط الضغط على الزر
handler.before = async (m, { conn, usedPrefix }) => {
    if (m.isBaileys || m.fromMe) return
    let selectedId = m.selectedId
    if (!selectedId) return

    if (selectedId.startsWith(`${usedPrefix}info`)) {
        let args = selectedId.split(' ').slice(1)
        await getRepoInfo(m, { conn, args, usedPrefix, command: 'info' })
        return true
    }
}

handler.help = ['جيتهاب <اسم>', 'info <رابط>'];
handler.tags = ['downloader'];
handler.command = /^(جيتهاب|info)$/i;

export default handler;
