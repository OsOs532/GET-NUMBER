async function getInfo() {
  const nu = document.getElementById("phoneInput").value.trim();
  const resultCard = document.getElementById("resultCard");
  const resultSection = document.getElementById("resultSection");
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("noResults");

  if (!nu) {
    resultSection.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  loading.style.display = "block";
  resultSection.style.display = "none";
  noResults.style.display = "none";

  try {
    const res = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: nu })
    });

    if (!res.ok) throw new Error("خطأ في الاتصال بالسيرفر");

    const person = await res.json();
    loading.style.display = "none";

    // التحقق من وجود اسم، وإلا نضع اسم افتراضي
    const displayName = person.name && person.name.trim() !== "" ? person.name : "اسم غير مسجل";
    
    // إعداد الأحرف الأولى بشكل آمن
    let initials = "??";
    if (displayName !== "اسم غير مسجل") {
      const words = displayName.trim().split(/\s+/);
      initials = words[0].charAt(0).toUpperCase();
      if (words.length > 1) initials += words[1].charAt(0).toUpperCase();
    }

    resultCard.innerHTML = `
      <div class="result-header">
        <div class="result-avatar">${initials}</div>
        <div class="result-info">
          <h2>${displayName}</h2>
          <div class="result-phone">${person.number || nu}</div>
        </div>
      </div>
    `;

    resultSection.style.display = "block";

  } catch (err) {
    console.error("Front-end Error:", err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }

  document.getElementById("phoneInput").value = "";
  document.getElementById("phoneInput").focus();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") getInfo();
  });
  document.getElementById("searchBtn").addEventListener("click", getInfo);
});
