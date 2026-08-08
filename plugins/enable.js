import moment from 'moment-timezone'

const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭 ⚽⚡'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

const BANNER = 'https://files.catbox.moe/mfh2sj.jpeg'

let handler = async (m, { conn, usedPrefix: _p, command, args, isOwner }) => {
	if (!isOwner) return m.reply('❌ *هـذا الأمـر لـلـمـطـور فـقـط*')

	const chat = global.db.data.chats[m.chat] || {};
	const user = global.db.data.users[m.sender] || {};
	const settings = global.db.data.settings[conn.user.jid] || {};
	let type = (args[0] || '').toLowerCase();

	const setState = (obj, key, value) => { obj[key] = value }

	const names = {
	'ترحيب': 'الـتـرحـيـب',
	'كشف': 'كـاشـف الـمـحـذوف',
	'حماية_حذف': 'إعـادة الـمـحـذوف',
	'حظر_روابط': 'حـذف الـروابـط',
	'قراءة_ذكية': 'الـقـراءة الـخـفـيـة',
	'وضع_عام': 'الـوضـع الـعـام',
	'مانع_مكالمات': 'حـظـر الـمـتـصـلـيـن',
	'مجموعات_فقط': 'خـدمـة الـمـجـمـوعـات',
	'رفع_مستوى': 'نـظـام الـنـقـاط'
	}

	if(command.toLowerCase() == 'تعطيل' || command.toLowerCase() == 'panel'){
		let sections = [
			{
				title: "✅ تـشـغـيـل الـمـيـزات",
				rows: [
					{title: "👋 تـشـغـيـل الـتـرحـيـب", description: `يـرحـب بـالأعـضـاء الـجـدد | ${chat.welcome? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل ترحيب`},
					{title: "📢 تـشـغـيـل كـاشـف الـمـحـذوف", description: `يـخـبـرك مـن مـسـح | ${chat.detect? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل كشف`},
					{title: "🚫 تـشـغـيـل إعـادة الـمـحـذوف", description: `يـعـيـد الـرسـائـل الـمـمـسـوحـة | ${chat.antiDelete? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل حماية_حذف`},
					{title: "🔗 تـشـغـيـل حـذف الـروابـط", description: `يـحـذف الـروابـط تـلـقـائـيـا | ${chat.antiLink? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل حظر_روابط`},
					{title: "👁️ تـشـغـيـل الـقـراءة الـخـفـيـة", description: `تـقـرا بـلا عـلامـة زرقـاء | ${settings.autoRead? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل قراءة_ذكية`},
					{title: "🌐 تـشـغـيـل الـوضـع الـعـام", description: `أي شـخـص يـسـتـعـمـل الـبـوت | ${settings.isPublic? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل وضع_عام`},
					{title: "📞 تـشـغـيـل حـظـر الـمـتـصـلـيـن", description: `يـحـظـر مـن يـتـصـل | ${settings.antiCall? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل مانع_مكالمات`},
					{title: "🏘️ تـشـغـيـل الـمـجـمـوعـات فـقـط", description: `يـخـدم فـي الـقـروبـات فـقـط | ${settings.groupsOnly? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل مجموعات_فقط`},
					{title: "📈 تـشـغـيـل نـظـام الـنـقـاط", description: `نـقـاط ومـسـتـوى | ${user.autoLevelUp? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}شغل رفع_مستوى`}
				]
			},
			{
				title: "❌ إيـقـاف الـمـيـزات",
				rows: [
					{title: "👋 إيـقـاف الـتـرحـيـب", description: `يـوقـف رسـائـل الـتـرحـيـب | ${chat.welcome? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي ترحيب`},
					{title: "📢 إيـقـاف كـاشـف الـمـحـذوف", description: `مـا يـخـبـركـش | ${chat.detect? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي كشف`},
					{title: "🚫 إيـقـاف إعـادة الـمـحـذوف", description: `مـا يـعـيـدش | ${chat.antiDelete? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي حماية_حذف`},
					{title: "🔗 إيـقـاف حـذف الـروابـط", description: `يـسـمـح بـالـروابـط | ${chat.antiLink? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي حظر_روابط`},
					{title: "👁️ إيـقـاف الـقـراءة الـخـفـيـة", description: `تـرجـع الـزرقـاء | ${settings.autoRead? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي قراءة_ذكية`},
					{title: "🌐 إيـقـاف الـوضـع الـعـام", description: `لـلـمـطـور فـقـط | ${settings.isPublic? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي وضع_عام`},
					{title: "📞 إيـقـاف حـظـر الـمـتـصـلـيـن", description: `يـسـمـح بـالـمـكـالـمـات | ${settings.antiCall? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي مانع_مكالمات`},
					{title: "🏘️ إيـقـاف الـمـجـمـوعـات فـقـط", description: `يـخـدم فـي الـخـاص | ${settings.groupsOnly? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي مجموعات_فقط`},
					{title: "📈 إيـقـاف نـظـام الـنـقـاط", description: `يـوقـف الـمـسـتـوى | ${user.autoLevelUp? 'شـغـال ✅' : 'مـتـوقـف ❌'}`, id: `${_p}طفي رفع_مستوى`}
				]
			}
	]

		return await conn.sendButton(m.chat, {
            image: { url: BANNER },
            caption: `╮──〔 ⚙️ لــوحــة الــتــحــكــم 〕──╭\n│اخـتـر الـمـيـزة لـتـشـغـيـلـهـا أو إيـقـافـهـا\n╯────────────────╰\n\n𝗕𝘆 𝗮𝗱𝗮𝗺.___.𝟵𝟴`,
            footer: { text: `` },
            buttons: [
                { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '⚡ اخـتـر الـعـمـلـيـة', sections: sections }) },
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🏠 الـرجـوع', id: _p + 'الأوامر' }) }
            ],
            headerType: 4,
            contextInfo: newsletter
        }, { quoted: m, mentions: [m.sender] })
	}

	if(command.toLowerCase() == 'شغل'){
		let target = 'فـي هـذه الـمـجـمـوعـة'
		let name = names[type] || type
		if(type == 'رفع_مستوى') target = 'لـك'
		if(['قراءة_ذكية','وضع_عام','مانع_مكالمات','مجموعات_فقط'].includes(type)) target = 'لـلـبـوت'
		
		switch (type) {
			case 'ترحيب': setState(chat, 'welcome', true); break;
			case 'كشف': setState(chat, 'detect', true); break;
			case 'حماية_حذف': setState(chat, 'antiDelete', true); break;
			case 'حظر_روابط': setState(chat, 'antiLink', true); break;
			case 'رفع_مستوى': setState(user, 'autoLevelUp', true); break;
			case 'قراءة_ذكية': setState(settings, 'autoRead', true); break;
			case 'وضع_عام': setState(settings, 'isPublic', true); break;
			case 'مجموعات_فقط': setState(settings, 'groupsOnly', true); break;
			case 'مانع_مكالمات': setState(settings, 'antiCall', true); break;
			default: return m.reply(`*مـثـال:* ${_p}شـغـل تـرحـيـب`);
	}
		return m.reply(`✅ *تـم تـشـغـيـل* ${name} ${target}`)
	}

	if(command.toLowerCase() == 'طفي'){
		let target = 'فـي هـذه الـمـجـمـوعـة'
		let name = names[type] || type
		if(type == 'رفع_مستوى') target = 'لـك'
		if(['قراءة_ذكية','وضع_عام','مانع_مكالمات','مجموعات_فقط'].includes(type)) target = 'لـلـبـوت'

		switch (type) {
			case 'ترحيب': setState(chat, 'welcome', false); break;
			case 'كشف': setState(chat, 'detect', false); break;
			case 'حماية_حذف': setState(chat, 'antiDelete', false); break;
			case 'حظر_روابط': setState(chat, 'antiLink', false); break;
			case 'رفع_مستوى': setState(user, 'autoLevelUp', false); break;
			case 'قراءة_ذكية': setState(settings, 'autoRead', false); break;
			case 'وضع_عام': setState(settings, 'isPublic', false); break;
			case 'مجموعات_فقط': setState(settings, 'groupsOnly', false); break;
			case 'مانع_مكالمات': setState(settings, 'antiCall', false); break;
			default: return m.reply(`*مـثـال:* ${_p}طـفـي تـرحـيـب`);
	}
		return m.reply(`❌ *تـم إيـقـاف* ${name} ${target}`)
	}
};

handler.before = async (m, { conn, usedPrefix: _p }) => {
	if (m.isBaileys || m.fromMe) return
	let selectedId = m?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
	if(!selectedId) return
	try {
		let data = JSON.parse(selectedId)
		let id = data.id
		if (id.startsWith(_p + 'شغل') || id.startsWith(_p + 'طفي')) {
			let [cmd,...rest] = id.slice(_p.length).split(' ')
			await handler(m, { conn, usedPrefix: _p, command: cmd, args: rest, isOwner: true })
	}
		if (id === `${_p}الأوامر`) await conn.execCommand(m, id)
	} catch (e) { console.log(e) }
}

handler.help = ['الاعدادات', 'panel', 'شغل <مـيـزة>', 'طفي <مـيـزة>'];
handler.tags = ['owner'];
handler.command = /^(تعطيل|panel|شغل|طفي)$/i;
handler.owner = true;
export default handler;
