let handler = async (m, { conn, usedPrefix: _p, command, args, isOwner }) => {
	if (!isOwner) return m.reply('❌ *هذا الأمر للمطور فقط*')

	const isEnable = /^(true|enable|(turn)?on|1|تفعيل)$/i.test(command);
	const chat = global.db.data.chats[m.chat] || {};
	const user = global.db.data.users[m.sender] || {};
	const settings = global.db.data.settings[conn.user.jid] || {};
	let type = (args[0] || '').toLowerCase();

	if(command.toLowerCase() == 'الاعدادات'){
		let sections = [
			{ title: "👥 قـسـم الـمـجـمـوعـة", rows: [
				{title: "👋 الـترحـيب", description: `الحالة: ${chat.welcome ? '✅' : '❌'}`, id: `${_p}تفعيل welcome`},
				{title: "📢 الكـشـف", description: `الحالة: ${chat.detect ? '✅' : '❌'}`, id: `${_p}تفعيل detect`},
				{title: "🚫 مـنـع الـحـذف", description: `الحالة: ${chat.delete ? '✅' : '❌'}`, id: `${_p}تفعيل antidelete`},
				{title: "🔗 مـنـع الـروابـط", description: `الحالة: ${chat.antilink ? '✅' : '❌'}`, id: `${_p}تفعيل antilink`}
			]},
			{ title: "👑 قـسـم الـمـطـور", rows: [
				{title: "👁️ الـقراءة التلـقائيـة", description: `الحالة: ${settings.autoread ? '✅' : '❌'}`, id: `${_p}تفعيل autoread`},
				{title: "🌐 عـام", description: `الحالة: ${settings.public ? '✅' : '❌'}`, id: `${_p}تفعيل public`},
				{title: "📞 مـنـع المـكـالمات", description: `الحالة: ${settings.anticall ? '✅' : '❌'}`, id: `${_p}تفعيل anticall`},
				{title: "🏘️ للـمجمـوعـات فـقـط", description: `الحالة: ${settings.gconly ? '✅' : '❌'}`, id: `${_p}تفعيل gconly`},
				{title: "📈 المـستـوى الـتلقـائي", description: `الحالة: ${user.autolevelup ? '✅' : '❌'}`, id: `${_p}تفعيل autolevelup`}
			]}
	]

		return await conn.sendButton(m.chat,{
			image: { url: 'https://files.catbox.moe/e6ztfh' },
			caption: `⚙️ *اعـدادات الـبـوت*\n\n*`,
			footer: { text: "© 𝘾𝘼𝙍𝙇-𝘽𝙊𝙏" },
			buttons: [
				{name:'single_select', buttonParamsJson:JSON.stringify({title:'✅ تـفـعـيـل', sections})},
				{name:'single_select', buttonParamsJson:JSON.stringify({title:'❌ تـعـطـيـل', sections: sections.map(s => ({...s, rows: s.rows.map(r => ({...r, id: r.id.replace('تفعيل', 'تعطيل')}))}))})}
			]
	},{quoted:m})
	}

	let isAll = false, isUser = false;
	switch (type) {
		case 'welcome': chat.welcome = isEnable; break;
		case 'detect': chat.detect = isEnable; break;
		case 'antidelete': case 'delete': chat.delete = isEnable; break;
		case 'antilink': chat.antilink = isEnable; break;
		case 'autolevelup': isUser = true; user.autolevelup = isEnable; break;
		case 'autoread': isAll = true; settings.autoread = isEnable; break;
		case 'public': isAll = true; settings.public = isEnable; break;
		case 'gconly': case 'grouponly': isAll = true; settings.gconly = isEnable; break;
		case 'anticall': isAll = true; settings.anticall = isEnable; break;
		default:
			return m.reply(`*امثلة:*\n- ${_p}تفعيل welcome\n- ${_p}تعطيل antilink\n- ${_p}الاعدادات`);
	}

	m.reply(`✅ *تـــم ${isEnable? 'تفعيل' : 'تعطيل'}* ${type} ${isAll? 'للبـوت' : isUser? 'لك' : 'لهـذه المـجـموعـة'}`);
};

handler.help = ['الاعدادات', 'تفعيل <ميزة>', 'تعطيل <ميزة>'];
handler.tags = ['owner'];
handler.command = /^((en|dis)able|(true|false)|(turn)?(on|off)|[01]|تفعيل|تعطيل|الاعدادات)$/i;
handler.owner = true;
export default handler;
