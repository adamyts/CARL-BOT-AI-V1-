import moment from 'moment-timezone'

// ─── Channel Info ─────────────────────────────────────────────
const channelName = 'GI : adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

// رياكشن خاص بكل قسم
const reactions = {
    main: '🏠',
    downloader: '📥',
    search: '🔍',
    islamic: '🌙',
    ai: '🤖',
    fun: '🎯',
    sticker: '🎨',
    news: '📰',
    weather: '🌤️',
    jadibot: '👤',
    group: '👥',
    owner: '👑'
}

const handler = async (m, { conn, usedPrefix: _p, args, command }) => {
    try {
        let category = (args[0] || '').toLowerCase()

        let pp
        try {
            pp = await conn.profilePictureUrl(m.sender, 'image')
        } catch {
            pp = 'https://i.ibb.co/1Yc4Z1z/default.jpg'
        }

        let date = moment().tz('Africa/Casablanca').format('DD MMMM YYYY')

        let instaLink = 'https://instagram.com/adam.__.98'
        let channelLink = 'https://whatsapp.com/channel/0029VbCxraN7T8bbAyc2j31J'

        const menus = {
            main: `*🤖 قـسـم الـرئيـسـية*

*🟢 ${_p}ping* : فـحـص سـرعـة الـبـوت
*📋 ${_p}menu* : عـرض الـقـائـمـة`,

            downloader: `*📥 قـسـم تـحـميـل*

*🎵 ${_p}play* : تـحـمـيـل اغـنـيـة
*🎬 ${_p}ytmp4* : تـحـمـيـل فـيـديـو يـوتـيـوب
*🎧 ${_p}ytmp3* : تـحـمـيـل صـوت يـوتـيـوب
*🎶 ${_p}tiktok* : تـحـمـيـل تـيـك تـوك
*📷 ${_p}ig* : تـحـمـيـل انـسـتـغـرام
*📘 ${_p}fb* : تـحـمـيـل فـيـسـبـوك
*🐦 ${_p}x* : تـحـمـيـل تـويـتـر
*📦 ${_p}apk* : تـحـمـيـل تـطـبـيـقـات
*🔗 ${_p}alldownload* : كـل روابـط الـتـحـمـيـل
*☁️ ${_p}mediafire* : تـحـمـيـل مـيـديـا فـايـر`,

            search: `*🔍 قـسـم الـبحـث*

*🎬 ${_p}yts* : بـحـث فـي الـيـوتـيـوب
*🔎 ${_p}pinterest* : بـحـث عـن صـور
*💻 ${_p}githubsearch* : بـحـث فـي جـيـت هـاب
*🎵 ${_p}lyrics* : الـبـحـث عـن كـلـمـات اغـنـيـة`,

            islamic: `*🌙 قـسـم الـديـن*

*🎙️ ${_p}quranmp3* : تـحـمـيل القـران الكـريـم
*📖 ${_p}quran* : قـراءة الـقـرآن
*🕌 ${_p}prayer*: اوقـات الـصـلاة `,

            ai: `*🤖 قـسـم الـدكـاء الاصـطـناعـي*

*💬 ${_p}ai* : الـدردشـة مـع الـذكـاء
*🌻 ${_p}aimirroe* : انـشاء تصـميـم احتـرافـي 
*🎨 ${_p}imagine* : انـشـاء صـورة بـالـذكـاء`,

            fun: `*🎯 قـسـم الـترفـيـه*

*🎰 ${_p}slots* : لـعـبـة الـسـلـوت
*❌ ${_p}xo* : لـعـبـة XO`,

            sticker: `*🎨 قـسـم الـسـتيـكر*

*🖼️ ${_p}toimg* : تـحـويـل سـتـيـكـر لـصـورة
*🔍 ${_p}hd* : تـحـسـيـن جـودة الـصـورة
*🎬 ${_p}sticker* : صـورة فـيـديـو الـى سـتـيـكـر`,

            news: `*📰 قـسـم الاخـبـار*

*🗞️ ${_p}newsma* : اخـبـار الـيـوم
*🌍 ${_p}aljazeera* : اخبار الـعالـم`,

            weather: `*🌤️ قـسـم الـطـقـس*

*☀️ ${_p}weather* : طـقـس الـيـوم`,

            jadibot: `*👤 قـسـم جـاديـبـوت*

*📎 ${_p}jadibot* : ربـط رقـمـك ربـوتـات`,

            group: `*👥 قـسـم المـجـموعـة*

*✅ ${_p}enable 🄾* : تـفـعـيل مـيـزة
*❌ ${_p}disable 🄾* : تـعـطيـل مـيـزة
*🦶 ${_p}kick* : طــرد عـضــو
*➕ ${_p}add* :اضـافـة عـضــو`,

            owner: `*👑 قـسـم المـطـور*

*🗑️ ${_p}kick 🄾* طــرد عـضــو
*📩 ${_p}addprem 🄾* : اضـافـة بـريـمـيـوم
*🗑️ ${_p}delprem 🄾* : حـذف بـريـمـيـوم
*🔒 ${_p}banchat 🄾* : قـفـل الـشـات
*⛔ ${_p}ban 🄾* : حـظـر
*📝 ${_p}deletemsg 🄾* : حـذف رسـالـة
*✳️ ${_p}getplugin 🄾* : جـلـب الـبـلـوغـن
*🔄 ${_p}add 🄾* : اضـافـة
*✔️ ${_p}promote 🄾* : تـرقـيـة لـمـشـرف
*❌ ${_p}demote 🄾* : انـزال مـن مـشـرف
*🔓 ${_p}opengc 🄾* : فـتـح الـجـروب
*📦 ${_p}setdemote 🄾*
*🏷️ ${_p}listpremium 🄾* : لائـحـة الـبـريـمـيـوم
*🔓 ${_p}unbanchat 🄾* : فـتـح الـشـات
*⭐ ${_p}hidetag* : مـنـشـن مـخـفـي
*👥 ${_p}tag* : مـنـشـن لـلـكـل
*📎 ${_p}revoke* : تـجـديـد ربـط الـجـروب
*🔏 ${_p}closegc 🄾* : اغــلاق الـجـروب
*⭐ ${_p}setwelcome 🄾* : تـحـديـد رسـالـة
*🚫 ${_p}unban 🄾* : الـغـاء الـحـظـر
*🔄 ${_p}restart 🄾* : اعـادة تـشـغـيـل
*⭐ ${_p}sfp 🄾*
*📢 ${_p}setbye 🄾* : تـحـديـد رسـالـة الـوداع
*🏷️ ${_p}dfp 🄾*`
        }

        if (category && menus[category]) {
            // رياكشن خاص بالقسم
            let react = reactions[category] || '✅'
            await conn.sendMessage(m.chat, { react: { text: react, key: m.key } })

            let caption = `*أهـلاً وسـهـلاً @${m.sender.split('@')[0]}* 🌟\n\n${menus[category]}\n`
            return await conn.sendButton(m.chat, {
                image: { url: pp },
                caption: caption,
                buttons: [
                    {name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '🏠 رجــوع قـائـمـة الـرئـيـســة 🏠', id: _p + 'menu'})}
                ],
                contextInfo: newsletter
            }, {quoted: m, mentions: [m.sender]})
        }

        // رياكشن القائمة الرئيسية
        await conn.sendMessage(m.chat, { react: { text: reactions.main, key: m.key } })

        // القائمة الرئيسية
        let caption = `*أهـلاً وسـهـلاً @${m.sender.split('@')[0]}* 🌟

*📌 مـعـلـومـات عـن مـطـور الـبـوت*

*💎 اسـم الـبـوت :* \`CARL-BOT\`
*👨‍💻 الـمـطـور :* \`adam.__.98\`
*📅 تـاريـخ الـيـوم :* \`${date}\`

*مـرحـباً بـك فـي CARL-BOT بـوت نـتـمـنـى لـك تـجـربـة مـمـتـعـة ✨🐢*

> *BY adam.__.98*`

        let sections = [
            {
                title: "📚 الائـــحــــت الأوامــــــــــر 📚",
                rows: [
                    {title: "🏠 قـسـم الـرئيـسيـة", description: "📌 عــدد الـمـيـزات 2", id: _p + "menu main"},
                    {title: "📥 قـسـم التـحـمـيـل", description: "📌 عــدد الـمـيـزات 10", id: _p + "menu downloader"},
                    {title: "🔍 قـسـم البــحـث", description: "📌 عــدد الـمـيـزات 4", id: _p + "menu search"},
                    {title: "🌙 قـسـم الـديـن", description: "📌 عــدد الـمـيـزات 3", id: _p + "menu islamic"},
                    {title: "🤖 قـسـم الـذكـاء الاصـطـناعـي", description: "📌 عــدد الـمـيـزات 3", id: _p + "menu ai"},
                    {title: "🎯 قـسـم التـرفـيـه", description: "📌 عــدد الـمـيـزات 2", id: _p + "menu fun"},
                    {title: "🎨 قـسـم السـتيـكر", description: "📌 عــدد الـمـيـزات 3", id: _p + "menu sticker"},
                    {title: "📰 قـسـم الاخـبـار", description: "📌 عــدد الـمـيـزات 2", id: _p + "menu news"},
                    {title: "🌤️ قـسـم الـطـقـس", description: "📌 عــدد الـمـيـزات 1", id: _p + "menu weather"},
                    {title: "👤 قـسـم جـاديـبـوت", description: "📌 عــدد الـمـيـزات 1", id: _p + "menu jadibot"},
                    {title: "👥 قـسـم المـجـموعـات", description: "📌 عــدد الـمـيـزات 4", id: _p + "menu group"},
                    {title: "👑 قـسـم المـطـور", description: "📌 عــدد الـمـيـزات 24", id: _p + "menu owner"}
                ]
            }
        ]

        await conn.sendButton(m.chat, {
            image: { url: pp },
            caption: caption,
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '🗂️ اضـــغـــط هــنـــــــا ',
                        sections: sections
                    }),
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 قــنــاة الـواتــســاب',
                        url: channelLink
                    }),
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📸 حـسابــي انـسـتـغـرام',
                        url: instaLink
                    }),
                },
            ],
            contextInfo: newsletter
        }, { quoted: m, mentions: [m.sender] })

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { text: `❌ *خطأ:* ${e.message}`, contextInfo: newsletter }, { quoted: m })
    }
}

handler.help = ['menu', 'dd']
handler.tags = ['main']
handler.command = /^(menu|dd|hh)$/i

export default handler
