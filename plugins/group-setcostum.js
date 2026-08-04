let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `*واين هو النص؟*\n\n*مثال:*\n${usedPrefix + command} مـرحـبـا @user\n*@user* = مـنـشـن الـعـضـو\n*@subject* = اسـم الـمـجـمـوعـة\n*@desc* = وصـف الـمـجـمـوعـة`;
	let chat = global.db.data.chats[m.chat];

	switch (command) {
		case 'رسالة_الترحيب':
			chat.sWelcome = text;
			m.reply('✅ *تـم تـعـيـيـن رسـالـة الـتـرحـيـب بـنـجـاح:*\n' + text);
			break;
		case 'رسالة_المغادرة':
			chat.sBye = text;
			m.reply('✅ *تـم تـعـيـيـن رسـالـة الـمـغـادرة بـنـجـاح:*\n' + text);
			break;
		case 'رسالة_الترقية':
			chat.sPromote = text;
			m.reply('✅ *تـم تـعـيـيـن رسـالـة الـتـرقـيـة بـنـجـاح:*\n' + text);
			break;
		case 'رسالة_التنزيل':
			chat.sDemote = text;
			m.reply('✅ *تـم تـعـيـيـن رسـالـة الـتـنـزيـل بـنـجـاح:*\n' + text);
			break;
	}
};

handler.help = ['رسالة_الترحيب', 'رسالة_المغادرة', 'رسالة_الترقية', 'رسالة_التنزيل'];
handler.tags = ['group'];
handler.command = /^(رسالة_الترحيب|رسالة_المغادرة|رسالة_الترقية|رسالة_التنزيل)$/i;
handler.group = true;
handler.admin = true;
export default handler;
