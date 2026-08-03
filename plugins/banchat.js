let handler = async (m) => {
	// تأكد ان الشات موجود في قاعدة البيانات
	global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
	global.db.data.chats[m.chat].isBanned = true;
	
	await m.reply('*✅ تـم قـفل الـشات بـنجــاح*')
};
handler.help = ['banchat'];
handler.tags = ['owner'];
handler.command = /^(banchat|قفل_شات)$/i;
handler.owner = true;
handler.group = true;
export default handler;
