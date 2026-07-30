let handler = async (m, { conn, text }) => {
	if (!text) throw '*مـن تريـد فـك الحــظر عنـه؟*';
	let who;
	if (m.isGroup) who = m.mentionedJid[0];
	else who = m.chat;
	if (!who) throw '*منـشن الـشخــص*';
	
	// تأكد ان المستخدم موجود في قاعدة البيانات
	global.db.data.users[who] = global.db.data.users[who] || {}
	global.db.data.users[who].banned = false;
	
	await conn.reply(m.chat, `*✅ تـم فـك الحــظـر عـن* @${who.split('@')[0]}`, m, { mentions: [who] })
};

handler.help = ['unban @tag'];
handler.tags = ['owner'];
handler.command = /^unban(user)?$/i;
handler.owner = true;

export default handler;
