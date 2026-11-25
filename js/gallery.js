
/* =========================================
   SELENA MASSAGE SPA
   GALLERY.JS — PART 1
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       CHECK GALLERY PAGE
    ===================================== */

    const galleryPage = document.querySelector(".gallery-page");

    if (!galleryPage) {
        return;
    }


    /* =====================================
       GALLERY FILTER ELEMENTS
    ===================================== */

    const filterButtons = document.querySelectorAll(".gallery-filter");

    const galleryItems = document.querySelectorAll(
        ".gallery-page-item"
    );


    /* =====================================
       GALLERY FILTER FUNCTION
    ===================================== */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedFilter = button.dataset.filter;

            // Update active filter button
            filterButtons.forEach(function (filterButton) {
                filterButton.classList.remove("active");
            });

            button.classList.add("active");


            // Filter gallery images
            galleryItems.forEach(function (item) {

                const itemCategory = item.dataset.category;

                if (
                    selectedFilter === "all" ||
                    itemCategory === selectedFilter
                ) {

                    item.classList.remove("hide-item");
                    item.classList.add("show-item");
                    item.classList.add("is-visible");

                } else {

                    item.classList.remove("show-item");
                    item.classList.add("hide-item");

                }

            });

        });

    });



    /* =====================================
       LIGHTBOX ELEMENTS
    ===================================== */

    const lightbox = document.getElementById("gallery-lightbox");

    const lightboxImage = document.getElementById("lightbox-image");

    const lightboxCaption = document.getElementById("lightbox-caption");

    const closeButton = document.querySelector(".lightbox-close");

    const previousButton = document.querySelector(".lightbox-prev");

    const nextButton = document.querySelector(".lightbox-next");

    const viewButtons = document.querySelectorAll(".gallery-view-btn");


    // Stop if the lightbox HTML is missing
    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxCaption
    ) {
        return;
    }


    /* =====================================
       LIGHTBOX VARIABLES
    ===================================== */

    let currentIndex = 0;

    let visibleGalleryItems = [];

    let lastFocusedElement = null;


    /* =====================================
       GET VISIBLE GALLERY ITEMS
    ===================================== */

    function getVisibleGalleryItems() {

        visibleGalleryItems = Array.from(galleryItems).filter(
            function (item) {
                return !item.classList.contains("hide-item");
            }
        );

        return visibleGalleryItems;

    }


    /* =====================================
       OPEN LIGHTBOX
    ===================================== */

    function openLightbox(item) {

        getVisibleGalleryItems();

        currentIndex = visibleGalleryItems.indexOf(item);

        if (currentIndex === -1) {
            return;
        }

        const image = item.querySelector("img");

        if (!image) {
            return;
        }

        const heading = item.querySelector("h3");

        const imageSource = image.currentSrc || image.src;

        const imageAlt = image.alt || "Selena Massage Spa gallery image";

        const caption = heading
            ? heading.textContent.trim()
            : imageAlt;


        // Save the element that was focused
        lastFocusedElement = document.activeElement;


        // Display selected image
        lightboxImage.src = imageSource;

        lightboxImage.alt = imageAlt;

        lightboxCaption.textContent = caption;


        // Show lightbox
        lightbox.classList.add("active");

        lightbox.setAttribute("aria-hidden", "false");

        lightbox.setAttribute("role", "dialog");

        lightbox.setAttribute("aria-modal", "true");

        document.body.classList.add("gallery-lightbox-open");


        // Focus close button
        if (closeButton) {
            closeButton.focus();
        }

    }



    /* =====================================
       CLOSE LIGHTBOX
    ===================================== */

    function closeLightbox() {

        lightbox.classList.remove("active");

        lightbox.setAttribute("aria-hidden", "true");

        lightbox.removeAttribute("aria-modal");

        document.body.classList.remove("gallery-lightbox-open");

        lightboxImage.src = "";

        lightboxCaption.textContent = "";


        // Return focus to the previous element
        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function"
        ) {
            lastFocusedElement.focus();
        }

    }



    /* =====================================
       SHOW SELECTED LIGHTBOX IMAGE
    ===================================== */

    function showLightboxImage(index) {

        getVisibleGalleryItems();

        if (visibleGalleryItems.length === 0) {
            closeLightbox();
            return;
        }


        // Keep index inside available images
        if (index >= visibleGalleryItems.length) {
            currentIndex = 0;

        } else if (index < 0) {

            currentIndex = visibleGalleryItems.length - 1;

        } else {

            currentIndex = index;

        }


        const selectedItem = visibleGalleryItems[currentIndex];

        const image = selectedItem.querySelector("img");

        const heading = selectedItem.querySelector("h3");

        if (!image) {
            return;
        }


        lightboxImage.src = image.currentSrc || image.src;

        lightboxImage.alt = image.alt || "Gallery photograph";

        lightboxCaption.textContent = heading
            ? heading.textContent.trim()
            : lightboxImage.alt;

    }



    /* =====================================
       NEXT IMAGE
    ===================================== */

    function showNextImage() {

        showLightboxImage(currentIndex + 1);

    }



    /* =====================================
       PREVIOUS IMAGE
    ===================================== */

    function showPreviousImage() {

        showLightboxImage(currentIndex - 1);

    }



    /* =====================================
       OPEN IMAGE BUTTONS
    ===================================== */

    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const galleryItem = button.closest(".gallery-page-item");

            if (!galleryItem) {
                return;
            }

            openLightbox(galleryItem);

        });

    });



    /* =====================================
       CLOSE BUTTON
    ===================================== */

    if (closeButton) {

        closeButton.addEventListener("click", function () {

            closeLightbox();

        });

    }



    /* =====================================
       NEXT BUTTON
    ===================================== */

    if (nextButton) {

        nextButton.addEventListener("click", function () {

            showNextImage();

        });

    }



    /* =====================================
       PREVIOUS BUTTON
    ===================================== */

    if (previousButton) {

        previousButton.addEventListener("click", function () {

            showPreviousImage();

        });

    }



    /* =====================================
       CLOSE WHEN CLICKING BACKGROUND
    ===================================== */

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });



    /* =====================================
       KEYBOARD CONTROLS
    ===================================== */

    document.addEventListener("keydown", function (event) {

        const lightboxIsOpen = lightbox.classList.contains("active");

        if (!lightboxIsOpen) {
            return;
        }


        // Escape closes lightbox
        if (event.key === "Escape") {

            closeLightbox();

        }


        // Right arrow shows next image
        if (event.key === "ArrowRight") {

            showNextImage();

        }


        // Left arrow shows previous image
        if (event.key === "ArrowLeft") {

            showPreviousImage();

        }

    });



    /* =====================================
       INITIAL GALLERY SETUP
    ===================================== */

    galleryItems.forEach(function (item) {

        item.classList.remove("hide-item");

    });


    // Start with all photos selected
    getVisibleGalleryItems();


    // Make sure lightbox starts closed
    lightbox.classList.remove("active");

    lightbox.setAttribute("aria-hidden", "true");


    console.log("Selena Massage Spa Gallery Loaded Successfully!");

});

