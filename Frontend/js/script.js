let currentIndex = 0;
const storiesPerPage = 8;
let allStories = [];

// Gọi dữ liệu từ JSON
fetch('data/novels.json')
  .then(response => response.json())
  .then(data => {
    allStories = data;
    renderStories();
  })
  .catch(error => {
    console.error('Lỗi khi tải dữ liệu:', error);
  });

// Hàm render truyện
function renderStories() {
  const container = document.getElementById('story-list');
  const nextStories = allStories.slice(currentIndex, currentIndex + storiesPerPage);

  nextStories.forEach(story => {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'story-card';

    storyDiv.innerHTML = `
      <h3>${story.name}</h3>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
    `;

    container.appendChild(storyDiv);
  });

  currentIndex += storiesPerPage;

  // Ẩn nút nếu đã hiển thị hết
  if (currentIndex >= allStories.length) {
    document.getElementById('load-more').style.display = 'none';
  }
}

// Bắt sự kiện click vào nút
document.getElementById('load-more').addEventListener('click', renderStories);
