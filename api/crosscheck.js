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

  const { first_name, last_name, email, phone, dob, gender, streetAddress, city, state, postalCode, country } = req.body;

  if (!first_name || !last_name || !email || !phone || !dob) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Convert dob to YYYY-MM-DD if needed
  let birthDate = dob;
  if (dob.includes("/")) {
    const [month, day, year] = dob.split("/");
    birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Only send address if all parts are present
  let address;
  if (streetAddress && city && state && postalCode && country) {
    address = {
      streetAddress,
      city,
      state,
      postalCode,
      country
    };
  }

  const payload = {
    firstName: first_name,
    lastName: last_name,
    email,
    phone,
    birthDate
  };

  if (gender) payload.gender = gender;
  if (address) payload.address = address;

  try {
    const vouchedResponse = await fetch('https://verify.vouched.id/api/identity/crosscheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.VOUCHED_PRIVATE_API_KEY
      },
      body: JSON.stringify(payload)
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
