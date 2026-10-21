const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeButton = document.getElementById('lightbox-close');
const tocList = document.getElementById('toc-list');
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
const headingCounts = new Map();
document.querySelectorAll('.page h2, .page h3').forEach((heading) => {
  const base = slugify(heading.textContent) || 'section';
  const count = headingCounts.get(base) || 0;
  headingCounts.set(base, count + 1);
  heading.id = count === 0 ? base : `${base}-${count + 1}`;
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = `#${heading.id}`;
  link.textContent = heading.textContent;
  if (heading.tagName === 'H3') {
    link.className = 'sub';
  }
  item.appendChild(link);
  tocList.appendChild(item);
});
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.removeAttribute('src');
  lightboxImage.removeAttribute('alt');
}
document.querySelectorAll('img.zoomable').forEach((img) => {
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
closeButton.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});
// Link to the other page at the bottom of the contents panel.
const toc = document.querySelector('.toc');
if (toc && toc.dataset.otherHref) {
  const item = document.createElement('li');
  item.className = 'toc-other';
  const link = document.createElement('a');
  link.href = toc.dataset.otherHref;
  link.textContent = toc.dataset.otherLabel;
  item.appendChild(link);
  tocList.appendChild(item);
}
// Old links to appendix sections on the main page now live on the evidence page.
if (location.hash && !location.pathname.includes('/evidence/')) {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!document.getElementById(id)) {
    location.replace('evidence/' + location.hash);
  }
}
// "Back to the article": return to the exact spot if the reader came from the article.
document.querySelectorAll('a.back-to-article').forEach((link) => {
  link.addEventListener('click', (event) => {
    const ref = document.referrer;
    if (ref && ref.startsWith(location.origin) && !ref.includes('/evidence/') && history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
});
