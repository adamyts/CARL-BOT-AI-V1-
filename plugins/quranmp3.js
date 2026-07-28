//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | تـحـمـيـل قـرآن مـبـي 3

import axios from 'axios';

// ===== مـعـلـومـات الـقـنـاة + انـسـتـا =====
const instagram = 'adam.__.98'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363410733859643@newsletter', // بـدل بـمـعـرف الـقـنـاة ديـالـك
        newsletterName: `IG : ${instagram}`
    }
}
// =================================================

const Murottal = {
    async list() {
        try {
            let res = await axios.get('https://www.assabile.com/ajax/loadplayer-12-9');
            if (!res.data ||!res.data.Recitation) throw new Error('*❌ بـيـانـات غـيـر صـالـحـة*');
            return res.data.Recitation;
        } catch (error) {
            console.error('Error while fetching the murottal list:', error.message);
            return [];
        }
    },
    async search(q) {
        let list = await Murottal.list();
        if (list.length === 0) return [];

        if (typeof q === 'number') return [list[q - 1]];

        q = q.toLowerCase().replace(/\W/g, '');
        return list.filter(_ =>
            _.span_name.toLowerCase().replace(/\W/g, '').includes(q)
        );
    },
    async audio(d) {
        try {
            if (!d.href) throw new Error('*❌ الـبـيـانـات لا تـحـتـوي عـلـى href*');
            let res = await axios.get(`https://www.assabile.com/ajax/getrcita-link-${d.href.slice(1)}`, {
                headers: {
                    'authority': 'www.assabile.com',
                    'accept': '*/*',
                    'referer': 'https://www.assabile.com/abdul-rahman-al-sudais-12/abdul-rahman-al-sudais.htm',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                    'x-requested-with': 'XMLHttpRequest'
                },
                decompress: true
            });

            if (!res.data) throw new Error('*❌ فـشـل جـلـب الـصـوت*');
            return res.data;
        } catch (error) {
            console.error('Error while fetching audio:', error.message);
            return null;
        }
    }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) return conn.sendMessage(m.chat, {
        text: `*📌 الـطـريـقـة:* \n${usedPrefix}quranmp3 1\n${usedPrefix}quranmp3 الـبـقـرة`,
        contextInfo: newsletter
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
        text: `*⏳ جـاري تـحـمـيـل الـمـقـطـع الـصـوتـي...*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        let searchResults = await Murottal.search(isNaN(parseInt(text))? text : parseInt(text));
        if (searchResults.length === 0) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: '*❌ لــم يــتــم الــعــثــور عــلــى الــتــلــاوة*',
                contextInfo: newsletter
            }, { quoted: m })
        }

        let audioUrl = await Murottal.audio(searchResults[0]);

        if (!audioUrl) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: '*❌ فـشـل جـلـب الـصـوت*',
                contextInfo: newsletter
            }, { quoted: m })
        }

        let name = searchResults[0].span_name

        // 1. Send audio فقط بلا كابتشن
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${name}.mp3`,
            ptt: false,
            contextInfo: newsletter
        }, { quoted: m });

        await m.react('✅')

    } catch (error) {
        console.error(error)
        await m.react('❌')
        conn.sendMessage(m.chat, {
            text: `*❌ حـدث خـطـأ*`,
            contextInfo: newsletter
        }, { quoted: m })
    }
};

handler.help = ['quranmp3 <الـرقـم/الاسـم>'];
handler.tags = ['ديـنـي'];
handler.command = /^(quranmp3)$/i;
handler.limit = false
export default handler;
