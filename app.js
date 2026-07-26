/* ==========================================================================
   RessoX App Engine - Pure JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Playlists & Demo Database
    const PLAYLIST_DATA = {
        bollywood: [
            {
                id: '1',
                title: 'Kesariya',
                artist: 'Arijit Singh, Pritam',
                url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
                art: 'assets/hero.jpg',
                lyrics: [
                    "00:00.00 ♪ Kesariya tera ishq hai piya ♪",
                    "00:05.00 Rang jaaun jo main haath lagaun",
                    "00:10.00 Din beete saara teri fikr mein",
                    "00:15.00 Rain saari teri khair manaun"
                ]
            },
            {
                id: '2',
                title: 'Pehle Bhi Main',
                artist: 'Vishal Mishra, Raj Shekhar',
                url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sunset-landscape-10940.mp3',
                art: 'assets/logo.jpg',
                lyrics: [
                    "00:00.00 ♪ Pehle bhi main tumse mila hoon ♪",
                    "00:05.00 Pehli dafa hi milke lagaa",
                    "00:10.00 Tu mera ho gaya, main tera ho gaya"
                ]
            }
        ],
        lofi: [
            {
                id: '3',
                title: 'Midnight Lofi Chill',
                artist: 'RessoX Beats',
                url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
                art: 'assets/logo.jpg',
                lyrics: [
                    "00:00.00 ♪ Soft Lofi Beats For Study & Relax ♪",
                    "00:06.00 Chill Vibes Only - 320kbps Audio Stream"
                ]
            }
        ],
        punjabi: [
            {
                id: '4',
                title: 'Softly (Acoustic)',
                artist: 'Karan Aujla',
                url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sunset-landscape-10940.mp3',
                art: 'assets/hero.jpg',
                lyrics: [
                    "00:00.00 ♪ Softly softly ni tu chadhdi floor te ♪",
                    "00:05.00 Wakhra hi swag tera saareyan toh wakhra"
                ]
            }
        ],
        edm: [
            {
                id: '5',
                title: 'Cyber-Sonic Beats',
                artist: 'Neon Rhythms',
                url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
                art: 'assets/logo.jpg',
                lyrics: [
                    "00:00.00 ♪ Feel The Synth Bass Drop ♪",
                    "00:05.00 RessoX Music Player Engine"
                ]
            }
        ],
        romantic: [
            {
                id: '6',
                title: 'Tum Hi Ho (Re-Imagined)',
                artist: 'Arijit Singh',
                url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sunset-landscape-10940.mp3',
                art: 'assets/hero.jpg',
                lyrics: [
                    "00:00.00 ♪ Hum tere bin ab reh nahi sakte ♪",
                    "00:05.00 Tere bina kya wajood mera"
                ]
            }
        ]
    };

    // State Variables
    let currentQueue = [...PLAYLIST_DATA.bollywood];
    let currentIndex = 0;
    let isPlaying = false;

    // DOM Elements
    const audio = document.getElementById('audioElement');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const likeBtn = document.getElementById('likeBtn');

    const playerArt = document.getElementById('playerArt');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalDurationEl = document.getElementById('totalDuration');

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchDropdown = document.getElementById('searchDropdown');
    const genreChips = document.querySelectorAll('.chip-item');

    const miniArt = document.getElementById('miniArt');
    const miniTitle = document.getElementById('miniTitle');
    const miniArtist = document.getElementById('miniArtist');
    const miniPlayBtn = document.getElementById('miniPlayBtn');
    const miniPrevBtn = document.getElementById('miniPrevBtn');
    const miniNextBtn = document.getElementById('miniNextBtn');

    const tabLyricsBtn = document.getElementById('tabLyricsBtn');
    const tabQueueBtn = document.getElementById('tabQueueBtn');
    const lyricsContainer = document.getElementById('lyricsContainer');
    const queueContainer = document.getElementById('queueContainer');
    const lyricsWrapper = document.getElementById('lyricsWrapper');
    const queueList = document.getElementById('queueList');
    const queueCount = document.getElementById('queueCount');

    // Load & Play Song
    function loadSong(song) {
        audio.src = song.url;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        if (song.art) playerArt.src = song.art;

        miniTitle.textContent = song.title;
        miniArtist.textContent = song.artist;
        if (song.art) miniArt.src = song.art;

        renderLyrics(song.lyrics || ["♪ Instrumental / Synced Lyrics Loading ♪"]);
        updateQueueUI();
    }

    function playSong() {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButtons(true);
        }).catch(err => {
            console.log("Playback interrupted or network check:", err);
        });
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        updatePlayButtons(false);
    }

    function updatePlayButtons(playing) {
        const icn = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        playPauseBtn.innerHTML = icn;
        miniPlayBtn.innerHTML = icn;
    }

    playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
    miniPlayBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());

    nextBtn.addEventListener('click', playNext);
    miniNextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    miniPrevBtn.addEventListener('click', playPrev);

    function playNext() {
        if (currentQueue.length === 0) return;
        currentIndex = (currentIndex + 1) % currentQueue.length;
        loadSong(currentQueue[currentIndex]);
        playSong();
    }

    function playPrev() {
        if (currentQueue.length === 0) return;
        currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
        loadSong(currentQueue[currentIndex]);
        playSong();
    }

    shuffleBtn.addEventListener('click', () => {
        currentQueue = [...currentQueue].sort(() => Math.random() - 0.5);
        currentIndex = 0;
        loadSong(currentQueue[0]);
        playSong();
        showToast("Queue Shuffled! 🎲");
    });

    likeBtn.addEventListener('click', () => {
        const icon = likeBtn.querySelector('i');
        if (icon.classList.contains('fa-regular')) {
            icon.className = 'fa-solid fa-heart text-accent';
            showToast("Added to Liked Songs ❤️");
        } else {
            icon.className = 'fa-regular fa-heart';
            showToast("Removed from Liked Songs");
        }
    });

    // Time update
    audio.addEventListener('timeupdate', () => {
        if (isNaN(audio.duration)) return;
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;

        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);

        updateLyricsHighlight(audio.currentTime);
    });

    audio.addEventListener('ended', playNext);

    progressBar.addEventListener('input', () => {
        if (!audio.duration) return;
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Synced Lyrics
    function renderLyrics(lyricsArray) {
        lyricsWrapper.innerHTML = '';
        lyricsArray.forEach((line, idx) => {
            const p = document.createElement('p');
            p.className = `lyric-row ${idx === 0 ? 'active' : ''}`;
            p.textContent = line.replace(/^[0-9:\.]+\s*/, '');
            lyricsWrapper.appendChild(p);
        });
    }

    function updateLyricsHighlight(time) {
        const rows = lyricsWrapper.querySelectorAll('.lyric-row');
        if (rows.length === 0) return;
        const idx = Math.floor((time / (audio.duration || 30)) * rows.length);
        rows.forEach((r, i) => i === idx ? r.classList.add('active') : r.classList.remove('active'));
    }

    // Queue List UI
    function updateQueueUI() {
        queueList.innerHTML = '';
        queueCount.textContent = currentQueue.length;

        currentQueue.forEach((song, idx) => {
            const row = document.createElement('div');
            row.className = `queue-row ${idx === currentIndex ? 'active-song' : ''}`;
            row.innerHTML = `
                <img src="${song.art || 'assets/logo.jpg'}" alt="${song.title}">
                <div class="queue-row-info">
                    <div class="queue-row-title">${song.title}</div>
                    <div class="queue-row-artist">${song.artist}</div>
                </div>
                ${idx === currentIndex && isPlaying ? '<i class="fa-solid fa-volume-high text-accent"></i>' : ''}
            `;
            row.addEventListener('click', () => {
                currentIndex = idx;
                loadSong(song);
                playSong();
            });
            queueList.appendChild(row);
        });
    }

    // Genre Filter Chips
    genreChips.forEach(chip => {
        chip.addEventListener('click', () => {
            genreChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const genre = chip.dataset.genre;
            if (PLAYLIST_DATA[genre]) {
                currentQueue = [...PLAYLIST_DATA[genre]];
                currentIndex = 0;
                loadSong(currentQueue[0]);
                playSong();
            }
        });
    });

    // JioSaavn Search API
    let searchDebounce;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        const q = searchInput.value.trim();
        if (q.length < 2) {
            searchDropdown.classList.remove('active');
            return;
        }

        searchDebounce = setTimeout(async () => {
            try {
                const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(q)}&limit=5`);
                const data = await res.json();
                if (data.success && data.data.results && data.data.results.length > 0) {
                    renderDropdown(data.data.results);
                }
            } catch (err) {
                console.log("Search dropdown error:", err);
            }
        }, 300);
    });

    function renderDropdown(results) {
        searchDropdown.innerHTML = '';
        results.forEach(song => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <img src="${song.image ? song.image[0].url : 'assets/logo.jpg'}" alt="${song.name}">
                <div class="dropdown-meta">
                    <h4>${song.name}</h4>
                    <p>${song.artists.primary ? song.artists.primary[0].name : 'Artist'}</p>
                </div>
            `;
            item.addEventListener('click', () => {
                searchDropdown.classList.remove('active');
                playSingleSaavnSong(song);
            });
            searchDropdown.appendChild(item);
        });
        searchDropdown.classList.add('active');
    }

    async function searchSongs(query) {
        if (!query.trim()) return;
        searchDropdown.classList.remove('active');
        showToast(`Searching JioSaavn for "${query}"... 🔍`);

        try {
            const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=15`);
            const data = await res.json();

            if (data.success && data.data.results && data.data.results.length > 0) {
                currentQueue = data.data.results.map(item => ({
                    id: item.id,
                    title: item.name,
                    artist: item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'Artist',
                    url: item.downloadUrl ? (item.downloadUrl[item.downloadUrl.length - 1].url || item.downloadUrl[0].url) : '',
                    art: item.image ? item.image[item.image.length - 1].url : 'assets/logo.jpg',
                    lyrics: [
                        `00:00.00 ♪ ${item.name} ♪`,
                        `00:05.00 Artist: ${item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'RessoX'}`
                    ]
                }));

                currentIndex = 0;
                loadSong(currentQueue[0]);
                playSong();
                showToast(`Loaded ${currentQueue.length} songs!`);
            }
        } catch (err) {
            showToast("Network check. Default playlist active.");
        }
    }

    function playSingleSaavnSong(item) {
        const song = {
            id: item.id,
            title: item.name,
            artist: item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'Artist',
            url: item.downloadUrl ? (item.downloadUrl[item.downloadUrl.length - 1].url || item.downloadUrl[0].url) : '',
            art: item.image ? item.image[item.image.length - 1].url : 'assets/logo.jpg'
        };
        currentQueue.unshift(song);
        currentIndex = 0;
        loadSong(song);
        playSong();
    }

    searchBtn.addEventListener('click', () => searchSongs(searchInput.value));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.app-search-box')) {
            searchDropdown.classList.remove('active');
        }
    });

    // Playlist Cards
    document.querySelectorAll('.app-playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            searchSongs(card.dataset.query);
        });
    });

    // Tabs
    tabLyricsBtn.addEventListener('click', () => {
        tabLyricsBtn.classList.add('active');
        tabQueueBtn.classList.remove('active');
        lyricsContainer.classList.add('active');
        queueContainer.classList.remove('active');
    });

    tabQueueBtn.addEventListener('click', () => {
        tabQueueBtn.classList.add('active');
        tabLyricsBtn.classList.remove('active');
        queueContainer.classList.add('active');
        lyricsContainer.classList.remove('active');
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('active');
        });
    });

    // Mobile Nav Highlight
    const navTabs = document.querySelectorAll('.nav-tab');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        document.querySelectorAll('section[id]').forEach(sec => {
            if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
                const id = sec.getAttribute('id');
                navTabs.forEach(tab => {
                    if (tab.getAttribute('href') === `#${id}`) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            }
        });
    });

    // Download APK
    const downloadApkBtn = document.getElementById('downloadApkBtn');
    if (downloadApkBtn) {
        downloadApkBtn.addEventListener('click', () => {
            showToast("Downloading RessoX v2.1.0 APK... 🚀");
            setTimeout(() => {
                window.location.href = "https://github.com/Prashxonline/RessoX-Web/releases/download/v2.1.0/RessoX_v2.1.0.apk";
            }, 1000);
        });
    }

    // SHA Copy
    const copyShaBtn = document.getElementById('copyShaBtn');
    if (copyShaBtn) {
        copyShaBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(document.getElementById('shaCode').textContent);
            showToast("SHA-256 Checksum copied! 📋");
        });
    }

    // Toast Alert
    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-accent"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Initial Load
    loadSong(currentQueue[0]);
});
