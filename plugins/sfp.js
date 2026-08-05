import fs from 'fs';
import syntaxError from 'syntax-error';

let handler = async (m, { text, usedPrefix, command }) => {
	if (!text)
		throw `*❌ ارسـل مـعـي اسـم مـيـزة وكــود*\n\n*الطـريـقة :*\n${usedPrefix + command} <الاسم>\n\n*مثـال :*\n${usedPrefix + command} ملف_تجريبي`;

	if (!m.quoted?.text) throw `*❌ رد عـلـى الرسـالـة النـي يـوجـد كــود!*`;

	let code = m.quoted.text;
	let path = `./plugins/${text}.js`;

	let err = syntaxError(code, path, {
		sourceType: 'module',
		allowAwaitOutsideFunction: true,
	});

	if (err)
		throw `❌ *خطـأ فـي الـكـود*

*الـرسـالة:* ${err.message}
*السـطـر:* ${err.line}
*العـمـود:* ${err.column}
*الـتفاصـيل:* ${err.annotated}`;

	fs.writeFileSync(path, code);
	m.reply(`✅ *تـم الـحفـظ بنـجـاح*\n📁 المـــســار: ${path}`);
};

handler.help = ['حفظ_بلاجن <الاسم>'];
handler.tags = ['owner'];
handler.command = /^حفظ_بلاجن$/i;
handler.owner = true;

export default handler;
