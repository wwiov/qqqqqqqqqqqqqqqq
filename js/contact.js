
/* =========================================
   SELENA MASSAGE SPA
   CONTACT.JS — PART 1
========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       CONTACT FORM ELEMENTS
    ===================================== */

    const contactForm = document.getElementById("contact-form");

    const formStatus = document.getElementById("contact-form-status");

    const submitButton = contactForm
        ? contactForm.querySelector(".contact-submit-btn")
        : null;


    // Stop if contact form does not exist
    if (!contactForm || !formStatus || !submitButton) {
        return;
    }


    /* =====================================
       FORMSPREE SETTINGS
    ===================================== */

    const FORM_ENDPOINT = "https://formspree.io/f/mwlowkyz";


    /* =====================================
       DISPLAY FORM MESSAGE
    ===================================== */

    function showMessage(message, type) {

        formStatus.textContent = message;

        formStatus.className = "contact-form-status " + type;

        formStatus.style.display = "block";

    }


    /* =====================================
       RESET FORM MESSAGE
    ===================================== */

    function clearMessage() {

        formStatus.textContent = "";

        formStatus.className = "contact-form-status";

        formStatus.style.display = "none";

    }


    /* =====================================
       FORM SUBMISSION
    ===================================== */

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Clear previous messages
        clearMessage();


        /* =================================
           CHECK FORM VALIDATION
        ================================= */

        if (!contactForm.checkValidity()) {

            contactForm.reportValidity();

            return;

        }


        /* =================================
           PREVENT MULTIPLE SUBMISSIONS
        ================================= */

        if (submitButton.disabled) {
            return;
        }


        // Save original button text
        const originalButtonHTML = submitButton.innerHTML;


        // Disable button while sending
        submitButton.disabled = true;

        submitButton.innerHTML =
            'Sending Message <i class="fas fa-spinner fa-spin"></i>';


        /* =================================
           COLLECT FORM DATA
        ================================= */

        const formData = new FormData(contactForm);


        // Add subject to Formspree submission
        formData.set(
            "_subject",
            "New Contact Enquiry - Selena Massage Spa"
        );


        /* =================================
           SEND DATA TO FORMSPREE
        ================================= */

        try {

            const response = await fetch(FORM_ENDPOINT, {

                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }

            });


            /* =============================
               CHECK SERVER RESPONSE
            ============================= */

            let result = {};

            try {

                result = await response.json();

            } catch (jsonError) {

                result = {};

            }


            if (response.ok) {

                /* =========================
                   SUCCESS MESSAGE
                ========================= */

                showMessage(
                    "Thank you for contacting Selena Massage Spa! Your message has been submitted successfully. We will review your enquiry.",
                    "success"
                );


                // Clear submitted form fields
                contactForm.reset();


                // Return to the top of the form
                formStatus.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
            });


            } else {

                /* =========================
                   SERVER ERROR
                ========================= */

                let errorMessage =
                    "Your message could not be sent. Please try again.";

                if (result.errors && result.errors.length > 0) {

                    errorMessage = result.errors
                        .map(function (error) {
                            return error.message;
                        })
                        .join(" ");

                }

                showMessage(errorMessage, "error");

            }


        } catch (error) {

            /* =============================
               NETWORK ERROR
            ============================= */

            console.error(
                "Contact form submission error:",
                error
            );

            showMessage(
                "Unable to connect right now. Please check your internet connection and try again.",
                "error"
            );


        } finally {

            /* =============================
               RESTORE SUBMIT BUTTON
            ============================= */

            submitButton.disabled = false;

            submitButton.innerHTML = originalButtonHTML;

        }

    });



    /* =====================================
       CLEAR MESSAGE WHEN USER EDITS FORM
    ===================================== */

    contactForm.addEventListener("input", function () {

        if (
            formStatus.classList.contains("error") ||
            formStatus.classList.contains("success")
        ) {

            clearMessage();

        }

    });


    contactForm.addEventListener("change", function () {

        if (
            formStatus.classList.contains("error") ||
            formStatus.classList.contains("success")
        ) {

            clearMessage();

        }

    });



    /* =====================================
       INITIAL FORM SETUP
    ===================================== */

    clearMessage();

    console.log(
        "Selena Massage Spa Contact Form Loaded Successfully!"
    );

});

