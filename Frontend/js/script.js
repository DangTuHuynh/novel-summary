let currentIndex = 0;
const storiesPerPage = 8;
let allStories = [];

// Gọi dữ liệu từ JSON
fetch('data/novels.json')
  .then(res => res.json())
  .then(novels => {
    allStories = novels;
    renderStories();
  }).catch(error => {
    console.error('Lỗi khi tải dữ liệu:', error);
  });

function slugify(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderStories() {
  const container = document.getElementById('story-list');
  const nextStories = allStories.slice(currentIndex, currentIndex + storiesPerPage);

  nextStories.forEach(story => {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'story-card';

    const slug = slugify(story.name);
    let coverUrl = `assets/img/${slug}.jpg`;

    storyDiv.innerHTML = `
      <img src="${coverUrl}" alt="Cover" style="width:100%; height:150px; object-fit:cover; border-radius:5px;" 
           onerror="this.onerror=null;this.src='https://www.novelupdates.com/img/noimagefound.jpg';">
      <h3>${story.name}</h3>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
    `;

    container.appendChild(storyDiv);
  });

  currentIndex += storiesPerPage;
}

document.getElementById('load-more').addEventListener('click', renderStories);
