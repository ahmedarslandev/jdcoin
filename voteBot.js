const puppeteer = require("puppeteer");

const emails = [
  {
    email: "your_email12345@gmail.com",
    password: "your_password",
  },
  {
    email: "your_email12357845@gmail.com",
    password: "your_password",
  },
];

async function registerEmails() {
  const url = "https://jdcoin.cc/#/reg";
  const browser = await puppeteer.launch({
    headless: true,
  });

  for (const { email, password } of emails) {
    const page = await browser.newPage();

    // Intercept requests to block images
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.resourceType() === "image") {
        req.abort(); // Block images to speed up loading
      } else {
        req.continue();
      }
    });

    // Navigate to the registration page
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for the input fields to be available
    await page.waitForSelector(".base-input");

    setTimeout(async () => {
      console.log("domcontentloaded")
      await page.type('input[placeholder="Email"]', email);
      console.log("email: " + email);
      // Fill in the password fields
      await page.type('input[placeholder="Login password"]', password);
      await page.type('input[placeholder="Confirm password"]', password);
      await page.type('input[placeholder="Security password"]', password);
      await page.type(
        'input[placeholder="Confirm security password"]',
        password
      );

      // Fill in the Invitation code
      await page.type('input[placeholder="Invitation code"]', "994674");

      await page.click(".base-main-btn-content");
      setTimeout(() => page.close(), 2000);
    }, 1000);
  }
}

async function run() {
  const batchSize = 5;

  for (let i = 0; i < emails.length; i += batchSize) {
    const emailBatch = emails.slice(i, i + batchSize);
    await registerEmails(emailBatch);
  }
}

run();