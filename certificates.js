document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("certificateSearch");
  const cards = [...document.querySelectorAll(".certificate-card")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const resultCount = document.getElementById("resultCount");
  const resultsMessage = document.getElementById("resultsMessage");
  const emptyState = document.getElementById("emptyState");
  const grid = document.getElementById("galleryGrid");
  let activeFilter = "all";

  function filterCards() {
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesType = activeFilter === "all" || card.dataset.kind === activeFilter;
      const matchesText = !query || (card.dataset.search + " " + card.innerText).toLowerCase().includes(query);
      const show = matchesType && matchesText;
      card.hidden = !show;
      if (show) visible++;
    });
    resultCount.textContent = `(${visible})`;
    resultsMessage.textContent = `Showing ${visible} of ${cards.length} file${cards.length === 1 ? "" : "s"}${query ? ` matching “${query}”` : ""}.`;
    emptyState.hidden = visible !== 0;
    grid.hidden = visible === 0;
  }

  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    filterCards();
  }));
  search?.addEventListener("input", filterCards);
  document.getElementById("resetFilters")?.addEventListener("click", () => {
    if (search) search.value = "";
    activeFilter = "all";
    filterButtons.forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
    filterCards();
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search?.focus();
    }
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDownload = document.getElementById("lightboxDownload");
  const closeButton = document.getElementById("lightboxClose");
  let lastFocused = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxContent.replaceChildren();
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  document.querySelectorAll("[data-preview]").forEach(button => button.addEventListener("click", () => {
    const file = button.dataset.preview;
    const image = document.createElement("img");
    image.src = file;
    image.alt = button.getAttribute("aria-label") || "Certificate preview";
    lightboxContent.replaceChildren(image);
    lightboxTitle.textContent = button.getAttribute("aria-label") || "Certificate preview";
    lightboxDownload.href = file;
    lightboxDownload.download = file;
    lastFocused = button;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }));
  closeButton?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox(); });
  filterCards();
});