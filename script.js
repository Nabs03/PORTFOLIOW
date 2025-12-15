document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    const updateButtonIcon = () => {
        const icon = darkModeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(`${currentTheme}-mode`);
    updateButtonIcon();

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');

        let theme = 'light';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
        updateButtonIcon();
    });

    // --- Tab Navigation ---
    const navTabs = document.querySelectorAll('.nav-tab');
    const gridSections = document.querySelectorAll('.posts-grid');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabText = tab.querySelector('span').textContent.toLowerCase();
            let targetId = `${tabText}-grid`;
            // Handle the renamed 'posts' section ID
            if (tabText === 'posts') {
                targetId = 'posts-grid-main';
            }

            gridSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // --- Modal Functionality ---
    const modal = document.getElementById('image-modal');
    const modalMedia = document.getElementById('modal-media');
    const modalCaption = document.getElementById('modal-caption');
    const modalDate = document.getElementById('modal-date');
    const modalLikes = document.getElementById('modal-likes');
    const closeModalBtn = document.querySelector('.close-modal');
    const gridPosts = document.querySelectorAll('.grid-post');

    const openModal = () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Stop video/audio if playing
        const mediaElement = modalMedia.querySelector('video, audio');
        if (mediaElement) {
            mediaElement.pause();
        }
    };

    gridPosts.forEach(post => {
        post.addEventListener('click', () => {
            const { video, image, note, caption, date } = post.dataset;
            const likes = post.querySelector('.overlay-stats span:first-child').textContent.trim();

            modalMedia.innerHTML = ''; // Clear previous media

            if (note === 'true') {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note-display';
                const p = document.createElement('p');
                p.textContent = caption;
                noteDiv.appendChild(p);
                modalMedia.appendChild(noteDiv);
            } else if (video) {
                const videoEl = document.createElement('video');
                videoEl.src = video;
                videoEl.controls = true;
                videoEl.autoplay = true;
                modalMedia.appendChild(videoEl);
            } else if (image) {
                const imgEl = document.createElement('img');
                imgEl.src = image;
                imgEl.alt = caption; // Use caption for alt text
                modalMedia.appendChild(imgEl);
            }

            modalCaption.textContent = caption;
            modalDate.textContent = date;
            modalLikes.textContent = `${likes} likes`;

            openModal();
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});