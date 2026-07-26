/* ==========================================================================
   RessoX Web 2.0 - Interactive Player Engine, Web Audio API & JioSaavn REST
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Curated Playlist Songs Database
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
                    "00:10.00 Tu mera ho gaya, main tera ho gaya",
                    "00:15.00 RessoX Lossless Hi-Fi Audio"
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
                    "00:06.00 Chill Vibes Only",
                    "00:12.00 320kbps Audio Stream",
                    "00:18.00 Powered by RessoX Engine"
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
                    "00:05.00 Wakhra hi swag tera saareyan toh wakhra",
                    "00:10.00 RessoX Synced Karaoke Lyrics"
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
                    "00:00.00 ♪ Feel The Heavy Synth Bass Drop ♪",
                    "00:05.00 Cyberpunk Neon Lights",
                    "00:10.00 RessoX Music Player Web Demo"
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
                    "00:05.00 Tere bina kya wajood mera",
                    "00:10.00 Kyunki tum hi ho, ab tum hi ho"
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
    const albumArtWrapper = document.querySelector('.album-art-wrapper');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchDropdown = document.getElementById('searchDropdown');
    const genreChips = document.querySelectorAll('.chip');
    const queueList = document.getElementById('queueList');
    const queueCount = document.getElementById('queueCount');
    const lyricsWrapper = document.getElementById('lyricsWrapper');

    // Sticky Bottom Player
    const stickyPlayerBar = document.getElementById('stickyPlayerBar');
    const miniArt = document.getElementById('miniArt');
    const miniTitle = document.getElementById('miniTitle');
    const miniArtist = document.getElementById('miniArtist');
    const miniPlayBtn = document.getElementById('miniPlayBtn');
    const miniPrevBtn = document.getElementById('miniPrevBtn');
    const miniNextBtn = document.getElementById('miniNextBtn');
    const miniExpandBtn = document.getElementById('miniExpandBtn');
    const expandPlayerBtn = document.getElementById('expandPlayerBtn');

    // Fullscreen Modal
    const fullscreenModal = document.getElementById('fullscreenModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const fullPlayerArt = document.getElementById('fullPlayerArt');
    const fullPlayerTitle = document.getElementById('fullPlayerTitle');
    const fullPlayerArtist = document.getElementById('fullPlayerArtist');
    const fullLyricsBox = document.getElementById('fullLyricsBox');
    const fullPlayPauseBtn = document.getElementById('fullPlayPauseBtn');
    const fullPrevBtn = document.getElementById('fullPrevBtn');
    const fullNextBtn = document.getElementById('fullNextBtn');
    const fullProgressBar = document.getElementById('fullProgressBar');
    const fullCurrentTime = document.getElementById('fullCurrentTime');
    const fullTotalDuration = document.getElementById('fullTotalDuration');

    // Side Tabs
    const tabLyricsBtn = document.getElementById('tabLyricsBtn');
    const tabQueueBtn = document.getElementById('tabQueueBtn');
    const tabEqBtn = document.getElementById('tabEqBtn');
    const lyricsContainer = document.getElementById('lyricsContainer');
    const queueContainer = document.getElementById('queueContainer');
    const eqContainer = document.getElementById('eqContainer');

    // Canvas Audio Visualizer Setup
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let audioCtx, analyser, sourceNode;

    function initAudioContext() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 64;
                sourceNode = audioCtx.createMediaElementSource(audio);
                sourceNode.connect(analyser);
                analyser.connect(audioCtx.destination);
            } catch (e) {
                console.log("AudioContext fallback visualizer active.");
            }
        }
    }

    function resizeCanvas() {
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio Visualizer Animation Loop
    function drawVisualizer() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bars = 32;
        const barWidth = canvas.width / bars - 3;
        const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
        if (analyser && isPlaying) analyser.getByteFrequencyData(dataArray);

        const time = Date.now() * 0.005;

        for (let i = 0; i < bars; i++) {
            let barHeight;
            if (analyser && isPlaying && dataArray) {
                barHeight = (dataArray[i % dataArray.length] / 255) * canvas.height * 0.9 + 4;
            } else if (isPlaying) {
                barHeight = Math.sin(time + i * 0.2) * 15 + Math.cos(time * 0.5 + i * 0.3) * 10 + 20;
            } else {
                barHeight = 4;
            }

            const x = i * (barWidth + 3);
            const y = (canvas.height - barHeight) / 2;

            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#ff007f');
            gradient.addColorStop(1, '#00dfd8');

            ctx.fillStyle = gradient;
            ctx.shadowBlur = isPlaying ? 10 : 0;
            ctx.shadowColor = '#ff007f';
            ctx.fillRect(x, y, barWidth, barHeight);
        }

        requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();

    // Load & Sync Song State
    function loadSong(song) {
        audio.src = song.url;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        if (song.art) playerArt.src = song.art;

        // Mini & Full Sync
        miniTitle.textContent = song.title;
        miniArtist.textContent = song.artist;
        if (song.art) miniArt.src = song.art;

        fullPlayerTitle.textContent = song.title;
        fullPlayerArtist.textContent = song.artist;
        if (song.art) fullPlayerArt.src = song.art;

        renderLyrics(song.lyrics || ["♪ Instrumental / Synced Lyrics Loading ♪"]);
        updateQueueUI();
    }

    function playSong() {
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        audio.play().then(() => {
            isPlaying = true;
            updatePlayButtonsUI(true);
            stickyPlayerBar.classList.add('active');
            if (albumArtWrapper) albumArtWrapper.classList.add('playing');
        }).catch(err => {
            console.log("Autoplay check:", err);
        });
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        updatePlayButtonsUI(false);
        if (albumArtWrapper) albumArtWrapper.classList.remove('playing');
    }

    function updatePlayButtonsUI(playing) {
        const iconHtml = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        playPauseBtn.innerHTML = iconHtml;
        miniPlayBtn.innerHTML = iconHtml;
        fullPlayPauseBtn.innerHTML = iconHtml;
    }

    // Controls Handling
    playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
    miniPlayBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
    fullPlayPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());

    nextBtn.addEventListener('click', playNext);
    miniNextBtn.addEventListener('click', playNext);
    fullNextBtn.addEventListener('click', playNext);

    prevBtn.addEventListener('click', playPrev);
    miniPrevBtn.addEventListener('click', playPrev);
    fullPrevBtn.addEventListener('click', playPrev);

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
            icon.className = 'fa-solid fa-heart text-pink';
            showToast("Added to Liked Songs ❤️");
        } else {
            icon.className = 'fa-regular fa-heart';
            showToast("Removed from Liked Songs");
        }
    });

    // Time & Progress Updates
    audio.addEventListener('timeupdate', () => {
        if (isNaN(audio.duration)) return;
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        fullProgressBar.value = progress;

        const curr = formatTime(audio.currentTime);
        const dur = formatTime(audio.duration);

        currentTimeEl.textContent = curr;
        totalDurationEl.textContent = dur;
        fullCurrentTime.textContent = curr;
        fullTotalDuration.textContent = dur;

        updateLyricsHighlight(audio.currentTime);
    });

    audio.addEventListener('ended', playNext);

    progressBar.addEventListener('input', () => {
        if (!audio.duration) return;
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
    fullProgressBar.addEventListener('input', () => {
        if (!audio.duration) return;
        audio.currentTime = (fullProgressBar.value / 100) * audio.duration;
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Synced Lyrics Render & Highlight
    function renderLyrics(lyricsArray) {
        lyricsWrapper.innerHTML = '';
        fullLyricsBox.innerHTML = '';

        lyricsArray.forEach((line, idx) => {
            const cleanText = line.replace(/^[0-9:\.]+\s*/, '');
            
            const p1 = document.createElement('p');
            p1.className = `lyric-line ${idx === 0 ? 'active' : ''}`;
            p1.textContent = cleanText;
            lyricsWrapper.appendChild(p1);

            const p2 = document.createElement('p');
            p2.className = `lyric-line ${idx === 0 ? 'active' : ''}`;
            p2.textContent = cleanText;
            fullLyricsBox.appendChild(p2);
        });
    }

    function updateLyricsHighlight(time) {
        const lines1 = lyricsWrapper.querySelectorAll('.lyric-line');
        const lines2 = fullLyricsBox.querySelectorAll('.lyric-line');
        if (lines1.length === 0) return;
        
        const lineIdx = Math.floor((time / (audio.duration || 30)) * lines1.length);
        lines1.forEach((line, i) => i === lineIdx ? line.classList.add('active') : line.classList.remove('active'));
        lines2.forEach((line, i) => i === lineIdx ? line.classList.add('active') : line.classList.remove('active'));
    }

    // Queue UI
    function updateQueueUI() {
        queueList.innerHTML = '';
        queueCount.textContent = currentQueue.length;

        currentQueue.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = `queue-item ${idx === currentIndex ? 'playing' : ''}`;
            item.innerHTML = `
                <img src="${song.art || 'assets/logo.jpg'}" alt="${song.title}" class="queue-img">
                <div class="queue-meta">
                    <div class="queue-title">${song.title}</div>
                    <div class="queue-artist">${song.artist}</div>
                </div>
                ${idx === currentIndex && isPlaying ? '<i class="fa-solid fa-volume-high text-pink"></i>' : ''}
            `;
            item.addEventListener('click', () => {
                currentIndex = idx;
                loadSong(song);
                playSong();
            });
            queueList.appendChild(item);
        });
    }

    // Genre Chips Filter
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

    // JioSaavn Search API & Autocomplete
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const q = searchInput.value.trim();
        if (q.length < 2) {
            searchDropdown.classList.remove('active');
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(q)}&limit=5`);
                const data = await res.json();
                if (data.success && data.data.results && data.data.results.length > 0) {
                    renderSearchDropdown(data.data.results);
                }
            } catch (err) {
                console.log("Autocomplete error:", err);
            }
        }, 300);
    });

    function renderSearchDropdown(results) {
        searchDropdown.innerHTML = '';
        results.forEach(song => {
            const item = document.createElement('div');
            item.className = 'search-item';
            item.innerHTML = `
                <img src="${song.image ? song.image[0].url : 'assets/logo.jpg'}" alt="${song.name}">
                <div class="search-item-info">
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
                        `00:05.00 Artist: ${item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'RessoX'}`,
                        `00:10.00 Album: ${item.album ? item.album.name : 'Single'}`,
                        `00:15.00 320kbps Lossless Stream on RessoX`
                    ]
                }));

                currentIndex = 0;
                loadSong(currentQueue[0]);
                playSong();
                showToast(`Loaded ${currentQueue.length} songs from JioSaavn!`);
            }
        } catch (err) {
            showToast("Network error. Loaded default queue.");
        }
    }

    function playSingleSaavnSong(item) {
        const newSong = {
            id: item.id,
            title: item.name,
            artist: item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'Artist',
            url: item.downloadUrl ? (item.downloadUrl[item.downloadUrl.length - 1].url || item.downloadUrl[0].url) : '',
            art: item.image ? item.image[item.image.length - 1].url : 'assets/logo.jpg',
            lyrics: [
                `00:00.00 ♪ ${item.name} ♪`,
                `00:05.00 Artist: ${item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'RessoX'}`
            ]
        };
        currentQueue.unshift(newSong);
        currentIndex = 0;
        loadSong(newSong);
        playSong();
    }

    searchBtn.addEventListener('click', () => searchSongs(searchInput.value));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box-container')) {
            searchDropdown.classList.remove('active');
        }
    });

    // Curated Playlist Card Clicks
    document.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            const query = card.dataset.query;
            searchSongs(query);
        });
    });

    // Side Tabs
    tabLyricsBtn.addEventListener('click', () => switchTab(tabLyricsBtn, lyricsContainer));
    tabQueueBtn.addEventListener('click', () => switchTab(tabQueueBtn, queueContainer));
    tabEqBtn.addEventListener('click', () => switchTab(tabEqBtn, eqContainer));

    function switchTab(activeBtn, activeContainer) {
        [tabLyricsBtn, tabQueueBtn, tabEqBtn].forEach(b => b.classList.remove('active'));
        [lyricsContainer, queueContainer, eqContainer].forEach(c => c.classList.remove('active'));
        activeBtn.classList.add('active');
        activeContainer.classList.add('active');
    }

    // Fullscreen Modal Controls
    expandPlayerBtn.addEventListener('click', openModal);
    miniExpandBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);

    function openModal() {
        fullscreenModal.classList.add('active');
    }
    function closeModal() {
        fullscreenModal.classList.remove('active');
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('active');
        });
    });

    // Download APK Action
    const downloadApkBtn = document.getElementById('downloadApkBtn');
    if (downloadApkBtn) {
        downloadApkBtn.addEventListener('click', () => {
            showToast("Starting RessoX v2.1.0 APK Download... 🚀");
            setTimeout(() => {
                window.location.href = "https://github.com/Prashxonline/RessoX-Web/releases/download/v2.1.0/RessoX_v2.1.0.apk";
            }, 1000);
        });
    }

    // SHA Copy
    const copyShaBtn = document.getElementById('copyShaBtn');
    if (copyShaBtn) {
        copyShaBtn.addEventListener('click', () => {
            const shaCode = document.getElementById('shaCode').textContent;
            navigator.clipboard.writeText(shaCode);
            showToast("SHA-256 Checksum copied to clipboard! 📋");
        });
    }

    // Mobile Hamburger
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Toast Notification System
    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info text-pink"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Initial Song Load
    loadSong(currentQueue[0]);
});
