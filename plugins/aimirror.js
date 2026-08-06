// instagram.com/noureddine_ouafy
// scrape by Fahmi-XD
// تـعـديـل : نـورديـن - ستيل عادي

import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";

// ===== Channel Info + Instagram =====
const channelName = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const CHANNEL_ID = '120363410733859643@newsletter' // <-- معرف قناة daily
const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// =====================================

class Helper {
  static BASE_URL = "https://be.aimirror.fun";
  static UID = Helper.generateRandomHash();
  static HEADERS = {
    'User-Agent': 'AIMirror/6.8.4+179 (android)',
    'store': 'googleplay',
    'uid': Helper.UID,
    'env': 'PRO',
    'accept-language': 'en',
    'accept-encoding': 'gzip',
    'package-name': 'com.ai.polyverse.mirror',
    'host': 'be.aimirror.fun',
    'content-type': 'application/json',
    'app-version': '6.8.4+179'
  };

  static hash = "";
  static imageKey = "";

  static sha1FromString(str) {
    return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
  }

  static withExt(hexHash, ext = '.jpg') {
    return `${hexHash}${ext}`;
  }

  static async urlToBuffer(imageUrl, headers = {}) {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer', headers });
    return Buffer.from(res.data);
  }

  static generateRandomHash() {
    const hexChars = "0123456789abcdef";
    return Array.from({ length: 16 }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join("");
  }

  static async fetchAppToken() {
    if (!this.hash) throw new Error("Helper.hash must be set before fetchAppToken");
    const url = `${this.BASE_URL}/app_token/v2`;
    const params = { cropped_image_hash: this.withExt(this.hash), uid: this.UID };
    const res = await axios.get(url, { params, headers: this.HEADERS });
    return res.data;
  }

  static async uploadPhoto(payload) {
    const body = new FormData();
    body.append("name", payload.name);
    body.append("key", payload.key);
    body.append("policy", payload.policy);
    body.append("OSSAccessKeyId", payload.OSSAccessKeyId);
    body.append("success_action_status", payload.success_action_status);
    body.append("signature", payload.signature);
    body.append("backend_type", payload.backend_type);
    body.append("region", payload.region);
    body.append("file", payload.file, { filename: this.withExt(this.hash), contentType: "application/octet-stream" });

    const headers = {...body.getHeaders(), "User-Agent": "Dart/3.6 (dart:io)" };
    await axios.post(payload.upload_host, body, { headers });
  }

  static async requestDraw(payload = {}) {
    const url = `${this.BASE_URL}/draw?uid=${this.UID}`;
    const data = {
      model_id: payload.model_id || 204,
      cropped_image_key: this.imageKey,
      cropped_height: payload.cropped_height || 1024,
      cropped_width: payload.cropped_width || 768,
      package_name: "com.ai.polyverse.mirror",
      ext_args: {
        imagine_value2: payload.imagine_value2 || 50,
        custom_prompt: payload.custom_prompt || ""
      },
      version: "6.8.4",
      force_default_pose: payload.force_default_pose || false,
      is_free_trial: payload.is_free_trial || true
    };
    const res = await axios.post(url, data, { headers: this.HEADERS });
    return res.data;
  }

  static async waitForDraw(draw_request_id, delaySec = 7) {
    const url = `${this.BASE_URL}/draw/process`;
    while (true) {
      const res = await axios.get(url, { headers: this.HEADERS, params: { draw_request_id, uid: this.UID } });
      const data = res.data;
      if (data.draw_status === "SUCCEED") return data.generated_image_addresses;
      if (data.draw_status === "FAILED") throw new Error("Draw failed");
      await new Promise(r => setTimeout(r, delaySec * 1000));
    }
  }
}

async function create(hyperParameter = {}, delaySec = 7) {
  Helper.hash = Helper.sha1FromString(crypto.randomUUID());
  const appToken = await Helper.fetchAppToken();
  Helper.imageKey = appToken.key;
  await Helper.uploadPhoto(appToken);
  const generate = await Helper.requestDraw(hyperParameter);
  const images = await Helper.waitForDraw(generate.draw_request_id, delaySec);
  return images;
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime ||!mime.startsWith("image/")) {
      return conn.sendMessage(m.chat, {
        text: `*📌 الـطـريـقـة:* ارسـل صـورة مـع ${usedPrefix + command}\n\n*مـثـال:* ارسـل صـورة + ${usedPrefix + command}`,
        contextInfo: newsletter
      }, { quoted: m })
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, {
      text: `*⏳ جـاري مـعـالـجـة الـصـورة...*`,
      contextInfo: newsletter
    }, { quoted: m })

    const imgBuffer = await q.download();

    // Step 1: upload real image buffer to AIMirror system
    Helper.hash = Helper.sha1FromString(crypto.randomUUID());
    const appToken = await Helper.fetchAppToken();
    Helper.imageKey = appToken.key;
    appToken.file = imgBuffer;
    await Helper.uploadPhoto(appToken);

    const hyperParameter = {
      model_id: 271,
      cropped_height: 1024,
      cropped_width: 768,
      imagine_value2: 50,
      custom_prompt: "",
      force_default_pose: false,
      is_free_trial: true
    };

    // Step 2: generate new image
    const generate = await Helper.requestDraw(hyperParameter);
    const result = await Helper.waitForDraw(generate.draw_request_id, 7);

    if (!result || result.length === 0) {
      await m.react('❌')
      return conn.sendMessage(m.chat, {
        text: `*❌ فـشـل تـولـيـد الـصـورة*`,
        contextInfo: newsletter
      }, { quoted: m })
    }

    await conn.sendFile(m.chat, result[0], "aimirror.jpg", `*✅ تـمـت مـعـالـجـة الـصـورة بـنـجـاح*`, m, { contextInfo: newsletter });
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(m.chat, {
      text: `*❌ حـدث خـطـأ اثـنـاء الـمـعـالـجـة*\n*الـسـبـب:* ${e.message}`,
      contextInfo: newsletter
    }, { quoted: m })
  }
}

handler.help = ['aimirror']
handler.tags = ['ai']
handler.command = ['aimirror','نانو']
handler.limit = true
export default handler
