export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Tratar preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/payment_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error proxying to InfinitePay payment_check:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
