async function getInfo() {
  const nu = document.getElementById("phoneInput").value.trim();
  const resultCard = document.getElementById("resultCard");
  const resultSection = document.getElementById("resultSection");
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("noResults");

  if (!nu) return;

  loading.style.display = "block";
  resultSection.style.display = "none";
  noResults.style.display = "none";

  try {
    const res = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: nu })
    });

    const data = await res.json();
    loading.style.display = "none";

    // استخراج البيانات: لو مصفوفة ناخد أول عنصر، لو كائن ناخده هو
    const person = Array.isArray(data) ? data[0] : data;

    // التأكد من وجود اسم (بندور في كذا مفتاح احتياطي)
    const name = person.name || person.FullName || person.contact_name;

    if (!name) {
      noResults.style.display = "block";
      return;
    }

    // عرض النتيجة
    let initials = name.trim().charAt(0).toUpperCase();
    const parts = name.trim().split(" ");
    if (parts.length > 1) initials += parts[parts.length - 1].charAt(0).toUpperCase();

    resultCard.innerHTML = `
      <div class="result-header">
        <div class="result-avatar">${initials}</div>
        <div class="result-info">
          <h2>${name}</h2>
          <div class="result-phone">${person.number || nu}</div>
        </div>
      </div>
    `;

    resultSection.style.display = "block";

  } catch (err) {
    console.error("Front Error:", err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }
}
