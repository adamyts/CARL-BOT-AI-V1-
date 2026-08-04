let handler = async (m, { conn, usedPrefix, command, args: [الحدث] }) => {
	if (!الحدث)
		return await conn.reply(
			m.chat,
			`*📝 طـريـقـة الاسـتـخـدام:*\n` +
			`${usedPrefix + command} تـرحـيـب @user\n` +
			`${usedPrefix + command} مـغـادرة @user\n` +
			`${usedPrefix + command} تـرقـيـة @user\n` +
			`${usedPrefix + command} تـنـزيـل @user\n` +
			`*مـلـحـوظـة:* ديـر مـنـشـن لـلـعـضـو او خـلـيـه فـارغ بـاش يـتـطـبـق عـلـيـك`.trim(),
			m
	);
	let العضو = m.mentionedJid[0] || m.sender;
	let الفعل = false;
	
	await m.reply(`*⏳ كـنـحـاكـي ${الحدث}...*`);
	
	switch (الحدث.toLowerCase()) {
		case 'add':
		case 'invite':
		case 'ترحيب':
		case 'welcome':
			الفعل = 'add';
			break;
		case 'bye':
		case 'kick':
		case 'leave':
		case 'remove':
		case 'مغادرة':
			الفعل = 'remove';
			break;
		case 'promote':
		case 'ترقية':
			الفعل = 'promote';
			break;
		case 'demote':
		case 'تنزيل':
			الفعل = 'demote';
			break;
		default:
			throw '❌ *الـحـدث غـيـر مـوجـود*';
	}
	
	if (الفعل)
		return conn.participantsUpdate({
			id: m.chat,
			participants: [{ id: العضو }],
			action: الفعل,
			simulate: true,
		});
};
handler.help = ['محاكاة'];
handler.tags = ['group'];
handler.command = /^(محاكاة|simulate|simulasi)$/i;
handler.group = true;
handler.admin = true;
export default handler;
