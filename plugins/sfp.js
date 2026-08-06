import fs from 'fs';
import syntaxError from 'syntax-error';

// ===== معلومات القناة =====
const channelName = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const CHANNEL_ID = '120363410733859643@newsletter'

const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: CHANNEL_ID,
    newsletterName: channelName
  }
}
// ========================

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text)
		return conn.sendMessage(m.chat, { text: `*❌ ارسـل مـعـي اسـم مـيـزة وكــود*\n\n*الطـريـقة :*\n${usedPrefix + command} <الاسم>\n\n*مثـال :*\n${usedPrefix + command} ملف_تجريبي`, contextInfo: newsletter }, { quoted: m })

	if (!m.quoted?.text) 
		return conn.sendMessage(m.chat, { text: `*❌ رد عـلـى الرسـالـة النـي يـوجـد كــود!*`, contextInfo: newsletter }, { quoted: m })

	let code = m.quoted.text;
	let path = `./plugins/${text}.js`;

	let err = syntaxError(code, path, {
		sourceType: 'module',
	allowAwaitOutsideFunction: true,
	});

	if (err)
		return conn.sendMessage(m.chat, { text: `❌ *خطـأ فـي الـكـود*\n\n*الـرسـالة:* ${err.message}\n*السـطـر:* ${err.line}\n*العـمـود:* ${err.column}\n*الـتفاصـيل:* ${err.annotated}`, contextInfo: newsletter }, { quoted: m })

	fs.writeFileSync(path, code);
	
	conn.sendMessage(m.chat, { text: `✅ *تـم الـحفـظ بنـجـاح*\n📁 المـــســار: ${path}`, contextInfo: newsletter }, { quoted: m })
};

handler.help = ['حفظ_بلاجن <الاسم>', 'sfp <الاسم>'];
handler.tags = ['owner'];
handler.command = /^(حفظ_بلاجن|sfp)$/i;
handler.owner = true;

export default handler;
