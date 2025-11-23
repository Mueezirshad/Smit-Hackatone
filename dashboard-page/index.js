// ----------------- ELEMENTS -----------------
const postsContainer = document.getElementById('postsContainer');
const postTemplate = document.getElementById('post-template');
const postModal = document.getElementById('postModal');
const openPostModalBtn = document.getElementById('openPostModalBtn');
const closeModalBtn = document.querySelector('.close-btn');
const newPostForm = document.getElementById('newPostForm');
const logoutBtn = document.getElementById('logoutBtn');
const userProfile = document.getElementById('userProfile');
const profileMenu = document.getElementById('profileMenu');
const userEmailSpan = document.getElementById('userEmail');
const postSort = document.getElementById("postSort");
const postSearch = document.getElementById("postSearch");

// ----------------- USER -----------------
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

(function(){
if (!loggedInUser) {
    window.location.href = './index.html'; // redirect if not logged in
} else {
    userEmailSpan.textContent = loggedInUser.email; // show email
}
})


// ----------------- LOCAL STORAGE -----------------
function loadPosts() {
    const storedPosts = localStorage.getItem('socialDashboardPosts');
    if (storedPosts) return JSON.parse(storedPosts);
    return [
        {
            id: Date.now() + 1,
            text: "Exploring the new dashboard design and its amazing features! Hope you like the modern, clean look.",
            imageUrl: 'https://via.placeholder.com/600x300/5d50ff/ffffff?text=Sample+Post+Image',
            date: new Date(),
            likes: 12
        }
    ];
}

function savePosts(posts) {
    localStorage.setItem('socialDashboardPosts', JSON.stringify(posts));
}

function loadUserLikes() {
    const likes = localStorage.getItem('userPostLikes');
    return likes ? JSON.parse(likes) : {};
}

function saveUserLikes(likes) {
    localStorage.setItem('userPostLikes', JSON.stringify(likes));
}

// ----------------- POSTS -----------------
let posts = loadPosts();
let userLikes = loadUserLikes();

function renderPost(post, prepend = true) {
    const clone = document.importNode(postTemplate.content, true);
    const postCard = clone.querySelector('.post-card');
    postCard.dataset.postId = post.id;

    clone.querySelector('.post-text-content').textContent = post.text;
    clone.querySelector('.post-date').textContent = new Date(post.date).toLocaleDateString();

    const postImage = clone.querySelector('.post-image');
    if (post.imageUrl) {
        postImage.src = post.imageUrl;
        postImage.style.display = 'block';
    } else postImage.remove();

    const likeButton = clone.querySelector('.like-button');
    const deleteButton = clone.querySelector('.delete-button');

    // Like setup
    const isLiked = userLikes[post.id];
    clone.querySelector('.like-label').textContent = isLiked ? 'Liked' : 'Like';
    if (isLiked) postCard.classList.add('liked');

    // Like handler
    likeButton.addEventListener('click', () => {
        if (postCard.classList.contains('liked')) {
            postCard.classList.remove('liked');
            delete userLikes[post.id];
            likeButton.querySelector('.like-label').textContent = 'Like';
        } else {
            postCard.classList.add('liked');
            userLikes[post.id] = true;
            likeButton.querySelector('.like-label').textContent = 'Liked';
        }
        saveUserLikes(userLikes);
    });

    // Delete handler
    deleteButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this post?")) {
            posts = posts.filter(p => p.id !== post.id);
            savePosts(posts);
            delete userLikes[post.id];
            saveUserLikes(userLikes);
            postCard.remove();
        }
    });

    if (prepend) postsContainer.prepend(clone);
    else postsContainer.appendChild(clone);
}

function renderAllPosts() {
    postsContainer.innerHTML = '';
    posts.forEach(renderPost);
}

// ----------------- MODAL -----------------
openPostModalBtn.addEventListener('click', () => {
    postModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    postModal.style.display = 'none';
    newPostForm.reset();
});

window.addEventListener('click', (event) => {
    if (event.target === postModal) {
        postModal.style.display = 'none';
        newPostForm.reset();
    }
});

// ----------------- NEW POST -----------------
newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("postText").value.trim();
    const file = document.getElementById("postImage").files[0];

    if (!text && !file) {
        alert("Please write something or upload an image!");
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = () => addNewPost(text, reader.result);
        reader.readAsDataURL(file);
    } else addNewPost(text, "");
});

function addNewPost(text, imageUrl) {
    const newPost = {
        id: Date.now(),
        text,
        imageUrl,
        date: new Date(),
        likes: 0
    };
    posts.push(newPost);
    savePosts(posts);
    renderPost(newPost);
    newPostForm.reset();
    postModal.style.display = "none";
}

// ----------------- SEARCH & SORT -----------------
postSearch.addEventListener("input", () => {
    const filtered = posts.filter(p => p.text.toLowerCase().includes(postSearch.value.toLowerCase()));
    postsContainer.innerHTML = '';
    filtered.forEach(post => renderPost(post, false));
});

postSort.addEventListener("change", () => {
    let sorted = [...posts];
    if (postSort.value === "newest") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (postSort.value === "oldest") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    postsContainer.innerHTML = '';
    sorted.forEach(post => renderPost(post, false));
});

// ----------------- PROFILE & LOGOUT -----------------
userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', () => {
    profileMenu.style.display = 'none';
});

logoutBtn.addEventListener('click', () => {
    debugger
    localStorage.removeItem('loggedInUser');
    window.location.href = './index.html';
});

// ----------------- INITIAL RENDER -----------------
document.addEventListener('DOMContentLoaded', renderAllPosts);
// 5
document.addEventListener('DOMContentLoaded', () => {
    const userProfile = document.getElementById('userProfile');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmailSpan = document.getElementById('userEmail');

    // Show logged-in user's email
    (function(){
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!loggedInUser) {
        window.location.replace = ('index.html');
    
    }
    })
    userEmailSpan.textContent = loggedInUser.email;

    // Toggle dropdown menu
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close menu if clicked outside
    window.addEventListener('click', () => {
        profileMenu.style.display = 'none';
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.replace = ('index.html');
    });
});
