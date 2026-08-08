import moment from 'moment-timezone'

const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
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

	const dbKeys = {
	'ترحيب': 'welcome',
	'كشف': 'detect',
	'حماية_حذف': 'antidelete',
	'حظر_روابط': 'antilink',
	'قراءة_ذكية': 'autoread',
	'وضع_عام': 'public',
	'مانع_مكالمات': 'anticall',
	'مجموعات_فقط': 'gconly',
	'رفع_مستوى': 'autolevelup'
	}

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

	const getState = (key) => {
		let dbkey = dbKeys[key]
		if(['رفع_مستوى'].includes(key)) return user[dbkey]
		if(['قراءة_ذكية','وضع_عام','مانع_مكالمات','مجموعات_فقط'].includes(key)) return settings[dbkey]
		return chat[dbkey]
	}

	//.اعدادات
	if(command.toLowerCase() == 'الاعدادات' || command.toLowerCase() == 'settings'){
		let sections = [
			{
				title: "✅ تـشـغـيـل الـمـيـزات",
				rows: Object.keys(names).map(k => ({
					title: `تـشـغـيـل ${names[k]}`,
					description: `الـحـالـة: ${getState(k)? 'شـغـال ✅' : 'مـتـوقـف ❌'}`,
					id: `${_p}شغل ${k}`
				}))
			},
			{
				title: "❌ تـعـطـيـل الـمـيـزات",
				rows: Object.keys(names).map(k => ({
					title: `تـعـطـيـل ${names[k]}`,
					description: `الـحـالـة: ${getState(k)? 'شـغـال ✅' : 'مـتـوقـف ❌'}`,
					id: `${_p}طفي ${k}`
				}))
			}
	]

		return await conn.sendButton(m.chat, {
            image: { url: BANNER },
            caption: `╮──〔 ⚙️ لــوحــة الإعــدادات 〕──╭\n│اخـتـر الـمـيـزة لـتـشـغـيـلـهـا أو تـعـطـيـلـهـا\n╯────────────────╰\n\n𝗕𝘆 𝗮𝗱𝗮𝗺.___.𝟵𝟴`,
            footer: { text: `` },
            buttons: [
                { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '⚡ اخـتـر الـعـمـلـيـة', sections: sections }) },
                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🏠 الـرجـوع', id: _p + 'الأوامر' }) }
            ],
            headerType: 4,
            contextInfo: newsletter
        }, { quoted: m, mentions: [m.sender] })
	}

	let runAction = async (state) => {
		let dbkey = dbKeys[type]
		if(!dbkey) return m.reply(`*مـثـال:* ${_p}شـغـل تـرحـيـب`)
		
		let target = 'فـي هـذه الـمـجـمـوعـة'
		if(type == 'رفع_مستوى') target = 'لـك'
		if(['قراءة_ذكية','وضع_عام','مانع_مكالمات','مجموعات_فقط'].includes(type)) target = 'لـلـبـوت'

		if(['رفع_مستوى'].includes(type)) user[dbkey] = state
		else if(['قراءة_ذكية','وضع_عام','مانع_مكالمات','مجموعات_فقط'].includes(type)) settings[dbkey] = state
		else chat[dbkey] = state
		
		await global.db.write();
		return m.reply(`${state? '✅ *تـم تـشـغـيـل*' : '❌ *تـم تـعـطـيـل*'} ${names[type]} ${target}`)
	}

	if(command.toLowerCase() == 'شغل') return runAction(true)
	if(command.toLowerCase() == 'طفي') return runAction(false)
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
			await handler(m, { conn, usedPrefix: _p, command: cmd, args: rest, isOwner: isOwner })
	}
		if (id === `${_p}الأوامر`) await conn.execCommand(m, id)
	} catch (e) { console.log(e) }
}

handler.help = ['الاعدادات', 'settings', 'شغل <مـيـزة>', 'طفي <مـيـزة>'];
handler.tags = ['owner'];
handler.command = /^(الاعدادات|settings|شغل|طفي)$/i;
handler.owner = true;
export default handler;
