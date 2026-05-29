const BASE = process.env.BASE_URL || "http://localhost:3003";

const results = [];
let passed = 0;
let failed = 0;

function pass(name, detail = "") {
  passed++;
  results.push({ status: "PASS", name, detail });
}

function fail(name, detail = "") {
  failed++;
  results.push({ status: "FAIL", name, detail });
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, text, json };
}

async function run() {
  console.log(`\nE2E Test Suite — ${BASE}\n${"=".repeat(50)}\n`);

  // 1. Homepage
  const home = await get("/");
  if (home.status === 200) pass("Homepage loads", `HTTP ${home.status}`);
  else fail("Homepage loads", `HTTP ${home.status}`);

  const html = home.text;

  // 2. Sections
  for (const id of ["home", "about", "experience", "projects", "contact"]) {
    if (html.includes(`id="${id}"`)) pass(`Section #${id} present`);
    else fail(`Section #${id} present`);
  }

  // 3. Navigation links
  for (const href of ["#home", "#about", "#experience", "#projects", "#contact"]) {
    if (html.includes(`href="${href}"`)) pass(`Nav link ${href}`);
    else fail(`Nav link ${href}`);
  }

  // 4. Hero content
  if (html.includes("Nazrawi Solomon Abera")) pass("Hero name displayed");
  else fail("Hero name displayed");
  if (html.includes("View My Work")) pass("Hero CTA: View My Work");
  else fail("Hero CTA: View My Work");
  if (html.includes('href="/resume.pdf"') && html.includes("Download Resume"))
    pass("Hero CTA: Download Resume wired");
  else fail("Hero CTA: Download Resume wired");

  // 5. Hero social links
  if (html.includes("https://github.com/naz12")) pass("Hero GitHub link");
  else fail("Hero GitHub link");
  if (html.includes("https://www.linkedin.com/in/nazrawi-solomon/")) pass("Hero LinkedIn link");
  else fail("Hero LinkedIn link");
  if (html.includes("mailto:snazrawi@gmail.com")) pass("Hero email link");
  else fail("Hero email link");

  // 6. About section
  if (html.includes("Adama Science and Technology University")) pass("About: education");
  else fail("About: education");
  if (html.includes("View Experience")) pass("About: View Experience button");
  else fail("About: View Experience button");
  if (html.includes("Technical Skills")) pass("About: skills section");
  else fail("About: skills section");

  // 7. Experience section
  if (html.includes("Work Experience") || html.includes("Work <span")) pass("Experience section heading");
  else fail("Experience section heading");
  if (html.includes("Frontend Developer Intern")) pass("Experience: job 1");
  else fail("Experience: job 1");
  if (html.includes("Freelance Web Developer")) pass("Experience: job 2");
  else fail("Experience: job 2");

  // 8. Projects
  for (const title of ["Akili", "Zoys", "Streaming Service Platform", "PrimeAndroid"]) {
    if (html.includes(title)) pass(`Project: ${title}`);
    else fail(`Project: ${title}`);
  }
  const viewProjectCount = (html.match(/View Project/g) || []).length;
  if (viewProjectCount >= 4) pass("Projects: View Project buttons", `${viewProjectCount} found`);
  else fail("Projects: View Project buttons", `${viewProjectCount} found, expected 4`);
  if (html.includes("View All Projects")) pass("Projects: View All Projects button");
  else fail("Projects: View All Projects button");

  // 9. Contact section
  if (html.includes("Get In")) pass("Contact section heading");
  else fail("Contact section heading");
  if (html.includes('name="name"') && html.includes('name="email"') && html.includes('name="message"'))
    pass("Contact form fields present");
  else fail("Contact form fields present");
  if (html.includes("Send Message")) pass("Contact form submit button");
  else fail("Contact form submit button");
  if (html.includes("+251911852563")) pass("Contact: phone displayed");
  else fail("Contact: phone displayed");

  // 10. Footer
  if (html.includes("2026 Nazrawi Solomon Abera")) pass("Footer copyright 2026");
  else fail("Footer copyright 2026");

  // 11. Accessibility
  if (html.includes("Skip to content")) pass("Skip to content link");
  else fail("Skip to content link");
  if (html.includes('aria-label="GitHub profile"')) pass("Aria-labels on social links");
  else fail("Aria-labels on social links");

  // 12. SEO
  for (const tag of ["og:title", "og:description", "og:image", "og:url", "twitter:card", "canonical"]) {
    if (html.includes(tag)) pass(`SEO: ${tag}`);
    else fail(`SEO: ${tag}`);
  }

  // 13. Static assets
  for (const asset of ["/resume.pdf", "/og-image.png", "/icon.svg"]) {
    const res = await get(asset);
    if (res.status === 200) pass(`Asset ${asset}`, `HTTP ${res.status}`);
    else fail(`Asset ${asset}`, `HTTP ${res.status}`);
  }

  // 14. robots.txt & sitemap
  const robots = await get("/robots.txt");
  if (robots.status === 200 && robots.text.includes("Sitemap")) pass("robots.txt");
  else fail("robots.txt", `HTTP ${robots.status}`);

  const sitemap = await get("/sitemap.xml");
  if (sitemap.status === 200 && sitemap.text.includes("<urlset")) pass("sitemap.xml");
  else fail("sitemap.xml", `HTTP ${sitemap.status}`);

  // 15. 404 page
  const notFound = await get("/nonexistent-page-xyz");
  if (notFound.status === 404 && notFound.text.includes("404")) pass("404 page");
  else fail("404 page", `HTTP ${notFound.status}`);

  // 16. Contact API — validation
  const emptyForm = await post("/api/contact", {});
  if (emptyForm.status === 400) pass("Contact API: rejects empty body", emptyForm.json?.error);
  else fail("Contact API: rejects empty body", `HTTP ${emptyForm.status}`);

  const badEmail = await post("/api/contact", {
    name: "Test",
    email: "not-an-email",
    subject: "Hi",
    message: "This is a long enough message.",
  });
  if (badEmail.status === 400) pass("Contact API: rejects invalid email");
  else fail("Contact API: rejects invalid email", `HTTP ${badEmail.status}`);

  const shortMsg = await post("/api/contact", {
    name: "Test",
    email: "test@example.com",
    subject: "Hi",
    message: "short",
  });
  if (shortMsg.status === 400) pass("Contact API: rejects short message");
  else fail("Contact API: rejects short message", `HTTP ${shortMsg.status}`);

  // 17. Contact API — valid payload (503 without env vars is expected)
  const validForm = await post("/api/contact", {
    name: "E2E Test User",
    email: "e2e@example.com",
    subject: "E2E Test",
    message: "This is a valid test message from the E2E suite.",
  });
  if (validForm.status === 503 && validForm.json?.error?.includes("not configured"))
    pass("Contact API: valid payload handled (503 without env)", validForm.json.error);
  else if (validForm.status === 200)
    pass("Contact API: valid payload sent successfully");
  else
    fail("Contact API: valid payload", `HTTP ${validForm.status} — ${validForm.text}`);

  // Summary
  console.log("Results:\n");
  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : "✗";
    console.log(`  ${icon} ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  }
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`${"=".repeat(50)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Test suite crashed:", err);
  process.exit(1);
});
