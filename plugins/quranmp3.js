import axios from 'axios';

// ===== معلومات القناة =====
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
// ========================

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        let list = `*📖 الـقـرآن الـكـريـم*\n\n`
        list += `*الـطـريـقـة:* ${usedPrefix}${command} <رقـم الـسـورة>\n\n`
        list += `*امـثـلـة:*\n`
        list += `• ${usedPrefix}${command} 1 → الـفـاتـحـة\n`
        list += `• ${usedPrefix}${command} 36 → يـس\n`
        list += `• ${usedPrefix}${command} 112 → الإخـلاص\n`
        list += `*الـقـارئ:* أبـو بـكـر الـشـاطـري`
        return conn.sendMessage(m.chat, { text: list, contextInfo: newsletter }, { quoted: m });
    }

    let surahNumber = parseInt(text);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        return conn.sendMessage(m.chat, { 
            text: `*❌ رقـم الـسـورة غـلـط*\n*خـص يـكـون مـن 1 لـ 114*`, 
            contextInfo: newsletter 
        }, { quoted: m });
    }

    await m.react('⏳');
    
    try {
        let url = `https://server11.mp3quran.net/shatri/${String(surahNumber).padStart(3, '0')}.mp3`;
        
        let surahNames = ['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'];
        
        let surahName = surahNames[surahNumber - 1];
        
        let caption = `*📖 سـورة ${surahName}*\n*🎙️ الـقـارئ:* أبـو بـكـر الـشـاطـري\n*✨ اسـتـمـع وتـدبـر*`;
        
        await conn.sendMessage(m.chat, {
            audio: { url: url },
            mimetype: 'audio/mpeg',
            fileName: `سورة_${surahName}.mp3`,
            ptt: false,
            caption: caption,
            contextInfo: newsletter
        }, { quoted: m });
        
        await m.react('✅');
        
    } catch (e) {
        console.error(e);
        await m.react('❌');
        conn.sendMessage(m.chat, { 
            text: `*❌ فـشـل الـتـحـمـيـل*\n*جـرب مـرة أخـرى*`, 
            contextInfo: newsletter 
        }, { quoted: m });
    }
}

handler.help = ['صوت_القران <رقم_السورة>', 'quran <surah_number>'];
handler.tags = ['ادوات', 'tools'];
handler.command = /^(صوت_القران|قران|قرآن|quran)$/i;
handler.limit = false;

export default handler;
