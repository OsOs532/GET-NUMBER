export async function handler(event, context) {
  try {
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      body = new URLSearchParams(event.body);
    }

    const number = body.number;

    if (!number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "رقم الهاتف مفقود" }),
      };
    }

    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "حدث خطأ غير متوقع", details: err.message }),
    };
  }
}
