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
  
    const { first_name, last_name, email, phone, dob, ssn } = req.body;
  
    if (!first_name || !last_name || !phone || !ssn) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({ message: "Missing required fields (first_name, last_name, phone, ssn)" });
    }
  
    try {
      const ssnResponse = await fetch(
          'https://verify.vouched.id/api/private-ssn/verify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-API-Key': process.env.VOUCHED_PRIVATE_API_KEY
            },
            body: JSON.stringify({
              firstName: first_name,
              lastName: last_name,
              phone: phone.startsWith('+') ? phone : `+1${phone}`,
              ssn,
              email: email || undefined,
              dob: dob || undefined
            })
          }
        );
  
      const data = await ssnResponse.json();
      console.log(ssn);
  
      res.setHeader('Access-Control-Allow-Origin', '*');
  
      if (!ssnResponse.ok) {
        console.error('Vouched SSN Response Error:', ssnResponse.status, data);
        return res.status(ssnResponse.status).json({ message: 'Vouched SSN API error', vouchedStatus: ssnResponse.status, vouchedError: data });
      }
  
      res.status(200).json(data);
  
    } catch (error) {
      console.error('Server fetch error during SSN check:', error.message || error);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(500).json({ message: "Server fetch error", error: error.message || error });
    }
  }
  
