export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { first_name, last_name, email, phone, dob } = req.body;
  
    if (!first_name || !last_name || !email || !phone || !dob) {
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
          birthDate: dob,  // MM/DD/YYYY
          email: email,
          phone: phone
        })
      });
  
      const data = await vouchedResponse.json();
      res.status(200).json(data);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
  