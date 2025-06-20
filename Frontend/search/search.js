let currentIndex = 0;
const storiesPerPage = 80;
let allStories = [];
let filteredStories = [];
let covers = {};

// Gọi dữ liệu từ JSON
Promise.all([
  fetch('../data/novels.json').then(res => res.json()),
  fetch('../data/cover novels.json').then(res => res.json())
]).then(([novels, coverData]) => {
  coverData.forEach(item => {
    const key = Object.keys(item)[0];
    covers[key] = item[key];
  });

  allStories = novels;
  filteredStories = novels;
  renderStories();
}).catch(error => {
  console.error('Lỗi khi tải dữ liệu:', error);
});

function renderStories() {
  const container = document.getElementById('story-list');
  container.innerHTML = ''; // Xoá cũ
  const nextStories = filteredStories.slice(currentIndex, currentIndex + storiesPerPage);

  nextStories.forEach(story => {
    q++;
    const storyDiv = document.createElement('div');
    // storyDiv.className = 'story-card';

    const coverUrl = covers[story.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';

    storyDiv.innerHTML = `<div class='story-card' onclick='clickAnh(${q})'>
      <img src="${coverUrl}" alt="Cover" class='pic'>
      <h3>${story.name}</h3>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
      </div>
    `;

    container.appendChild(storyDiv);
  });

  currentIndex += storiesPerPage;
}

// Nút "Lọc"
document.getElementById('apply-filters').addEventListener('click', () => {
  const keyword = document.getElementById('search-box').value.toLowerCase();
  const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(cb => cb.value);

  filteredStories = allStories.filter(story => {
    const nameMatch = story.name.toLowerCase().includes(keyword);
    const genreMatch = selectedGenres.length === 0 || selectedGenres.some(genre =>
      (story.genres || []).includes(genre)
    );
    return nameMatch && genreMatch;
  });

  currentIndex = 0;
  renderStories();
});

// Nút "Tải thêm"
document.getElementById('load-more').addEventListener('click', renderStories);


//add event click
let banner= document.getElementById('banner'); let q=0
  function clickAnh(x) {
  let story_2 = filteredStories[x - 1];
  const coverUrl = covers[story_2.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';

  banner.innerHTML = `
    <div class="detail-container">
      <div class="detail-left">
        <img src="${coverUrl}" alt="Cover" class="detail-pic">
      </div>
      <div class="detail-right">
        <h2>${story_2.name}</h2>
        <p><strong>Genres:</strong> ${Array.isArray(story_2.genres) ? story_2.genres.join(', ') : story_2.genres}</p>
        <p><strong>Rating:</strong> ${story_2.rating}</p>
        <p class="description">${story_2.description || 'No description available.'}</p>
      </div>
    </div>
  `;

  console.log(filteredStories[x-1])
  }