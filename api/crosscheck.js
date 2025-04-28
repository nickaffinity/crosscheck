const { first_name, last_name, email, phone, dob, gender, streetAddress, unit, city, state, postalCode, country } = req.body;

if (!first_name || !last_name || !email || !phone || !dob) {
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
      birthDate: dob,
      gender: gender,
      address: {
        street: streetAddress,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country
      }
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
