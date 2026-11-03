// ==========================================================================
// Products Module - Packing Materials Section (Alisha Plastics)
// ==========================================================================
// Loads packing materials from Cloud Firestore dynamically.
// If no items are in the database yet, retains or displays the default items.
// ==========================================================================

const defaultPackingMaterials = [
  { name: 'Stretch Film', imageUrl: 'images/stretch-film.jpg' },
  { name: 'Bubble Wrap', imageUrl: 'images/bubble-wrap.jpg' },
  { name: 'Packing Tape', imageUrl: 'images/packing-tape.jpg' },
  { name: 'Air Bubble Sheet', imageUrl: 'images/air-bubble-sheet.jpg' },
  { name: 'Shrink Film', imageUrl: 'images/shrink-film.jpg' },
  { name: 'Poly Bags', imageUrl: 'images/poly-bags.jpg' }
];

function renderPackingCard(item) {
  const card = document.createElement('div');
  card.className = 'pk-item';

  const img = document.createElement('img');
  img.src = item.imageUrl;
  img.alt = item.name || 'Packing Material';
  img.loading = 'lazy';
  // Fallback if image fails to load
  img.onerror = () => {
    img.src = 'images/packing-materials.jpg';
  };

  const span = document.createElement('span');
  span.textContent = item.name || 'Packing Item';

  card.appendChild(img);
  card.appendChild(span);
  return card;
}

function initPackingMaterials() {
  const grid = document.getElementById('pk-grid') || document.querySelector('.pk-grid');
  if (!grid) return;

  // If Firebase is configured, fetch items in real time from Firestore
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && db) {
    db.collection('packing_materials')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            grid.innerHTML = '';
            snapshot.forEach((doc) => {
              const data = doc.data();
              grid.appendChild(renderPackingCard(data));
            });
          } else {
            // Keep existing HTML items or load defaults if grid is empty
            if (!grid.children.length) {
              defaultPackingMaterials.forEach((item) => {
                grid.appendChild(renderPackingCard(item));
              });
            }
          }
        },
        (error) => {
          console.warn('Could not load packing materials from Firestore:', error.message);
          // If error occurs, keep default items
        }
      );
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPackingMaterials);
} else {
  initPackingMaterials();
}
