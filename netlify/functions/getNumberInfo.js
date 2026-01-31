export async function handler(event, context) {
  try {
    let number;
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || "{}");
      number = body.number;
    } else {
      number = event.queryStringParameters ? event.queryStringParameters.number : null;
    }

    if (!number) {
      return { statusCode: 400, body: JSON.stringify({ error: "الرقم مطلوب" }) };
    }

    // المسار الجديد بناءً على الكود اللي بعته (XX بدل HH)
    const apiUrl = `https://ebnelnegm.com/XX/index.php?num=${encodeURIComponent(number)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://ebnelnegm.com/'
      }
    });

    if (!response.ok) throw new Error("الموقع الأصلي لا يستجيب");

    const data = await response.json();

    // نرسل البيانات كما هي للفرونت إند ليتعامل معها
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error("Backend Error:", err.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "فشل جلب البيانات", details: err.message }) 
    };
  }
}
