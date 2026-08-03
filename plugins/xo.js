let game = {}

let handler = async (m, { conn, command, args }) => {
    let user = m.sender
    let chat = m.chat

    // ===== Channel Info =====
    const channelName = 'GI : adam.__.98' // بدل الاسم
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363410733859643@newsletter', // <-- حط هنا معرف القناة ديالك
            newsletterName: channelName
        }
    }
    // ========================

    if(command === 'xo'){
        // بدء لعبة جديدة ضد الذكاء
        if(!game[chat]){
            game[chat] = {
                player: user,
                ai: 'AI',
                turn: user,
                board: ['','','','','','','','',''],
                status: 'playing'
            }

            let txt = `*⭕ لـعبــة XO ضـد الـذكـاء*\n\n`
            txt += `*أنـت:* @${user.split('@')[0]} ❌\n`
            txt += `*الخـصــم:* 🤖 الــذكــاء الاصـطنـاعـي ⭕\n\n`
            txt += `*الــدور:* @${user.split('@')[0]}\n\n`
            txt += renderBoard(game[chat].board)
            txt += `\n*طـريقة اللـعـب:*.xo 1-9\n`
            txt += `*مـثــال:*.xo 5`

            return await conn.sendMessage(chat, { text: txt, mentions: [user], contextInfo: newsletter }, { quoted: m })
        }

        let g = game[chat]
        if(user!== g.turn) return await conn.sendMessage(chat, { text: '⏳ *انتــظـر دور الذكــاء الاصـطـناعـي*', contextInfo: newsletter }, { quoted: m })

        let num = parseInt(args[0])
        if(!num || num < 1 || num > 9) return await conn.sendMessage(chat, { text: '📌 *مــثـال:*.xo 5\nاختـر رقـما مــن 1 الى 9', contextInfo: newsletter }, { quoted: m })

        let idx = num - 1
        if(g.board[idx]!== '') return await conn.sendMessage(chat, { text: '❌ *هـذه الـخانـة مسـتـخدمـة بالفـعــل*', contextInfo: newsletter }, { quoted: m })

        // دور اللاعب
        g.board[idx] = 'X'

        // فحص الفوز
        if(checkWin(g.board, 'X')){
            let txt = `*🏆 لـقـد فــزت*\n\n`
            txt += `*تـهـانيـنا @${user.split('@')[0]}* 🎉\n\n`
            txt += renderBoard(g.board)
            await conn.sendMessage(chat, { text: txt, mentions: [user], contextInfo: newsletter }, { quoted: m })
            delete game[chat]
            return
        }

        // تعادل
        if(!g.board.includes('')){
            await conn.sendMessage(chat, { text: `*🤝 تــعـادل*\n\n${renderBoard(g.board)}`, contextInfo: newsletter }, { quoted: m })
            delete game[chat]
            return
        }

        // دور الذكاء
        g.turn = 'AI'
        await new Promise(r => setTimeout(r, 800)) // يفكر
        aiMove(g)

        // فحص فوز الذكاء
        if(checkWin(g.board, 'O')){
            let txt = `*💻 الـذكـاء الاصـطنـاعـي فــاز*\n\n`
            txt += `*حظـا اوفـر فـي المـرة الـقـادمـة* 😅\n\n`
            txt += renderBoard(g.board)
            await conn.sendMessage(chat, { text: txt, contextInfo: newsletter }, { quoted: m })
            delete game[chat]
            return
        }

        // تعادل
        if(!g.board.includes('')){
            await conn.sendMessage(chat, { text: `*🤝 تــعــــادل*\n\n${renderBoard(g.board)}`, contextInfo: newsletter }, { quoted: m })
            delete game[chat]
            return
        }

        // العودة لدورك
        g.turn = user
        let txt = `*⭕ لعـبـة XO ضـد الـذكـاء*\n\n`
        txt += `*الدور:* @${user.split('@')[0]}\n\n`
        txt += renderBoard(g.board)
        await conn.sendMessage(chat, { text: txt, mentions: [user], contextInfo: newsletter }, { quoted: m })

    } else if(command === 'xoleave'){
        if(!game[chat]) return await conn.sendMessage(chat, { text: '❌ *لا تـوجد لعـبة تعـمل حـالـيا*', contextInfo: newsletter }, { quoted: m })
        delete game[chat]
        await conn.sendMessage(chat, { text: '✅ *تـم الـغاء الـلـعبـة*', contextInfo: newsletter }, { quoted: m })
    }
}

// الذكاء الاصطناعي
function aiMove(g){
    let board = g.board

    // 1. هل يمكن للذكاء الفوز
    for(let i = 0; i < 9; i++){
        if(board[i] === ''){
            board[i] = 'O'
            if(checkWin(board, 'O')) return
            board[i] = ''
        }
    }

    // 2. يجب منع اللاعب
    for(let i = 0; i < 9; i++){
        if(board[i] === ''){
            board[i] = 'X'
            if(checkWin(board, 'X')){
                board[i] = 'O'
                return
            }
            board[i] = ''
        }
    }

    // 3. العب في الوسط اذا كان فارغا
    if(board[4] === ''){
        board[4] = 'O'
        return
    }

    // 4. لعب عشوائي
    let empty = []
    for(let i = 0; i < 9; i++) if(board[i] === '') empty.push(i)
    let random = empty[Math.floor(Math.random() * empty.length)]
    board[random] = 'O'
}

function renderBoard(board){
    let b = board.map((v,i) => v || (i+1))
    return `${b[0]} | ${b[1]} | ${b[2]}\n${b[3]} | ${b[4]} | ${b[5]}\n${b[6]} | ${b[7]} | ${b[8]}`
}

function checkWin(b, mark){
    let wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,5],[2,5,8],[0,4,8],[2,4,6]]
    for(let w of wins){
        if(b[w[0]] === mark && b[w[1]] === mark && b[w[2]] === mark)
            return true
    }
    return false
}

handler.help = ['xo', 'xo <1-9>', 'xoleave']
handler.tags = ['game']
handler.command = /^(اكس_او|xoleave)$/i

export default handler
