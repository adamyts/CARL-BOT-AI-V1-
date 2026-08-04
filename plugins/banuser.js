let handler = async (m, { conn, text }) => {
	if (!text) throw '*❌ مـن تـريـد حـظـره؟*\n*مـثـال:*.حـظـر @user';
	
	let الشخص;
	if (m.isGroup) الشخص = m.mentionedJid[0];
	else الشخص = m.chat;
	
	if (!الشخص) throw '*❌ ديـر مـنـشـن لـلـشـخـص*';

	// تأكد ان المستخدم موجود في قاعدة البيانات
	global.db.data.users[الشخص] = global.db.data.users[الشخص] || {}
	global.db.data.users[الشخص].banned = true;
	
	await conn.reply(m.chat, `*✅ تــم حـظـر الـمـسـتـخـدم* @${الشخص.split('@')[0]} *بـنـجـاح*`, m, { mentions: [الشخص] })
};
handler.help = ['حظر @tag'];
handler.tags = ['owner'];
handler.command = /^(حظر|ban(user)?)$/i;
handler.owner = true;

export default handler;
