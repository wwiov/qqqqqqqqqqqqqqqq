
/* =========================================
   SELENA MASSAGE SPA
   TERMS AND CONDITIONS PAGE
   TERMS.JS — COMPLETE VERSION
========================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       1. AUTOMATIC COPYRIGHT YEAR
    ====================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================
       2. ACTIVE NAVIGATION LINK
    ====================================== */

    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (linkPage === "terms.html") {

            link.classList.add("active");

            link.setAttribute("aria-current", "page");

        }

    });


    /* =====================================
       3. EXTERNAL LINK SAFETY
    ====================================== */

    const externalLinks = document.querySelectorAll(
        '.terms-page a[href^="http"]'
    );

    externalLinks.forEach(function (link) {

        link.setAttribute("rel", "noopener noreferrer");

    });


    /* =====================================
       4. CONSOLE MESSAGE
    ====================================== */

    console.log(
        "Selena Massage Spa - Terms and Conditions page loaded successfully."
    );


});

