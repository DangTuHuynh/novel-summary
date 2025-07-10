let currentIndex = 0;
const storiesPerPage = 8;
let allStories = [];
let filteredStories = [];
let covers = {};

Promise.all([
  fetch('data/novels.json').then(res => res.json()),
  fetch('data/cover novels.json').then(res => res.json())
]).then(([novels, coverData]) => {
  coverData.forEach(item => {
    const key = Object.keys(item)[0];
    covers[key] = item[key]; 
  });


  const shuffled = [...novels].sort(() => Math.random() - 0.5);
  allStories = shuffled;
  filteredStories = shuffled;
  renderStories();
}).catch(error => {
  console.error('Lỗi khi tải dữ liệu:', error);
});

function normalizeText(text) {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.innerText.toLowerCase().replace(/\s+/g, ' ').trim();
}


function renderStories() {
  const container = document.getElementById('story-list');
  container.innerHTML = ''; 
  const nextStories = filteredStories.slice(currentIndex, currentIndex + storiesPerPage);

  q = 0;
  nextStories.forEach(story => {
    q++;
    const storyDiv = document.createElement('div');

    const coverUrl = covers[story.name]?.cover || 'https://www.novelupdates.com/img/noimagefound.jpg';

    storyDiv.innerHTML = `<div class='story-card' onclick='clickAnh(${q})'>
      <img src="${coverUrl}" alt="Cover" class='pic'>
      <h2 class="story-title">${story.name}</h2>
      <span class="see-more" onclick="toggleTitle(this, '${story.name.replace(/'/g, "\\'")}'); event.stopPropagation()">xem thêm</span>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
    </div>`;
    
    container.appendChild(storyDiv);
  });

  currentIndex += storiesPerPage;
}

document.getElementById('apply-filters').addEventListener('click', () => {
  const keyword = normalizeText(document.getElementById('search-box').value);
  const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(cb => cb.value);

  filteredStories = allStories.filter(story => {
    const nameMatch = normalizeText(story.name).includes(keyword);
    const genreMatch = selectedGenres.length === 0 || selectedGenres.some(genre =>
      (story.genres || []).includes(genre)
    );
    return nameMatch && genreMatch;
  });

  currentIndex = 0;
  renderStories();
});

document.getElementById('load-more').addEventListener('click', renderStories);


let banner= document.getElementById('banner'); let q=0
  function clickAnh(x) {
  const story = filteredStories[x - 1];
  const coverUrl = covers[story.name]?.cover || 'https://www.novelupdates.com/img/noimagefound.jpg';
  const description = covers[story.name]?.description || "Không có mô tả cho truyện này.";

  const detailView = document.getElementById('detail-view');
  const storyList = document.getElementById('story-list');
  const banner = document.getElementById('banner');

  detailView.innerHTML = `
    <img src="${coverUrl}" alt="Cover">
    <div class="detail-content">
      <h2>${story.name}</h2>
      <p><strong>Genres:</strong> ${Array.isArray(story.genres) ? story.genres.join(', ') : story.genres}</p>
      <p><strong>Rating:</strong> ${story.rating}</p>
      <p><strong>Description:</strong></p>
      <p>${description}</p>
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
  container.innerHTML = '';

  q = 0;
  filteredStories.forEach(story => {
    q++;
    const storyDiv = document.createElement('div');
    const coverUrl = covers[story.name] || 'https://www.novelupdates.com/img/noimagefound.jpg';

    storyDiv.innerHTML = `<div class='story-card' onclick='clickAnh(${q})'>
      <img src="${coverUrl}" alt="Cover" class='pic'>
      <h2 class="story-title">${story.name}</h2>
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


// gợi ý tìm kiếm 
const searchBox = document.getElementById('search-box');
const suggestionBox = document.getElementById('search-suggestions');

searchBox.addEventListener('input', () => {
  const rawInput = searchBox.value;

  const tempInputDiv = document.createElement('div');
  tempInputDiv.innerHTML = rawInput;
  const input = normalizeText(rawInput);

  if (!input) {
    suggestionBox.classList.add('hidden');
    suggestionBox.innerHTML = '';
    return;
  }

  // Tìm truyện khớp
  const matches = allStories
    .map(story => ({
      original: story.name,
      clean: normalizeText(story.name)
    }))
    .filter(entry => entry.clean.includes(input))
    .slice(0, 8);

  if (matches.length === 0) {
    suggestionBox.classList.add('hidden');
    suggestionBox.innerHTML = '';
    return;
  }

  // Gợi ý 
  suggestionBox.innerHTML = matches.map(entry => `<li>${entry.original}</li>`).join('');
  suggestionBox.classList.remove('hidden');
});

suggestionBox.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    searchBox.value = e.target.innerText;
    suggestionBox.classList.add('hidden');
    suggestionBox.innerHTML = '';
  }
});

// Ẩn gợi ý khi click ngoài
document.addEventListener('click', (e) => {
  if (!searchBox.contains(e.target) && !suggestionBox.contains(e.target)) {
    suggestionBox.classList.add('hidden');
    suggestionBox.innerHTML = '';
  }
});

//Login
function openAuthModal() {
  document.getElementById('auth-modal').style.display = 'flex';
  showLogin();
}

function closeAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
}

function showRegister() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('register-box').style.display = 'block';
}

function showLogin() {
  document.getElementById('login-box').style.display = 'block';
  document.getElementById('register-box').style.display = 'none';
}

function handleRegister() {
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;

  if (!username || !password) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  if (localStorage.getItem("user_" + username)) {
    alert('Tên đăng nhập đã tồn tại!');
    return;
  }

  localStorage.setItem("user_" + username, password);
  alert('Đăng ký thành công!');
  showLogin();
}

function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const storedPassword = localStorage.getItem("user_" + username);

  if (storedPassword === password) {
    alert('Đăng nhập thành công!');
    closeAuthModal();
    document.querySelector('.auth-button').innerHTML = `<span>Xin chào, ${username}</span>`;
  } else {
    alert('Sai tên đăng nhập hoặc mật khẩu!');
  }
}

document.getElementById('auth-modal').addEventListener('click', function(e) {
  if (e.target === this) closeAuthModal();
});
