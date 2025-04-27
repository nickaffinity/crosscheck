export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { first_name, last_name, email, phone, dob } = req.body;

  if (!first_name || !last_name || !email || !phone || !dob) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const vouchedResponse = await fetch('https://api.vouched.id/v1/crosscheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'pk90yaiJMEwyvDc9-K#w!IXHJ.-2Vs'  // <- Your hardcoded key
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

    res.setHeader('Access-Control-Allow-Origin', '*');

    // ✅ If Vouched itself returned error, pass it back
    if (!vouchedResponse.ok) {
      console.error('Vouched API Error:', data);
      return res.status(400).json(data); // Send back real Vouched error
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error.message || error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ message: "Server Error", error: error.message || error });
  }
}
