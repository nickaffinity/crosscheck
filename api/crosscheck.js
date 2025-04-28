export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-API-Key');
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { first_name, last_name, email, phone, dob } = req.body;

  if (!first_name || !last_name || !email || !phone) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const vouchedResponse = await fetch('https://verify.vouched.id/api/identity/crosscheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.VOUCHED_PRIVATE_API_KEY
      },
      body: JSON.stringify({
        firstName: first_name,
        lastName: last_name,
        email: email,
        phone: phone,
        streetAddress: streetAddress,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country,
      })
    });

    const data = await vouchedResponse.json();

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!vouchedResponse.ok) {
      console.error('Vouched Response Error:', vouchedResponse.status, data);
      return res.status(vouchedResponse.status).json({ message: 'Vouched API error', vouchedStatus: vouchedResponse.status, vouchedError: data });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Server fetch error:', error.message || error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ message: "Server fetch error", error: error.message || error });
  }
}
