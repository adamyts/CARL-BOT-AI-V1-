let handler = async (m, { conn, text }) => {
	if (!text) throw '*مـن تـريـد حـظــره؟*';
	let who;
	if (m.isGroup) who = m.mentionedJid[0];
	else who = m.chat;
	if (!who) throw '*مـنـشن الشـخـص*';
	
	// تأكد ان المستخدم موجود في قاعدة البيانات
	global.db.data.users[who] = global.db.data.users[who] || {}
	global.db.data.users[who].banned = true;
	
	await conn.reply(m.chat, `*✅ تــم حـظـر* @${who.split('@')[0]}`, m, { mentions: [who] })
};
handler.help = ['ban @tag'];
handler.tags = ['owner'];
handler.command = /^ban(user)?$/i;
handler.owner = true;

export default handler;
