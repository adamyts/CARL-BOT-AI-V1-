import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { exec } from 'child_process'
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

// ===== تعريفات عامة =====
const jadi = 'jadi'
const channelName = 'Jadibot'
const channelLink = ''
const instaLink = 'https://instagram.com/adam.__.98'

const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363410733859643@newsletter',
    newsletterName: channelName
  }
} // <-- هنا كان ناقص هاد القوس

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"

let rtx = `*⚡️ طـريـقـة الـربـط السـريـعــة* \n\n📲 1 قـم بفتـح واتـساب علـى جـهازك الآخــر\n✨ 2 انـتـقل إلـى الأجـهـزة المـرتـبطـة\n📸 3 امـسح رمـز الـ QR الـظاهـر هـنا\n⏳ 4 انـتظر قلـيلاً حـتى يـتـم الاتـصـال\n✔️ 5 يـتـم تـشغـيل البـوت الـفرعـي بنـجاج \n\n`.trim()

let rtx2 = `*🔗 ربـط بـوت فــرعـي جـديــد* \n\n🤖 الـــبـوت : CARL-BOT \n\n✨ 1 افتـح الأجـهزة المـرتبـطـة فـي واتـسـاب\n📎 2 اخـترا الــربـط بـكـود تحـقـق مـن البـوت الأسـاســـي \n🗝️ 3 ادخـل الـكـود الـذي سيـصلـك مـن بـوت \n✔️ 4 انتـظـر حـتـى يـتـم الـربـط بنـجـاح وتـأكـيــد\n\🎉 5 يتـم تـشـغـيل البـوت الفـرعـي بـنجـاح\n${channelLink}\n\n`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}

if (!global.conns) global.conns = []
if (!global.jadiMode) global.jadiMode = {} // نخزنو الاختيار هنا

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState!== ws.CLOSED).map((conn) => conn)])]
    if (subBots.length >= 30) return m.reply(`❌ معـتـش امـاكـن، الـعـدد وصـل للـحد الأقـصـى 30 بــوت`)

    let who = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.fromMe? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathYukiJadiBot = path.join(`./${jadi}/`, id)

    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true })

    // اذا مافيش args نطلعو القائمة
    if(args.length === 0){
        let sections = [
          {
            title: "📎 اخــتـر طـريـقـة الـربـط 📎",
            rows: [
              { title: "📋 بـالـكـود", description: "اربـط الـبوت بـكـود تـحـقق", id: `${usedPrefix}jadibot code` },
              { title: "📸 بـالـQR", description: "اربــط البـوت بـمسـح QR", id: `${usedPrefix}jadibot qr` },
            ]
          }
        ]
        return await conn.sendButton(m.chat, {
            text: `*🤖 اخـتـار طـريقـة ربـط الـبـوت الـفرعـي*\n\nالـكـود اسـهـل، والـ QR اسـرع`,
            footer: { text: `CARL-BOT` },
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '⬇️ اضـغـط هــنـا للاخـتــيار',
                        sections: sections
                    }),
                }
            ],
            headerType: 1,
            contextInfo: newsletter
        }, { quoted: m })
    }

    // نخزن الاختيار باش منضيعوش
    global.jadiMode[id] = args[0]

    yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
    yukiJBOptions.m = m
    yukiJBOptions.conn = conn
    yukiJBOptions.args = args
    yukiJBOptions.usedPrefix = usedPrefix
    yukiJBOptions.command = command
    yukiJBOptions.fromCommand = true
    yukiJBOptions.id = id
    await yukiJadiBot(yukiJBOptions)

    if(global.db?.data?.users[m.sender]) global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['jadibot']
handler.tags = ['serbot']
handler.command = ["jadibot"]
export default handler

handler.before = async (m, { conn, usedPrefix }) => {
    if(m.text.startsWith(`${usedPrefix}jadibot `)){
        let mode = m.text.split(' ')[1]
        if(mode === 'code' || mode === 'qr'){
            await handler(m, { conn, args: [mode], usedPrefix, command: 'jadibot' })
            return true
        }
    }
}

export async function yukiJadiBot(options) {
    let { pathYukiJadiBot, m, conn, args, usedPrefix, command, id } = options

    const pathCreds = path.join(pathYukiJadiBot, "creds.json")
    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true })

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {

        let { version } = await fetchLatestBaileysVersion()
        const msgRetryCache = new NodeCache()
        const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetryCache,
            browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, qr } = update
            const mode = global.jadiMode[id] // نجيبو الاختيار من global

            if (qr) {
                // 1. حالة الكود
                if (mode === 'code') {
                    let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
                    global.jadicode = global.jadicode || {}
                    global.jadicode[m.sender] = secret

                    await conn.sendButton(m.chat, {
                        text: `${rtx2}\n\n*الــكــــود:* \`\`${secret}\`\n\n قــوم نســخ كـــود`,
                        footer: { text: `CARL-BOT` },
                        buttons: [
                            {
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '📢 قــنــاة الـواتــســاب',
                                    url: channelLink
                                }),
                            },
                        ],
                        contextInfo: newsletter
                    }, { quoted: m })
                    console.log('CODE:', secret)
                }

                // 2. حالة QR
                if (mode === 'qr') {
                    let qrBuffer = await qrcode.toBuffer(qr)
                    await conn.sendMessage(m.chat, {
                        image: qrBuffer,
                        caption: rtx,
                        footer: { text: `ITACHI BOT` },
                        contextInfo: newsletter
                    }, { quoted: m })
                }
            }

            const reason = lastDisconnect?.error?.output?.statusCode
            if (connection === 'close') {
                delete global.jadiMode[id]
                if ([428,408,515].includes(reason)) await creloadHandler(true).catch(console.error)
                if ([405,401,403].includes(reason)) fs.rmdirSync(pathYukiJadiBot, { recursive: true })
                if (reason === 500) return creloadHandler(true).catch(console.error)
            }
            if (connection == `open`) {
                delete global.jadiMode[id]
                let userName = sock.authState.creds.me.name || 'Anónimo'
                console.log(chalk.bold.cyanBright(`\n✅ ${userName} (+${path.basename(pathYukiJadiBot)}) متـصل بنـجاح.`))
                sock.isInit = true
                global.conns.push(sock)
                await joinChannels(sock)
            }
        }

        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close() } catch (e) { }
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)
                if (i < 0) return
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
        }, 60000)

        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler
            } catch (e) { console.error('خطأ: ', e) }
            if (restatConn) {
                const oldChats = sock.chats
                try { sock.ws.close() } catch { }
                sock.ev.removeAllListeners()
                sock = makeWASocket(connectionOptions, { chats: oldChats })
                isInit = true
            }
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler)
                sock.ev.off("connection.update", sock.connectionUpdate)
                sock.ev.off('creds.update', sock.credsUpdate)
            }
            sock.handler = handler.handler.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock, true)
            sock.ev.on("messages.upsert", sock.handler)
            sock.ev.on("connection.update", sock.connectionUpdate)
            sock.ev.on("creds.update", sock.credsUpdate)
            isInit = false
            return true
        }
        creloadHandler(false)
    })
}

async function joinChannels(conn) {
  const MAIN_CHANNEL = '120363410733859643@newsletter';
  await conn.newsletterFollow(MAIN_CHANNEL).catch(() => {});
        }
