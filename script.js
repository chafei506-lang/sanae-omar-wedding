/* 
========================================================================
   SANAE & OMAR WEDDING WEBPAGE - JAVASCRIPT LOGIC
   This file manages the interactive components of the website.
   You can easily edit details, photos, and links in the CONFIG below.
========================================================================
*/

const CONFIG = {
    // 1. COUPLE DETAILS
    coupleNames: "Sanae & Omar",
    weddingDate: "2025-12-27T16:00:00", // ISO format (YYYY-MM-DDTHH:MM:SS) for time calculations

    // 2. VIDEO LINKS
    // Paste your Google Drive preview link for the short highlight reel here.
    // Format: https://drive.google.com/file/d/FILE_ID/preview
    BEST_OF_VIDEO_URL: "https://drive.google.com/file/d/1234567890abcdefghijklmnopqrstuv/preview",

    // Paste your external video URL here (e.g. YouTube unlisted link, Vimeo, or Google Drive)
    // - If you paste a YouTube or Vimeo link, it will automatically embed a player inline!
    // - If you paste a Google Drive, OneDrive, or Dropbox link, it will create an elegant click-to-watch cinema card.
    FULL_VIDEO_URL: "https://drive.google.com/drive/folders/your-large-wedding-video-link",

    // 3. BACKGROUND MUSIC
    // Add a music file (e.g. music.mp3) into media/ to enable the music toggle button.
    musicPath: "media/music.mp3",

    // 4. PHOTOS CONFIGURATION
    // Link to your external Google Drive folder containing all original high-resolution photos.
    // If set, a gold "Album HD ↗" button will appear in the lightbox to download original print-quality photos.
    EXTERNAL_HD_ALBUM_URL: "https://drive.google.com/drive/folders/your-shared-google-drive-album-link",

    // Choose how you want to add photos:
    // 
    // OPTION A (Easiest): Name your photos sequentially in the corresponding folders
    // (e.g., photo1.jpg, photo2.jpg, photo3.jpg...) and specify the total counts below.
    sequentialConfig: {
        enabled: true, // Set to false if you prefer listing filenames manually under manualPhotosList
        retoucheesCount: 8,   // Place photo1.jpg to photo8.jpg in ./media/photos-retouchees/
        inviteesCount: 12,    // Place photo1.jpg to photo12.jpg in ./media/photos-invitees/
        normalesCount: 10,    // Place photo1.jpg to photo10.jpg in ./media/photos-normales/
        extension: "jpg"      // File extension of your images (jpg, png, jpeg)
    },

    // OPTION B: If you have custom file names or want specific captions, set sequentialConfig.enabled to false
    // and list your files manually here.
    manualPhotosList: {
        retouchees: [
            { url: "media/photos-retouchees/photo1.jpg", caption: "Sanae & Omar — Séance Couple" },
            { url: "media/photos-retouchees/photo2.jpg", caption: "L'entrée des mariés" }
        ],
        invitees: [
            { url: "media/photos-invitees/photo1.jpg", caption: "Souvenir de fête par Mehdi" },
            { url: "media/photos-invitees/photo2.jpg", caption: "Table des invités" }
        ],
        normales: [
            { url: "media/photos-normales/photo1.jpg", caption: "Préparatifs de Sanae" },
            { url: "media/photos-normales/photo2.jpg", caption: "Détails de la décoration" }
        ]
    }
};

