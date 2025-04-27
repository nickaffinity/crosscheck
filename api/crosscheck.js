export default async function handler(req, res) {
  // ✅ Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // <-- IMPORTANT
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { first_name, last_name, email, phone, dob } = req.body;

  if (!first_name || !last_name || !email || !phone || !dob) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.affinitywholehealth.com');
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const vouchedResponse = await fetch('https://api.vouched.id/v1/crosscheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.VOUCHED_PRIVATE_API_KEY
      },
      body: JSON.stringify({
        firstName: first_name,
        lastName: last_name,
        birthDate: dob,
        email: email,
        phone: phone
      })
    });

    const data = await vouchedResponse.json();
    res.setHeader('Access-Control-Allow-Origin', 'https://www.affinitywholehealth.com'); // <-- VERY important
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.setHeader('Access-Control-Allow-Origin', 'https://www.affinitywholehealth.com');
    res.status(500).json({ message: "Server Error" });
  }
}
