export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  if (form.get("website")) {
    return new Response("OK", { status: 200 });
  }

  const fields = [
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

  const lines = fields.map((field) => `${field}: ${form.get(field) || ""}`);
  const message = String(form.get("message") || "");

  if (!String(form.get("email") || "").includes("@") || message.length < 20) {
    return new Response("Invalid inquiry", { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return new Response("Email provider is not configured. Use the mailto fallback on the static form.", { status: 503 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.INQUIRY_FROM || "HY Machinery <info@plasticsmachinevn.com>",
      to: [env.INQUIRY_TO || "info@plasticsmachinevn.com"],
      reply_to: String(form.get("email")),
      subject: `HY Machinery inquiry - ${form.get("product") || "Website"}`,
      text: lines.join("\n")
    })
  });

  if (!response.ok) {
    return new Response("Email delivery failed", { status: 502 });
  }

  return new Response("Inquiry sent", { status: 200 });
}