/* 
========================================================================
   CORE APPLICATION ENGINE (Do not modify unless you know what you do)
========================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// App Initialization
function initApp() {
    setupMobileNavbar();
    setupMarriageCounter();
    setupPhotoGallery();
    setupVideoSections();
    setupBackgroundMusic();
    setupScrollAnimations();
    setupShareFeatures();
}

// 1. MOBILE NAVBAR
function setupMobileNavbar() {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.getElementById("navbar");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // Scroll styling effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

// 2. MARRIAGE TIMER (DUAL COUNTDOWN / COUNT-UP)
function setupMarriageCounter() {
    const counterIntro = document.querySelector(".counter-intro");
    const countDays = document.getElementById("count-days");
    const countHours = document.getElementById("count-hours");
    const countMinutes = document.getElementById("count-minutes");
    const countSeconds = document.getElementById("count-seconds");

    if (!countDays || !countHours || !countMinutes || !countSeconds) return;

    const targetDate = new Date(CONFIG.weddingDate);

    function updateCounter() {
        const now = new Date();
        const diffMs = now - targetDate;

        let displayDiff = Math.abs(diffMs);

        // Update header intro text based on timeline
        if (diffMs >= 0) {
            if (counterIntro) counterIntro.textContent = "Mariés depuis :";
        } else {
            if (counterIntro) counterIntro.textContent = "Mariage dans :";
        }

        // Calculate values
        const days = Math.floor(displayDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((displayDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((displayDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((displayDiff % (1000 * 60)) / 1000);

        // Format single digits with a leading zero
        countDays.textContent = String(days).padStart(2, '0');
        countHours.textContent = String(hours).padStart(2, '0');
        countMinutes.textContent = String(minutes).padStart(2, '0');
        countSeconds.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediately and update every second
    updateCounter();
    setInterval(updateCounter, 1000);
}

// 3. PHOTO GALLERY, TABS, & LIGHTBOX
let activeCategory = "retouchees";
let activePhotosList = [];
let lightboxActiveIndex = 0;

const PAGE_SIZE = 30;
const paginationState = {
    retouchees: 1,
    invitees: 1,
    normales: 1
};

function setupPhotoGallery() {
    const tabs = document.querySelectorAll(".tab-btn");
    const galleryGrid = document.getElementById("gallery-grid");
    const noPhotosMessage = document.getElementById("no-photos-message");
    const loadMoreBtn = document.getElementById("btn-load-more");

    // Set counts in tabs
    updateCategoryCounts();

    // Populate Initial Tab
    loadPhotos(activeCategory);

    // Tab switcher events
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            const selectedCategory = tab.getAttribute("data-category");
            if (selectedCategory === activeCategory) return;

            // Update tab styling
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Fade grid out, switch photos, fade back in
            galleryGrid.classList.add("fade-out");
            activeCategory = selectedCategory;

            setTimeout(() => {
                loadPhotos(activeCategory);
                galleryGrid.classList.remove("fade-out");
            }, 300);
        });
    });

    // Load More button click event
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            paginationState[activeCategory]++;
            loadPhotos(activeCategory, true); // true = append batch
        });
    }

    // Lightbox events setup
    setupLightbox();
}

// Calculate total photos in categories dynamically
function getCategoryPhotos(category) {
    let photos = [];

    // Check if we have automatically scanned media lists from update_media.ps1 or generate_thumbs.py
    if (window.MEDIA_DATA) {
        let list = [];
        if (category === "retouchees") {
            list = window.MEDIA_DATA.photosRetouchees || [];
        } else if (category === "invitees") {
            list = window.MEDIA_DATA.photosInvitees || [];
        } else if (category === "normales") {
            list = window.MEDIA_DATA.photosNormales || [];
        }

        if (list.length > 0) {
            return list.map((photo, i) => {
                // If it is already a structured object from generate_thumbs.py
                if (typeof photo === 'object' && photo.thumb) {
                    let caption = photo.caption;
                    if (!caption) {
                        const parts = photo.thumb.split('/');
                        const filename = parts[parts.length - 1];
                        caption = filename.substring(0, filename.lastIndexOf('.')) || filename;
                    }
                    return {
                        thumb: photo.thumb,
                        medium: photo.medium,
                        original: photo.original,
                        aspectRatio: photo.aspectRatio || 1.333,
                        caption: caption
                    };
                }

                // Fallback for old string registry (update_media.ps1 format)
                const parts = photo.split('/');
                const filename = parts[parts.length - 1];
                const cleanName = filename.substring(0, filename.lastIndexOf('.')) || filename;
                return {
                    thumb: photo,
                    medium: photo,
                    original: photo,
                    aspectRatio: 1.333,
                    caption: cleanName
                };
            });
        }
    }

    // Fallback if media_list.js is missing or empty
    if (CONFIG.sequentialConfig.enabled) {
        let count = 0;
        let folder = "";

        if (category === "retouchees") {
            count = CONFIG.sequentialConfig.retoucheesCount;
            folder = "media/photos-retouchees/";
        } else if (category === "invitees") {
            count = CONFIG.sequentialConfig.inviteesCount;
            folder = "media/photos-invitees/";
        } else if (category === "normales") {
            count = CONFIG.sequentialConfig.normalesCount;
            folder = "media/photos-normales/";
        }

        const ext = CONFIG.sequentialConfig.extension;
        for (let i = 1; i <= count; i++) {
            photos.push({
                thumb: `${folder}photo${i}.${ext}`,
                medium: `${folder}photo${i}.${ext}`,
                original: `${folder}photo${i}.${ext}`,
                aspectRatio: 1.333,
                caption: `Photo #${i}`
            });
        }
    } else {
        const manual = CONFIG.manualPhotosList[category] || [];
        photos = manual.map(photo => ({
            thumb: photo.url,
            medium: photo.url,
            original: photo.url,
            aspectRatio: 1.333,
            caption: photo.caption
        }));
    }

    return photos;
}

// Update the photo counts in the HTML buttons
function updateCategoryCounts() {
    const countRetouchees = document.getElementById("count-retouchees");
    const countInvitees = document.getElementById("count-invitees");
    const countNormales = document.getElementById("count-normales");

    if (countRetouchees) countRetouchees.textContent = `(${getCategoryPhotos("retouchees").length})`;
    if (countInvitees) countInvitees.textContent = `(${getCategoryPhotos("invitees").length})`;
    if (countNormales) countNormales.textContent = `(${getCategoryPhotos("normales").length})`;
}

// Load and render photos for a category
function loadPhotos(category, append = false) {
    const galleryGrid = document.getElementById("gallery-grid");
    const noPhotosMessage = document.getElementById("no-photos-message");
    const loadMoreBtn = document.getElementById("btn-load-more");

    if (!galleryGrid) return;

    if (!append) {
        galleryGrid.innerHTML = "";
        paginationState[category] = 1;
    }

    const fullList = getCategoryPhotos(category);

    if (fullList.length === 0) {
        galleryGrid.style.display = "none";
        if (noPhotosMessage) noPhotosMessage.style.display = "block";
        if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
        return;
    }

    galleryGrid.style.display = "grid";
    if (noPhotosMessage) noPhotosMessage.style.display = "none";

    activePhotosList = fullList;

    // Paginate slicing
    const startIdx = append ? (paginationState[category] - 1) * PAGE_SIZE : 0;
    const endIdx = Math.min(paginationState[category] * PAGE_SIZE, fullList.length);
    const batch = fullList.slice(startIdx, endIdx);

    batch.forEach((photo, relativeIndex) => {
        const globalIndex = startIdx + relativeIndex;
        const item = document.createElement("div");
        item.className = "gallery-item animate-on-scroll";
        item.setAttribute("data-index", globalIndex);

        // Show lightweight thumbnail WebP and lazy load
        item.innerHTML = `
            <img src="${photo.thumb}" alt="${photo.caption}" class="gallery-img" loading="lazy" onerror="handleImageError(this)">
            <div class="gallery-overlay">
                <div class="gallery-overlay-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M9,6H10V9H13V10H10V13H9V10H6V9H9V6Z"/>
                    </svg>
                </div>
                <h4 class="gallery-item-title">${photo.caption}</h4>
                <span class="gallery-item-category">${getCategoryLabel(category)}</span>
            </div>
        `;

        // Shimmer loading complete event
        const img = item.querySelector(".gallery-img");
        if (img) {
            img.addEventListener("load", () => {
                item.classList.add("loaded");
            });
            if (img.complete) {
                item.classList.add("loaded");
            }
        }

        // Click event to open lightbox at target global index
        item.addEventListener("click", () => {
            openLightbox(globalIndex);
        });

        galleryGrid.appendChild(item);

        // Staggered animate transition
        setTimeout(() => {
            if (!img || img.complete) {
                item.classList.add("loaded");
            }
            item.classList.add("visible");
        }, 30 * relativeIndex);
    });

    // Manage Load More button visibility
    if (loadMoreBtn) {
        if (endIdx < fullList.length) {
            loadMoreBtn.classList.remove("hidden");
        } else {
            loadMoreBtn.classList.add("hidden");
        }
    }

    // Reinitialize scroll animations for new elements
    if (typeof setupScrollAnimations === "function") {
        setupScrollAnimations();
    }
}

// Convert category key to human-readable text
function getCategoryLabel(category) {
    if (category === "retouchees") return "Photos Retouchées";
    if (category === "invitees") return "Photos des Invités";
    return "Photos Casual";
}

// Handle image loading error (graceful placeholders)
function handleImageError(img) {
    // If the image fails to load (e.g. they didn't upload files yet), show a elegant placeholder card
    img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23FFF0F2'/><text x='50' y='45' font-family='serif' font-size='5' fill='%23C5A059' text-anchor='middle'>S &amp; O</text><text x='50' y='55' font-family='sans-serif' font-size='3' fill='%236E6E6E' text-anchor='middle'>Insérer une image ici</text></svg>";
    img.onerror = null; // Prevent infinite loop
}

// 4. LIGHTBOX FUNCTIONALITY
function setupLightbox() {
    const lightbox = document.getElementById("lightbox");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    if (!lightbox) return;

    // Close button click
    closeBtn.addEventListener("click", closeLightbox);

    // Outside click close
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content-wrapper")) {
            closeLightbox();
        }
    });

    // Navigation clicks
    prevBtn.addEventListener("click", prevImage);
    nextBtn.addEventListener("click", nextImage);

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") closeLightbox();
    });

    // Mobile swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swiped Left -> Next
            nextImage();
        }
        if (touchEndX > touchStartX + threshold) {
            // Swiped Right -> Prev
            prevImage();
        }
    }
}

function openLightbox(index) {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightboxActiveIndex = index;
    updateLightboxContent();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Disable background scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable background scrolling
}

function prevImage() {
    if (activePhotosList.length <= 1) return;
    lightboxActiveIndex = (lightboxActiveIndex - 1 + activePhotosList.length) % activePhotosList.length;
    updateLightboxContent();
}

function nextImage() {
    if (activePhotosList.length <= 1) return;
    lightboxActiveIndex = (lightboxActiveIndex + 1) % activePhotosList.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const imgElement = document.getElementById("lightbox-img");
    const captionElement = document.getElementById("lightbox-caption");
    const counterElement = document.getElementById("lightbox-counter");
    const downloadElement = document.getElementById("lightbox-download");

    if (!imgElement || !captionElement || !counterElement) return;

    const photo = activePhotosList[lightboxActiveIndex];

    // Transition effect on image change
    imgElement.style.opacity = "0";
    imgElement.style.transform = "scale(0.95)";

    setTimeout(() => {
        // Load optimized medium resolution in lightbox
        imgElement.src = photo.medium;
        imgElement.alt = photo.caption;
        captionElement.textContent = photo.caption;
        counterElement.textContent = `${lightboxActiveIndex + 1} / ${activePhotosList.length}`;

        // Update download button to point to the medium-res WebP (which exists in the repo)
        if (downloadElement) {
            downloadElement.setAttribute("href", photo.medium);
            const filename = photo.medium.split('/').pop();
            downloadElement.setAttribute("download", filename);
        }

        // Configure full HD album Google Drive link if set
        const albumLinkElement = document.getElementById("lightbox-album-link");
        if (albumLinkElement) {
            const albumUrl = CONFIG.EXTERNAL_HD_ALBUM_URL;
            if (albumUrl && albumUrl !== "" && !albumUrl.includes("your-shared-google-drive-album-link")) {
                albumLinkElement.setAttribute("href", albumUrl);
                albumLinkElement.style.display = "flex";
            } else {
                albumLinkElement.style.display = "none";
            }
        }

        imgElement.style.opacity = "1";
        imgElement.style.transform = "scale(1)";

        // Preload next/prev images in background cache
        preloadAdjacentImages();
    }, 150);
}

function preloadAdjacentImages() {
    if (activePhotosList.length <= 1) return;
    const nextIndex = (lightboxActiveIndex + 1) % activePhotosList.length;
    const prevIndex = (lightboxActiveIndex - 1 + activePhotosList.length) % activePhotosList.length;

    const nextImg = new Image();
    nextImg.src = activePhotosList[nextIndex].medium;

    const prevImg = new Image();
    prevImg.src = activePhotosList[prevIndex].medium;
}

// 5. VIDEO SECTION INTEGRATIONS
function setupVideoSections() {
    // Bind Best Of Google Drive preview link to the iframe source
    const bestOfIframe = document.getElementById("best-of-iframe");
    if (bestOfIframe) {
        bestOfIframe.src = CONFIG.BEST_OF_VIDEO_URL;
    }

    // Full wedding video configuration mapping
    setupFullWeddingVideo();
}

function setupFullWeddingVideo() {
    const fullVideoArea = document.getElementById("full-video-area");
    const watchButton = document.getElementById("btn-watch-full");

    if (!fullVideoArea) return;

    const url = CONFIG.FULL_VIDEO_URL;

    // Check link type and inject iframe for embeds (YouTube/Vimeo)
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i;

    const ytMatch = url.match(ytRegex);
    const vimeoMatch = url.match(vimeoRegex);

    if (ytMatch && ytMatch[1]) {
        // Embed YouTube video
        const videoId = ytMatch[1];
        fullVideoArea.innerHTML = `
            <div class="iframe-wrapper">
                <iframe src="https://www.youtube.com/embed/${videoId}?rel=0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
            </div>
        `;
    } else if (vimeoMatch && vimeoMatch[1]) {
        // Embed Vimeo video
        const videoId = vimeoMatch[1];
        fullVideoArea.innerHTML = `
            <div class="iframe-wrapper">
                <iframe src="https://player.vimeo.com/video/${videoId}?color=C5A059&title=0&byline=0&portrait=0" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowfullscreen></iframe>
            </div>
        `;
    } else {
        // Fallback or Generic Link (Google Drive, Dropbox, iCloud)
        if (watchButton) {
            watchButton.setAttribute("href", url);
        }
    }
}

// 6. FLOATING BACKGROUND MUSIC CONTROLLER
function setupBackgroundMusic() {
    const music = document.getElementById("bg-music");
    const toggleBtn = document.getElementById("music-toggle");
    const mutedIcon = document.getElementById("music-icon-muted");
    const playingIcon = document.getElementById("music-icon-playing");

    if (!music || !toggleBtn) return;

    // Map source path
    const audioSource = music.querySelector("source");
    if (audioSource) {
        audioSource.src = CONFIG.musicPath;
        music.load(); // Reload audio with config musicPath
    }

    toggleBtn.addEventListener("click", () => {
        if (music.paused) {
            // Play Audio
            music.play().then(() => {
                mutedIcon.style.display = "none";
                playingIcon.style.display = "flex";
                toggleBtn.classList.add("music-playing-animation");
            }).catch(err => {
                console.log("Lecture audio bloquée par le navigateur. Interaction requise.", err);
                alert("Impossible de lire la musique de fond. Assurez-vous d'avoir placé votre fichier musique dans ./media/music.mp3");
            });
        } else {
            // Pause Audio
            music.pause();
            mutedIcon.style.display = "flex";
            playingIcon.style.display = "none";
            toggleBtn.classList.remove("music-playing-animation");
        }
    });
}

// 7. SCROLL FADE-IN ANIMATIONS (INTERSECTION OBSERVER)
function setupScrollAnimations() {
    const animElements = document.querySelectorAll(".animate-on-scroll");

    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null, // viewport
            threshold: 0.15, // trigger when 15% visible
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // Trigger animation once
                }
            });
        }, observerOptions);

        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animElements.forEach(el => el.classList.add("visible"));
    }
}

// 8. WEBSITE SHARING FEATURE
function setupShareFeatures() {
    const toggleBtn = document.getElementById("share-toggle");
    const navBtn = document.getElementById("nav-share");
    const footerBtn = document.getElementById("footer-share");
    const closeBtn = document.getElementById("share-modal-close");
    const copyBtn = document.getElementById("share-copy");
    const modal = document.getElementById("share-modal");

    if (toggleBtn) toggleBtn.addEventListener("click", handleShare);
    if (navBtn) navBtn.addEventListener("click", handleShare);
    if (footerBtn) footerBtn.addEventListener("click", handleShare);

    if (closeBtn) closeBtn.addEventListener("click", closeShareModal);
    if (copyBtn) copyBtn.addEventListener("click", copyWebsiteLink);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("share-modal-content")) {
                closeShareModal();
            }
        });
    }
}

function handleShare(e) {
    if (e) e.preventDefault();

    const shareData = {
        title: "Sanae & Omar - 27.12.2025",
        text: "Revivez le mariage de Sanae & Omar en photos et vidéos !",
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch(err => console.log('Error sharing:', err));
    } else {
        openShareModal();
    }
}

function openShareModal() {
    const modal = document.getElementById("share-modal");
    if (!modal) return;

    const currentUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Revivez le mariage de Sanae & Omar - 27.12.2025 en photos et vidéos ! ");

    const waBtn = document.getElementById("share-wa");
    const fbBtn = document.getElementById("share-fb");
    const emailBtn = document.getElementById("share-email");

    if (waBtn) waBtn.href = `https://wa.me/?text=${text}${currentUrl}`;
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    if (emailBtn) emailBtn.href = `mailto:?subject=Mariage%20Sanae%20%26%20Omar&body=${text}%0A${currentUrl}`;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeShareModal() {
    const modal = document.getElementById("share-modal");
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
}

function copyWebsiteLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            showShareToast();
            closeShareModal();
        })
        .catch(err => {
            // Fallback copy execution for older devices
            const el = document.createElement('textarea');
            el.value = url;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            showShareToast();
            closeShareModal();
        });
}

function showShareToast() {
    const toast = document.getElementById("share-toast");
    if (toast) {
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }
}
