// تـعـديـل : نـورديـن - ستيل عادي

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
	if (!text) {
		return conn.sendMessage(m.chat, {
			text: `*📌 الـطـريـقـة:* ${usedPrefix + command} <النص>\n\n*مـثـال:* ${usedPrefix + command} https://instagram.com/adam.__.98`,
			contextInfo: newsletter
	}, { quoted: m })
	}

	await m.react('⏳')

	await conn.sendFile(
		m.chat,
		`https://quickchart.io/qr?text=${encodeURIComponent(text)}`,
		'qrcode.png',
	`*✅ تـم انـشـاء كـود QR*\n\n*الـنـص:* ${text}`,
		m,
		null,
	{ contextInfo: newsletter }
	)
	await m.react('✅')
}

handler.help = ['qr <text>']
handler.tags = ['tools']
handler.command = /^qr(code)?$/i
export default handler
