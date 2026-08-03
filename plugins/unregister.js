import { createHash } from 'crypto';

let handler = async function (m, { args }) {
	if (!args[0]) throw '📌 دخـل الـسيريـال نـمبر\n*مـثال:*.الـغاـء 123abc';

	let user = global.db.data.users[m.sender];
	let sn = createHash('md5').update(m.sender).digest('hex');

	if (args[0]!== sn) throw '❌ سيـريـال نمـبر خـاطـئ';

	user.registered = false;

	m.reply('✅ *تـم الغـاء التسـجـيل بـنجـاح*');
};

handler.help = ['الغاء_تسجيل <السيريال>'];
handler.tags = ['مـعـلـومـات'];
handler.command = /^(الغاء_تسجيل|unreg(ister)?)$/i;
handler.register = false;
export default
