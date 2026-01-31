export async function handler(event, context) {
  try {
    let number;
    if (event.httpMethod === 'POST') {
      try {
        const body = JSON.parse(event.body);
        number = body.number;
      } catch (e) {
        const params = new URLSearchParams(event.body);
        number = params.get('number');
      }
    }

    if (!number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "رقم الهاتف مطلوب" })
      };
    }

    const apiUrl = `https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(number)}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://ebnelnegm.com/'
        }
      });

      if (!response.ok) throw new Error(`External API status: ${response.status}`);
      
      const data = await response.json();
      
      // تحليل البيانات: هل هي مصفوفة أم كائن؟
      // لو API رجع مصفوفة ناخد أول عنصر، لو كائن ناخده هو علطول
      let finalPerson = Array.isArray(data) ? data[0] : data;

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPerson || {})
      };

    } catch (apiError) {
      console.error('API External Error:', apiError.message);

      // الرد ببيانات احتياطية في حال تعطل الـ API الخارجي
      const cleanNumber = number.replace(/\D/g, '');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: number,
          name: "", // نترك الاسم فارغ ليتعامل معه الفرونت إند
          message: "Backup mode active"
        })
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message })
    };
  }
}
