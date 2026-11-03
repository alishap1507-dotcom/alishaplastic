// ==========================================================================
// Gallery Module - Photos & Videos Grid with Lightbox (Alisha Plastics)
// ==========================================================================
// Loads photos and videos dynamically from Cloud Firestore.
// Shows 8 items initially with a "Show More" / "Show Less" toggle button.
// Lazy-loads media, handles video metadata/play icon, and lightbox preview.
// ==========================================================================

const defaultGalleryItems = [
  { src: 'images/shade-net.jpg', type: 'image' },
  { src: 'images/tarpaulin.jpg', type: 'image' },
  { src: 'images/garden-pipe.jpg', type: 'image' },
  { src: 'images/aluminium-bag.jpg', type: 'image' },
  { src: 'images/ldpe-vci.jpg', type: 'image' },
  { src: 'images/machine-cover-new.jpg', type: 'image' },
  { src: 'images/packing-materials.jpg', type: 'image' },
  { src: 'images/stretch-film.jpg', type: 'image' },
  { src: 'images/bubble-wrap.jpg', type: 'image' },
  { src: 'images/packing-tape.jpg', type: 'image' },
  { src: 'images/air-bubble-sheet.jpg', type: 'image' },
  { src: 'images/shrink-film.jpg', type: 'image' },
  { src: 'images/poly-bags.jpg', type: 'image' }
];

function initGallery() {
  const grid = document.getElementById('ggrid');
  const lb = document.getElementById('lb');
  const lbc = document.getElementById('lbc');
  const lbx = document.getElementById('lbx');
  const toggleBtn = document.getElementById('gallery-toggle-btn');

  if (!grid || !lb || !lbc) return;

  let allGalleryItems = [];
  let isExpanded = false;

  function closeLightbox() {
    lb.classList.remove('open');
    lbc.innerHTML = '';
  }

  if (lbx) lbx.onclick = closeLightbox;
  lb.onclick = (e) => {
    if (e.target === lb) closeLightbox();
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function renderGalleryItem(item) {
    const isVideo = item.type === 'video' || (item.url && item.url.includes('.mp4')) || item.video;
    const mediaUrl = item.url || item.src;

    const div = document.createElement('div');
    div.className = 'gitem' + (isVideo ? ' vid' : '');

    if (isVideo) {
      // Videos show thumbnail at 0.5s, play controls on click, DO NOT autoplay
      const video = document.createElement('video');
      video.src = mediaUrl + (mediaUrl.includes('#') ? '' : '#t=0.5');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      div.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = mediaUrl;
      img.alt = 'Alisha Plastics Gallery';
      img.loading = 'lazy';
      div.appendChild(img);
    }

    // Lightbox click handler
    div.onclick = () => {
      lbc.innerHTML = '';
      if (isVideo) {
        const modalVideo = document.createElement('video');
        modalVideo.src = mediaUrl;
        modalVideo.controls = true;
        modalVideo.playsInline = true;
        modalVideo.preload = 'metadata';
        // Does not autoplay automatically
        lbc.appendChild(modalVideo);
      } else {
        const modalImg = document.createElement('img');
        modalImg.src = mediaUrl;
        modalImg.alt = 'Enlarged View';
        lbc.appendChild(modalImg);
      }
      lb.classList.add('open');
    };

    return div;
  }

  function updateGalleryDisplay() {
    grid.innerHTML = '';
    const total = allGalleryItems.length;
    const countToShow = isExpanded ? total : Math.min(8, total);

    for (let i = 0; i < countToShow; i++) {
      grid.appendChild(renderGalleryItem(allGalleryItems[i]));
    }

    // Toggle button visibility & text
    if (toggleBtn) {
      if (total > 8) {
        toggleBtn.style.display = 'inline-block';
        toggleBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
      } else {
        toggleBtn.style.display = 'none';
      }
    }
  }

  // Handle Show More / Show Less click
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      if (isExpanded) {
        isExpanded = false;
        updateGalleryDisplay();
        // Smoothly scroll back to the top of the gallery section
        const gallerySec = document.getElementById('gallery');
        if (gallerySec) {
          gallerySec.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        isExpanded = true;
        updateGalleryDisplay();
      }
    };
  }

  // Load from Firestore if configured
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && db) {
    db.collection('gallery')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          allGalleryItems = [];
          if (!snapshot.empty) {
            snapshot.forEach((doc) => {
              allGalleryItems.push(doc.data());
            });
          } else {
            // Use default items if collection is empty
            allGalleryItems = [...defaultGalleryItems];
          }
          updateGalleryDisplay();
        },
        (error) => {
          console.warn('Could not load gallery from Firestore:', error.message);
          allGalleryItems = [...defaultGalleryItems];
          updateGalleryDisplay();
        }
      );
  } else {
    // Default fallback items
    allGalleryItems = [...defaultGalleryItems];
    updateGalleryDisplay();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  initGallery();
}
