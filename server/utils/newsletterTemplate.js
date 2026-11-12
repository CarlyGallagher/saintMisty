const sanitizeHtml = require("sanitize-html");

// Saint Misty newsletter email. Used both for sending and for the admin preview,
// so what the admin sees is exactly what subscribers get.

const MAX_IMAGES = 3;
// The gigaglitters "SAINT MISTY NEWS" GIF, cropped to remove their watermark and hosted on Cloudinary
const HEADER_GIF =
  "https://res.cloudinary.com/dx12gjjum/image/upload/v1794514069/saintmisty/newsletter/saint-misty-news-header.gif";
const CONTENT_WIDTH = 528; // 600px card minus 36px padding on each side
const IMAGE_GAP = 8;

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const BLOCK_TAG = /^<\/?(p|h1|h2|h3|ul|ol|li|blockquote|hr)[\s>/]/i;
const LINK_STYLE = "color:#FF2E93;font-weight:bold;text-decoration:underline;";

// Turn bare web addresses into links. Existing links and tags are left alone.
const linkify = (line) =>
  line
    .split(/(<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>)/i)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(
            /(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,!?;:'"])/g,
            (_m, before, url) => `${before}<a href="${url}" target="_blank" style="${LINK_STYLE}">${url}</a>`
          )
    )
    .join("");

