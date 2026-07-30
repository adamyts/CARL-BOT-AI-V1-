let handler = async (m) => {
	// تأكد ان الشات موجود في قاعدة البيانات
	global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
	global.db.data.chats[m.chat].isBanned = false;
	
	await m.reply('*✅ تـم فـتـح الشـات بنـجـاح*')
};
handler.help = ['unbanchat'];
handler.tags = ['owner'];
handler.command = /^(unbanchat|ubnc)$/i;
handler.owner = true;
handler.group = true;

export default handler;
