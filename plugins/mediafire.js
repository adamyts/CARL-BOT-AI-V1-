import * as cheerio from 'cheerio';
import fetch from 'node-fetch'; // الى مكانش عندك ضيفها

const mediaRegex = /https?:\/\/(www\.)?mediafire\.com\/(file|folder)\/(\w+)/;

// ===== Channel Info + Instagram =====
const instagram = 'adam.__.98'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363410733859643@newsletter',
        newsletterName: `IG : ${instagram}`
    }
}
// =====================================

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) return conn.sendMessage(m.chat, {
        text: `📥 *تـحـمـيل مـن مـيـديـا فـايـر*\n\n*📌 الـطـريـقـة:* ${usedPrefix}${command} <رابط>\n\n*مـثـال:*\n${usedPrefix}${command} https://www.mediafire.com/file/xxx/file`,
        contextInfo: newsletter
    }, { quoted: m })

    if (!mediaRegex.test(text)) return conn.sendMessage(m.chat, {
        text: `❌ *رابـط غـيـر صـحـيـح*\n\n*الـرجـاء ادخـال رابـط mediafire صـحـيـح*\n*مـثـال:* https://www.mediafire.com/file/xxx/xxx`,
        contextInfo: newsletter
    }, { quoted: m })

    await m.react('⏳')
    await m.reply(`⏳ *جـاري جـلـب مـعـلـومـات الـمـلـف...*`)

    try {
        let res = await mediafire(text);

        let caption = `📥 *تــم جـلـب الـمـلـف بـنـجـاح* ✅\n\n`
        caption += `*📂 الاسـم:* ${res.filename}\n`
        caption += `*📊 الـحـجـم:* ${res.sizeReadable}\n`
        caption += `*🗂️ الـنـوع:* ${res.filetype}\n`
        caption += `*📄 الامـتـداد:*.${res.ext}\n`
        caption += `*🔐 الـخـصـوصـيـة:* ${res.privacy === 'public'? 'عـام' : 'خـاص'}\n`
        caption += `*👤 الـمـالـك:* ${res.owner_name}\n\n`
        caption += `*◜⏤͟͞ 𝘾𝘼𝙍𝙇-𝘽𝙊𝙏*`

        await conn.sendMessage(
            m.chat,
            {
                document: { url: res.download },
                fileName: res.filename,
                mimetype: res.mimetype,
                caption: caption,
                contextInfo: newsletter
            },
            { quoted: m }
        );

        await m.react('✅')

    } catch (e) {
        console.error(e);
        await m.react('❌')
        conn.sendMessage(m.chat, {
            text: `❌ *فـشـل الـتـحـمـيـل*\n\n*الاسـبـاب الـمـحـتـمـلـة:*\n1. الـرابـط مـحـذوف\n2. الـمـلـف خـاص\n3. حـاول مـرة اخـرى`,
            contextInfo: newsletter
        }, { quoted: m })
    }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = /^(mediafire|مديافاير|mf)$/i;
handler.limit = false;
handler.register = false;

export default handler;

async function mediafire(url) {
    const match = mediaRegex.exec(url);
    if (!match) throw 'رابط غير صالح!';

    const id = match[3];
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const download = $('a#downloadButton').attr('href');
    if (!download) throw 'فشل في الحصول على رابط التحميل من صفحة MediaFire.';

    const infoResponse = await fetch(`https://www.mediafire.com/api/1.5/file/get_info.php?response_format=json&quick_key=${id}`);
    const json = await infoResponse.json();
    if (json.response.result!== 'Success') throw 'فشل في جلب معلومات الملف.';

    const info = json.response.file_info;
    const size = parseInt(info.size);
    const ext = info.filename.split('.').pop();

    return {
        filename: info.filename,
        ext: ext,
        size: size,
        sizeReadable: formatBytes(size),
        download: download,
        filetype: info.filetype,
        mimetype: info.mimetype || `application/${ext}`,
        privacy: info.privacy,
        owner_name: info.owner_name,
    };
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
		}
