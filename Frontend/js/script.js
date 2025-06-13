let currentIndex = 0;
const storiesPerPage = 8;
let allStories = [];
let covers = {};

// Gọi dữ liệu từ JSON
Promise.all([
  fetch('data/novels.json').then(res => res.json()),
  fetch('data/cover novels.json').then(res => res.json())
]).then(([novels, coverData]) => {
  // coverData là mảng object 1 key => convert thành object dễ tra cứu
  coverData.forEach(item => {
    const key = Object.keys(item)[0];
    covers[key] = item[key];
  });

  allStories = novels;
  renderStories();
}).catch(error => {
  console.error('Lỗi khi tải dữ liệu:', error);
});

function renderStories() {
  const container = document.getElementById('story-list');
  const nextStories = allStories.slice(currentIndex, currentIndex + storiesPerPage);

  nextStories.forEach(story => {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'story-card';

    const coverUrl = covers[story.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';

    storyDiv.innerHTML = `
      <img src="${coverUrl}" alt="Cover" style="width:100%; height:150px; object-fit:cover; border-radius:5px;">
      <h3>${story.name}</h3>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
    `;

    container.appendChild(storyDiv);
  });

  currentIndex += storiesPerPage;

  // if (currentIndex >= allStories.length) {
  //   document.getElementById('load-more').style.display = 'none';
  // }
  
}

document.getElementById('load-more').addEventListener('click', renderStories);

