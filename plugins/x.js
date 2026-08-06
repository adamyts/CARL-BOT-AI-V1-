//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | تـحـمـيـل مـن تـويـتـر X

import axios from "axios";
import * as cheerio from "cheerio";

// ===== مـعـلـومـات الـقـنـاة + انـسـتـا =====
const channelName = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363410733859643@newsletter',
        newsletterName: `${instagram}`
    }
}
// =====================================

export async function twitter(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/x.com\/.*?\/status|twitter.com\/.*?\/status/gi.test(url))
                throw new Error(`*❌ الـرابـط غـيـر صـالـح! اسـتـعـمـل رابـط X صـحـيـح.*`);

            const base_url = "https://x2twitter.com";
            const base_headers = {
                accept: "*/*",
                "accept-language": "en-EN,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                Referer: "https://x2twitter.com/en",
            };

            const token = await axios
          .post(`${base_url}/api/userverify`, { url }, { headers: base_headers })
          .then((v) => v.data.token || "")
          .catch(() => { throw new Error("*❌ فـشـل الـحـصـول عـلـى الـتـوكـن.*"); });

            let r = await axios
          .post(`${base_url}/api/ajaxSearch`, new URLSearchParams({ q: url, lang: "id", cftoken: token }).toString(), { headers: base_headers })
          .then((v) => v.data)
          .catch(() => { throw new Error("*❌ فـشـل الـحـصـول عـلـى بـيـانـات X.*"); });

            if (r.status!== "ok") throw new Error(`*❌ فـشـل الـتـحـمـيـل: ${r}*`);

            const $ = cheerio.load(r.data.replace('"', '"'));
            let type = $("div").eq(0).attr("class");

            type = type.includes("tw-video")? "video"
                : type.includes("video-data") && $(".photo-list").length? "image"
                : "hybrid";

            let d = {};
            if (type === "video") {
                d = {
                    type,
                    download: $(".dl-action p").map((i, el) => {
                        let name = $(el).text().trim();
                        let fileType = name.includes("MP4")? "mp4" : null;
                        let reso = fileType === "mp4"? name.split(" ").pop().replace(/\(/, "") : null;
                        return { type: fileType, reso, url: $(el).find("a").attr("href") };
                    }).get(),
                };
            } else if (type === "image") {
                d = {
                    type,
                    download: $("ul.download-box li").map((i, el) => {
                        return { type: "image", url: $(el).find("a").attr("href") };
                    }).get(),
                };
            } else {
                d = { type, download: [] };
            }
            return resolve(d);
        } catch (e) {
            return reject(`*❌ خـطـأ:* ${e.message}`);
        }
    });
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `*⚠️ الـرجـاء ارسـال الـرابـط*\n\n*📌 مـثـال:*\n${usedPrefix + command} https://x.com/user/status/123`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('🔍')
    await conn.sendMessage(m.chat, {
        text: `*📥 مـحـمـل X*\n\n*جـاري جـلـب الـمـيـديـا... انـتـظـر قـلـيـلا*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        let result = await twitter(text);

        if (result.type === "video") {
            let video1024p = result.download.find(v => v.type === "mp4" && v.reso === "1024p");
            let selectedVideo = video1024p || result.download.find(v => v.type === "mp4");

            if (!selectedVideo) {
                await m.react('❌')
                throw new Error('*❌ لــم يــتــم الــعــثــور عــلــى فــيــديــو*')
            }

            await conn.sendMessage(m.chat, {
                video: { url: selectedVideo.url },
                caption: `*📥 مـحـمـل X*\n\n*✅ تـم الـتـحـمـيـل بـنـجـاح*`,
                contextInfo: newsletter
            }, { quoted: m });

            await m.react('✅')

        } else if (result.type === "image") {
            let selectedImage = result.download[0];

            if (!selectedImage) {
                await m.react('❌')
                throw new Error('*❌ لــم يــتــم الــعــثــور عــلــى صــورة*')
            }

            await conn.sendMessage(m.chat, {
                image: { url: selectedImage.url },
                caption: `*📥 مـحـمـل X*\n\n*✅ تـم الـتـحـمـيـل بـنـجـاح*`,
                contextInfo: newsletter
            }, { quoted: m });

            await m.react('✅')
        } else {
            await m.react('❌')
            throw new Error('*❌ لــم يــتــم الــتــحــمــيــل*')
        }
    } catch (e) {
        console.error(e)
        await m.react('❌')
        await conn.sendMessage(m.chat, {
            text: `*❌ خـطـأ:* ${e.message}`,
            contextInfo: newsletter
        }, { quoted: m })
    }
};

handler.help = ['x <الـرابـط>'];
handler.tags = ['تـحـمـيـل'];
handler.command = ['x', 'تويتر'];
handler.limit = false
handler.register = false

export default handler;
