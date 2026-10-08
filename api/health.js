// Tells the page it is hosted and which services have keys. Never returns key values.
export default function handler(req, res) {
  res.json({
    hosted: true,
    claude: !!process.env.OPENROUTER_API_KEY,
    jev: !!(process.env.TYPESAFE_API_KEY || process.env.OPENROUTER_API_KEY),
    telegram: !!process.env.TELEGRAM_BOT_TOKEN,
    passcode: !!process.env.DEMO_PASSCODE,
  });
}
