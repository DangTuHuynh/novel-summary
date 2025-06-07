fetch("novels.json")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("novel-list");

    data.slice(0, 50).forEach((novel) => {
      const card = document.createElement("div");
      card.className = "novel-card";
      let authors = JSON.parse(novel.authors.replace(/'/g, '"'));
      let genres = JSON.parse(novel.genres.replace(/'/g, '"'));

      card.innerHTML = `
        <h2>${novel.name}</h2>
        <p><strong>Tác giả:</strong> ${authors.join(", ")}</p>
        <p><strong>Ngôn ngữ gốc:</strong> ${novel.original_language}</p>
        <p><strong>Thể loại:</strong> ${genres.join(", ")}</p>
        <p><strong>Số chương:</strong> ${novel.chapters_original_current}</p>
      `;



      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Lỗi khi tải dữ liệu:", err);
  });
