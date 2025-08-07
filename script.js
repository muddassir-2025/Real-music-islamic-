window.addEventListener('DOMContentLoaded', () => {
    // ✅ Dynamic key based on current page
    const page = window.location.pathname.toLowerCase();
    let storageKey = "favorites"; // default

    if (page.includes("nasheedarabic")) {
        storageKey = "nasheedArabicFavorites";
    } else if (page.includes("nasheedenglish")) {
        storageKey = "nasheedEnglishFavorites";
    } else if (page.includes("nasheedslowed")) {
        storageKey = "nasheedSlowedFavorites";
    } else if (page.includes("nasheed")) {
        storageKey = "nasheedFavorites";
    } else if (page.includes("quranlofi")) {
        storageKey = "quranLofiFavorites";
    } else if (page.includes("quran")) {
        storageKey = "quranFavorites";
    }

    const favContainer = document.getElementById("favorites");
    const progress = document.getElementById("progress");
    let currentAudio = null;
    let favorites = JSON.parse(localStorage.getItem(storageKey)) || [];

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    function setupAudioControls(card) {
        const audio = card.querySelector('audio');
        const btn = card.querySelector('.play-btn');
        const timeDisplay = card.nextElementSibling?.nextElementSibling;

        if (!audio || !btn) return;

        audio.addEventListener("loadedmetadata", () => {
            if (timeDisplay) {
                timeDisplay.querySelector("h4").textContent = `00:00 / ${formatTime(audio.duration)}`;
            }
            if (currentAudio === audio && progress) {
                progress.max = audio.duration;
            }
        });

        audio.addEventListener("timeupdate", () => {
            if (currentAudio === audio) {
                if (timeDisplay) {
                    timeDisplay.querySelector("h4").textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
                }
                if (progress) progress.value = audio.currentTime;
            }
        });

        audio.addEventListener('ended', () => {
            btn.classList.remove('fa-circle-pause');
            btn.classList.add('fa-circle-play');
            card.classList.remove('active');
            currentAudio = null;
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPlayingThisAudio = currentAudio === audio && !audio.paused;

            document.querySelectorAll('.scard, .fcard').forEach(c => {
                c.classList.remove('active');
                const a = c.querySelector('audio');
                const b = c.querySelector('.play-btn');
                if (a) a.pause();
                if (b) {
                    b.classList.remove('fa-circle-pause');
                    b.classList.add('fa-circle-play');
                }
            });

            if (isPlayingThisAudio) {
                audio.pause();
                btn.classList.remove('fa-circle-pause');
                btn.classList.add('fa-circle-play');
                card.classList.remove('active');
                currentAudio = null;
            } else {
                audio.play();
                btn.classList.remove('fa-circle-play');
                btn.classList.add('fa-circle-pause');
                card.classList.add('active');
                currentAudio = audio;

                if (!isNaN(audio.duration) && progress) {
                    progress.max = audio.duration;
                    progress.value = audio.currentTime;
                }
            }
        });
    }

    document.querySelectorAll('.scard, .fcard').forEach(setupAudioControls);

    if (progress) {
        progress.addEventListener('input', () => {
            if (currentAudio) {
                currentAudio.currentTime = progress.value;
            }
        });
    }

    function addCardToFavorites(cardData) {
        const fcard = document.createElement("div");
        fcard.classList.add("fcard");
        fcard.setAttribute("data-id", cardData.id);
        fcard.setAttribute("data-title", cardData.title);
        fcard.innerHTML = `
            <h4>${cardData.title}</h4>
            <audio src="${cardData.audio}"></audio>
            <i class="fa-solid fa-circle-play play-btn"></i>
            <button class="remove-btn">Remove</button>
        `;

        fcard.querySelector(".remove-btn").addEventListener("click", () => {
            fcard.remove();
            favorites = favorites.filter(c => c.id !== cardData.id);
            localStorage.setItem(storageKey, JSON.stringify(favorites));
            updateHeartIcons();
        });

        favContainer.appendChild(fcard);
        setupAudioControls(fcard);
    }

    function updateHeartIcons() {
        document.querySelectorAll(".heartbtn").forEach(heart => {
            const scard = heart.closest(".heart")?.previousElementSibling;
            if (!scard) return;

            const id = scard.dataset.id;
            if (favorites.some(card => card.id === id)) {
                heart.classList.add('active');
            } else {
                heart.classList.remove('active');
            }
        });
    }

    favorites.forEach(addCardToFavorites);
    updateHeartIcons();

    document.querySelectorAll(".heartbtn").forEach((heart) => {
        heart.addEventListener("click", function (e) {
            e.stopPropagation();
            const scard = heart.closest(".heart")?.previousElementSibling;
            if (!scard || !scard.classList.contains("scard")) return;

            const id = scard.dataset.id;
            const title = scard.dataset.title;
            const audio = scard.querySelector("audio")?.src;
            if (!id || !audio) return;

            const alreadyFav = favorites.some(card => card.id === id);

            if (!alreadyFav) {
                const cardData = { id, title, audio };
                favorites.push(cardData);
                localStorage.setItem(storageKey, JSON.stringify(favorites));
                addCardToFavorites(cardData);
            } else {
                favorites = favorites.filter(card => card.id !== id);
                localStorage.setItem(storageKey, JSON.stringify(favorites));
                document.querySelector(`.fcard[data-id="${id}"]`)?.remove();
            }

            updateHeartIcons();
        });
    });
});





  const toggleButton = document.getElementById("menuToggle");
  const closeButton = document.getElementById("closeMenu");
  const leftPanel = document.querySelector(".left");

  toggleButton.addEventListener("click", () => {
    leftPanel.classList.add("active");
  });

  closeButton.addEventListener("click", () => {
    leftPanel.classList.remove("active");
  });



