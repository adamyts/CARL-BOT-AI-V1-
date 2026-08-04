// ===== معلومات القناة =====
const channelName = 'IG : adam.__.98'
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

let handler = async (m, { conn, command }) => {
	if (command === 'رابط_القروب' || command === 'linkgc') {
		let code = await conn.groupInviteCode(m.chat)
		m.reply(`*🔗 رابـط القـروب:*\n\nhttps://chat.whatsapp.com/${code}`, null, { contextInfo: newsletter })
	}
	if (command === 'تجديد_الرابط' || command === 'revoke') {
		let code = await conn.groupRevokeInvite(m.chat)
		m.reply(`*✅ تـم تجـديـد رابــط الـقـروب بنجاح*\n\n*🔗 الرابط الجـديـد:*\nhttps://chat.whatsapp.com/${code}`, null, { contextInfo: newsletter })
	}
};

handler.help = ['رابط_القروب', 'تجديد_الرابط', 'linkgc', 'revoke'];
handler.tags = ['مجموعة', 'group'];
handler.command = /^(رابط_القروب|تجديد_الرابط|linkgc|revoke)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