// The message is typed in a plain textarea. Blank lines start a new paragraph and
// single line breaks stay as line breaks. Basic HTML tags are allowed for formatting.
function formatMessage(message) {
  const clean = sanitizeHtml(String(message || "").replace(/\r\n/g, "\n"), {
    allowedTags: ["b", "strong", "i", "em", "u", "a", "br", "p", "h1", "h2", "h3", "ul", "ol", "li", "blockquote", "hr"],
    allowedAttributes: { a: ["href", "target", "style"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", style: LINK_STYLE }),
    },
  });

  const out = [];
  let paragraph = [];
  const flush = () => {
    if (paragraph.length) out.push(`<p style="margin:0 0 1.1em 0;">${paragraph.join("<br>")}</p>`);
    paragraph = [];
  };

  for (const raw of clean.split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (BLOCK_TAG.test(line)) {
      flush();
      out.push(line);
    } else paragraph.push(linkify(line));
  }
  flush();
  return out.join("\n");
}

const IMAGE_STYLE = "display:block;width:100%;height:auto;border:3px solid #2B0A22;border-radius:14px;";

// One photo is centered. Two or three sit side by side in a row.
function renderImages(images) {
  const list = (images || []).slice(0, MAX_IMAGES);
  if (list.length === 0) return "";

  if (list.length === 1) {
    return `
        <tr>
          <td class="pad" align="center" style="padding:0 36px 20px 36px;">
            <img src="${escapeAttr(list[0])}" width="${CONTENT_WIDTH}" alt="" style="${IMAGE_STYLE}max-width:${CONTENT_WIDTH}px;margin:0 auto;">
          </td>
        </tr>`;
  }

  // Every cell gets the same side padding so all photos come out the same size
  const half = IMAGE_GAP / 2;
  const cellWidth = Math.floor((CONTENT_WIDTH + IMAGE_GAP) / list.length - IMAGE_GAP);
  const cells = list
    .map(
      (src) => `<td width="${(100 / list.length).toFixed(2)}%" valign="top" style="padding:0 ${half}px;">
                  <img src="${escapeAttr(src)}" width="${cellWidth}" alt="" style="${IMAGE_STYLE}max-width:${cellWidth}px;">
                </td>`
    )
    .join("\n                ");

  return `
        <tr>
          <td class="pad-row" align="center" style="padding:0 ${36 - half}px 20px ${36 - half}px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;table-layout:fixed;">
              <tr>
                ${cells}
              </tr>
            </table>
          </td>
        </tr>`;
}

function renderNewsletter({ message, images, preferencesUrl, unsubscribeUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>Saint Misty</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background: #FF8FCB; -webkit-text-size-adjust: 100%; }
  table { border-collapse: separate; }
  img { border: 0; outline: none; text-decoration: none; }

  .message-content {
    font-family: 'Trebuchet MS', Verdana, sans-serif;
    font-size: 16px; line-height: 1.65; color: #2B0A22;
  }
  .message-content p { margin: 0 0 1.1em 0; }
  .message-content h1 {
    font-family: 'Rubik Mono One', 'Arial Black', Impact, sans-serif;
    font-size: 26px; line-height: 1.2; color: #FF2E93; margin: 0 0 0.6em 0;
  }
  .message-content h2 {
    font-family: 'Rubik Mono One', 'Arial Black', Impact, sans-serif;
    font-size: 19px; line-height: 1.25; color: #2B0A22; margin: 1.4em 0 0.5em 0;
  }
  .message-content h3 { font-size: 17px; margin: 1.2em 0 0.4em 0; color: #FF2E93; }
  .message-content a { color: #FF2E93; font-weight: bold; text-decoration: underline; }
  .message-content blockquote {
    margin: 0 0 1.1em 0; padding: 12px 16px;
    background: #FFE3F2; border-left: 6px solid #FF2E93; border-radius: 0 12px 12px 0;
  }
  .message-content ul, .message-content ol { margin: 0 0 1.1em 0; padding-left: 22px; }
  .message-content li { margin-bottom: 0.4em; }
  .message-content hr { border: 0; border-top: 3px dashed #FF8FCB; margin: 1.6em 0; }

  @media only screen and (max-width: 620px) {
    .outer { padding: 12px !important; }
    .pad { padding-left: 20px !important; padding-right: 20px !important; }
    .pad-row { padding-left: 16px !important; padding-right: 16px !important; }
    .message-content h1 { font-size: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#FF8FCB;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FF8FCB;">
  <tr>
    <td align="center" class="outer" style="padding:28px 16px;">

      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;background:#FFFFFF;border:3px solid #2B0A22;border-radius:20px;box-shadow:7px 7px 0 #2B0A22;">

        <!-- Pink header bar with glitter title GIF -->
        <tr>
          <td align="center" valign="middle" bgcolor="#FF2E93" style="padding:22px 16px;background:#FF2E93;border-bottom:3px solid #2B0A22;border-radius:17px 17px 0 0;">
            <img src="${HEADER_GIF}" width="511" height="60" alt="Saint Misty News" style="display:block;margin:0 auto;max-width:100%;height:auto;">
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td class="pad" style="padding:32px 36px 12px 36px;">
            <div class="message-content" style="font-family:'Trebuchet MS',Verdana,sans-serif;font-size:16px;line-height:1.65;color:#2B0A22;">
              ${formatMessage(message)}
            </div>
          </td>
        </tr>
${renderImages(images)}
        <!-- Sign-off -->
        <tr>
          <td class="pad" style="padding:8px 36px 32px 36px;">
            <p style="font-family:'Trebuchet MS',Verdana,sans-serif;font-size:16px;color:#2B0A22;margin:0;">
              xo,<br>
              <strong style="color:#FF2E93;">Saint Misty</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" class="pad" style="background:#2B0A22;padding:24px 32px;border-top:3px solid #2B0A22;border-radius:0 0 17px 17px;">
            <p style="font-family:'Trebuchet MS',Verdana,sans-serif;font-size:13px;line-height:1.6;color:#FFC2E3;margin:0;">
              You're getting this because you signed up for Saint Misty updates.<br>
              Please don't reply. This inbox isn't checked.<br>
              <a href="${escapeAttr(preferencesUrl || "#")}" target="_blank" style="color:#FFFFFF;text-decoration:underline;">Update your preferences</a>
              &nbsp;&#9733;&nbsp;
              <a href="${escapeAttr(unsubscribeUrl || "#")}" target="_blank" style="color:#FFFFFF;text-decoration:underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->

    </td>
  </tr>
</table>

</body>
</html>`;
}

module.exports = { renderNewsletter, MAX_IMAGES };
