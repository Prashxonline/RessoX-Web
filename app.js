/* ==========================================================================
   RessoX Web - Interactive Player Engine & JioSaavn API Integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Pre-loaded Trending Songs (Fallback Stream URLs)
    const TRENDING_SONGS = {
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
                title: 'Cyberpunk Cyber-Sonic',
                artist: 'Neon Rhythms',
                url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
                art: 'assets/logo.jpg',
                lyrics: [
                    "00:00.00 ♪ Feel The Heavy Synth Bass drop ♪",
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
    let currentQueue = [...TRENDING_SONGS.bollywood];
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
    const genreChips = document.querySelectorAll('.chip');
    const queueList = document.getElementById('queueList');
    const lyricsWrapper = document.getElementById('lyricsWrapper');

    const tabLyricsBtn = document.getElementById('tabLyricsBtn');
    const tabQueueBtn = document.getElementById('tabQueueBtn');
    const lyricsContainer = document.getElementById('lyricsContainer');
    const queueContainer = document.getElementById('queueContainer');

    // Canvas Audio Visualizer
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let animFrameId = null;

    // Initialize Canvas Dimensions
    function resizeCanvas() {
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render Audio Visualizer Waveform Animation
    function drawVisualizer() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bars = 40;
        const barWidth = canvas.width / bars - 3;
        const time = Date.now() * 0.005;

        for (let i = 0; i < bars; i++) {
            let barHeight;
            if (isPlaying) {
                barHeight = Math.sin(time + i * 0.2) * 15 + Math.cos(time * 0.5 + i * 0.3) * 10 + 20;
            } else {
                barHeight = 4; // Flat line when paused
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

        animFrameId = requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();

    // Load & Play Song
    function loadSong(song) {
        audio.src = song.url;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        if (song.art) playerArt.src = song.art;

        // Render Lyrics
        renderLyrics(song.lyrics || ["♪ Instrumental / Synced Lyrics Loading ♪"]);
        updateQueueUI();
    }

    function playSong() {
        audio.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            showToast(`Playing: ${currentQueue[currentIndex].title}`);
        }).catch(err => {
            console.log("Autoplay blocked or network error", err);
        });
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }

    // Playback Event Handlers
    playPauseBtn.addEventListener('click', () => {
        if (!audio.src || currentQueue.length === 0) return;
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQueue.length === 0) return;
        currentIndex = (currentIndex + 1) % currentQueue.length;
        loadSong(currentQueue[currentIndex]);
        playSong();
    });

    prevBtn.addEventListener('click', () => {
        if (currentQueue.length === 0) return;
        currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
        loadSong(currentQueue[currentIndex]);
        playSong();
    });

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

    // Time & Progress Update
    audio.addEventListener('timeupdate', () => {
        if (isNaN(audio.duration)) return;
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;

        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);

        // Update Lyrics Highlight
        updateLyricsHighlight(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
        nextBtn.click(); // Auto-advance to next song
    });

    progressBar.addEventListener('input', () => {
        if (!audio.duration) return;
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Synced Lyrics Renderer
    function renderLyrics(lyricsArray) {
        lyricsWrapper.innerHTML = '';
        lyricsArray.forEach((line, idx) => {
            const p = document.createElement('p');
            p.className = `lyric-line ${idx === 0 ? 'active' : ''}`;
            p.textContent = line.replace(/^[0-9:\.]+\s*/, '');
            lyricsWrapper.appendChild(p);
        });
    }

    function updateLyricsHighlight(time) {
        const lines = lyricsWrapper.querySelectorAll('.lyric-line');
        if (lines.length === 0) return;
        
        // Simple interval highlight simulation
        const lineIdx = Math.floor((time / (audio.duration || 30)) * lines.length);
        lines.forEach((line, i) => {
            if (i === lineIdx) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }

    // Queue UI Population
    function updateQueueUI() {
        queueList.innerHTML = '';
        currentQueue.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = `queue-item ${idx === currentIndex ? 'playing' : ''}`;
            item.innerHTML = `
                <img src="${song.art || 'assets/logo.jpg'}" alt="${song.title}" class="queue-img">
                <div class="queue-meta">
                    <div class="queue-title">${song.title}</div>
                    <div class="queue-artist">${song.artist}</div>
                </div>
                ${idx === currentIndex && isPlaying ? '<i class="fa-solid fa-waveform text-pink"></i>' : ''}
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
            if (TRENDING_SONGS[genre]) {
                currentQueue = [...TRENDING_SONGS[genre]];
                currentIndex = 0;
                loadSong(currentQueue[0]);
                playSong();
            }
        });
    });

    // JioSaavn API Real-time Search
    async function searchSongs(query) {
        if (!query.trim()) return;
        showToast(`Searching JioSaavn for "${query}"... 🔍`);

        try {
            const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=10`);
            const data = await res.json();

            if (data.success && data.data.results && data.data.results.length > 0) {
                currentQueue = data.data.results.map(item => ({
                    id: item.id,
                    title: item.name,
                    artist: item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'Unknown Artist',
                    url: item.downloadUrl ? (item.downloadUrl[item.downloadUrl.length - 1].url || item.downloadUrl[0].url) : '',
                    art: item.image ? item.image[item.image.length - 1].url : 'assets/logo.jpg',
                    lyrics: [
                        `00:00.00 ♪ ${item.name} ♪`,
                        `00:05.00 Artist: ${item.artists.primary ? item.artists.primary.map(a => a.name).join(', ') : 'RessoX'}`,
                        `00:10.00 Album: ${item.album ? item.album.name : 'Single'}`,
                        `00:15.00 320kbps Stream on RessoX`
                    ]
                }));

                currentIndex = 0;
                loadSong(currentQueue[0]);
                playSong();
                showToast(`Found ${currentQueue.length} songs! Playing top result.`);
            } else {
                showToast("No exact songs found. Try another search.");
            }
        } catch (err) {
            console.error("JioSaavn search error:", err);
            showToast("Network error. Switching to preloaded playlist.");
        }
    }

    searchBtn.addEventListener('click', () => searchSongs(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchSongs(searchInput.value);
    });

    // Side Panel Tab Switching
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
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });

    // APK Download Action
    const downloadApkBtn = document.getElementById('downloadApkBtn');
    if (downloadApkBtn) {
        downloadApkBtn.addEventListener('click', () => {
            showToast("Starting RessoX v2.1.0 APK Download... 🚀");
            setTimeout(() => {
                window.location.href = "https://github.com/Prashxonline/RessoX-Web/releases/download/v2.1.0/RessoX_v2.1.0.apk";
            }, 1000);
        });
    }

    // SHA Copy Action
    const copyShaBtn = document.getElementById('copyShaBtn');
    if (copyShaBtn) {
        copyShaBtn.addEventListener('click', () => {
            const shaCode = document.getElementById('shaCode').textContent;
            navigator.clipboard.writeText(shaCode);
            showToast("SHA-256 Checksum copied to clipboard! 📋");
        });
    }

    // Mobile Hamburger Nav
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

    // Initial Load
    loadSong(currentQueue[0]);
});
