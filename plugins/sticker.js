// تـرجـمـة وتـعـديـل: نـورديـن
// بـلـوغـيـن: Izuku-mi | صـنـع سـتـيـكـر مـن صـورة/فـيـديـو

// ─── مـعـلـومـات الـقـنـاة ─────────────────────────────────────────────
const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

let handler = async (m, { conn, text }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';

	if (/image|video|webp/.test(mime)) {
		if ((q.msg?.seconds || q.seconds) > 10) {
			return conn.sendMessage(m.chat, { 
				text: '*❌ الـفـيـديـو خـاصـو يـكـون قـل مـن 10 ثـوانـي*',
				contextInfo: newsletter 
			}, { quoted: m });
	}

		let media = await q.download();
		
		let packname = channelName
		let author = 'CARL-BOT'
		if (text) {
			const [p, a] = text.split(/[,|\-+&]/);
			if(p) packname = p.trim()
			if(a) author = a.trim()
		}

		await conn.sendMessage(m.chat, {
			sticker: media,
			packname: packname,
			author: author,
			contextInfo: newsletter
	}, { quoted: m });

	} else {
		conn.sendMessage(m.chat, { 
			text: `*📎 الـرجـاء ارسـال او الـرد عـلـى صـورة/فـيـديـو/سـتـيـكـر لـتـحـويـلـه لـسـتـيـكـر*`,
			contextInfo: newsletter 
	}, { quoted: m });
	}
};

handler.help = ['ستيكر <اسـم الـبـاكـة|الـمـؤلـف>', 'sticker <pack|author>'];
handler.tags = ['تحويل', 'convert'];
handler.command = /^(ستيكر|sticker|s|ملصق)$/i;
handler.register = false;

export default handler;
