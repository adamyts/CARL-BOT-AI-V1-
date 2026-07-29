import fs from 'fs'
import syntaxError from 'syntax-error'

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

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text)
		return conn.sendMessage(m.chat, {
			text: `*📌 الـطـريـقـة:* ${usedPrefix + command} <اسم الملف>\n\n*مـثـال:* ${usedPrefix + command} test`,
			contextInfo: newsletter
		}, { quoted: m })

	if (!m.quoted?.text) 
		return conn.sendMessage(m.chat, {
			text: `*❌ رد عـلـى الـرسـالـة لـي فـيـهـا الـكـود*`,
			contextInfo: newsletter
		}, { quoted: m })

	await m.react('⏳')

	let code = m.quoted.text
	let path = `./plugins/${text}.js`

	let err = syntaxError(code, path, {
		sourceType: 'module',
		allowAwaitOutsideFunction: true,
	})

	if (err)
		return conn.sendMessage(m.chat, {
			text: `*❌ خـطـأ فـي الـكـود*\n\n*الـرسـالـة:* ${err.message}\n*الـسـطـر:* ${err.line}\n*الـعـمـود:* ${err.column}\n\n${err.annotated}`,
			contextInfo: newsletter
	}, { quoted: m })

	fs.writeFileSync(path, code)
	
	await m.reply(`*✅ تـم حـفـظ الـبـلاجـن*\n*الـمـسـار:* ${path}`)
	await m.react('✅')
}

handler.help = ['sfp <اسم>']
handler.tags = ['owner']
handler.command = /^sfp$/i
handler.owner = true

export default handler
