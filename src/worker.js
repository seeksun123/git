const INQUIRY_FIELDS = [
  "name",
  "email",
  "phone",
  "country",
  "product",
  "material",
  "width",
  "speed",
  "voltage",
  "message"
];

async function readInquiryForm(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    return request.formData();
  }

  const text = await request.text();
  const params = new URLSearchParams(text);
  const form = new FormData();

  for (const [key, value] of params.entries()) {
    form.append(key, value);
  }

  return form;
}

function textResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8"
    }
  });
}

async function handleInquiry(request, env) {
  const form = await readInquiryForm(request);

  if (form.get("website")) {
    return textResponse("OK", 200);
  }

  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();

  if (!email.includes("@") || message.length < 20) {
    return textResponse("Invalid inquiry", 400);
  }

  if (!env.RESEND_API_KEY) {
    return textResponse("Email provider is not configured. Use the mailto fallback on the static form.", 503);
  }

  const lines = INQUIRY_FIELDS.map((field) => `${field}: ${form.get(field) || ""}`);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.INQUIRY_FROM || "HY Machinery <info@plasticsmachinevn.com>",
      to: [env.INQUIRY_TO || "info@plasticsmachinevn.com"],
      reply_to: email,
      subject: `HY Machinery inquiry - ${form.get("product") || "Website"}`,
      text: lines.join("\n")
    })
  });

  if (!response.ok) {
    return textResponse("Email delivery failed", 502);
  }

  return textResponse("Inquiry sent", 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/submit-inquiry") {
      return handleInquiry(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
