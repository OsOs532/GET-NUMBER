import fetch from "node-fetch";

export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const number = body.number;

  try {
    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
}
