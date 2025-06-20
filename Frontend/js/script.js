let currentIndex = 0;
const storiesPerPage = 8;
let allStories = [];
let filteredStories = [];
let covers = {};

// Gọi dữ liệu từ JSON
Promise.all([
  fetch('data/novels.json').then(res => res.json()),
  fetch('data/cover novels.json').then(res => res.json())
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

    // code cũ
    // storyDiv.innerHTML = `<div class='story-card' onclick='clickAnh(${q})'>
    //   <img src="${coverUrl}" alt="Cover" class='pic'>
    //   <h3>${story.name}</h3>
    //   <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
    //   <p><strong>Rating:</strong> ${story.rating}</p>
    //   </div>
    // `;

    // code mới
    storyDiv.innerHTML = `<div class='story-card' onclick='clickAnh(${q})'>
      <img src="${coverUrl}" alt="Cover" class='pic'>
      <h3 class="story-title">${story.name}</h3>
      <span class="see-more" onclick="toggleTitle(this, '${story.name.replace(/'/g, "\\'")}'); event.stopPropagation()">xem thêm</span>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
    </div>`;
    

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
  // code cũ
  // function clickAnh(x){
  //   let story_2=filteredStories[x-1]
  //   const coverUrl = covers[story_2.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';
  //   banner.innerHTML=`
  //     <img src="${coverUrl}" alt="Cover" class='pic'>
  //     <h3>${story_2.name}</h3>
  //     <p><strong>Genres:</strong> ${Array.isArray(story_2.genres) ? story_2.genres.join(', ') : story_2.genres}</p>
  //     <p><strong>Rating:</strong> ${story_2.rating}</p>
  // `
  // console.log(filteredStories[x-1])
  // }

  // code mới
  function clickAnh(x) {
  const story = filteredStories[x - 1];
  const coverUrl = covers[story.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';

  const detailView = document.getElementById('detail-view');
  const storyList = document.getElementById('story-list');
  const banner = document.getElementById('banner');

  detailView.innerHTML = `
    <img src="${coverUrl}" alt="Cover">
    <div>
      <h3>${story.name}</h3>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
      <p>${story.description || "Không có mô tả cho truyện này."}</p>
      <div class="back-button-container">
        <button id="back-button">back</button>
      </div>
    </div>
  `;

  detailView.classList.remove('hidden');
  storyList.style.display = 'none';
  banner.style.display = 'none';

  document.getElementById('back-button').addEventListener('click', () => {
    detailView.classList.add('hidden');
    storyList.style.display = 'grid';
    banner.style.display = 'block';
  });

  window.scrollTo({ top: detailView.offsetTop - 20, behavior: 'smooth' });
}


// random novel
document.getElementById('random-novel').addEventListener('click', (e) => {
  e.preventDefault();
  if (allStories.length === 0) return;
  
  const shuffled = [...allStories].sort(() => Math.random() - 0.5);
  filteredStories = shuffled.slice(0, storiesPerPage);

  currentIndex = 0;
  renderStories();
});



// Hàm Phụ cho "list"
function renderAllStories() {
  const container = document.getElementById('story-list');
  container.innerHTML = ''; // xoá cũ

  filteredStories.forEach(story => {
    q++;
    const storyDiv = document.createElement('div');
    const coverUrl = covers[story.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';

    storyDiv.innerHTML = `<div class='story-card' onclick='clickAnh(${q})'>
      <img src="${coverUrl}" alt="Cover" class='pic'>
      <h3 class="story-title">${story.name}</h3>
      <span class="see-more" onclick="toggleTitle(this, '${story.name.replace(/'/g, "\\'")}'); event.stopPropagation()">xem thêm</span>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
    </div>`;

    container.appendChild(storyDiv);
  });
}

// list 
document.getElementById('full-list').addEventListener('click', (e) => {
  e.preventDefault();
  filteredStories = allStories;
  q = 0;
  renderAllStories();
});



// filter novel
document.querySelectorAll('.genre-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn trang reload
    const selectedGenre = link.dataset.genre.toLowerCase();

    filteredStories = allStories.filter(story =>
      Array.isArray(story.genres) && story.genres.map(g => g.toLowerCase()).includes(selectedGenre)
    );

    currentIndex = 0;
    renderStories();
  });
});


// xem thêm của tên truyện
function toggleTitle(span, fullTitle) {
  const titleElem = span.previousElementSibling;

  titleElem.classList.toggle('expanded');

  if (titleElem.classList.contains('expanded')) {
    span.innerText = 'thu gọn';
  } else {
    span.innerText = 'xem thêm';
  }
}

