
/* =========================================
   SELENA MASSAGE SPA
   BOOKING.JS — BOOKING ONLY
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. FORM ELEMENTS
    ===================================== */

    const bookingForm = document.getElementById("booking-form");
    const categorySelect = document.getElementById("service-category");
    const serviceSelect = document.getElementById("service-type");
    const amountInput = document.getElementById("service-amount");
    const appointmentDate = document.getElementById("appointment-date");
    const bookingMessage = document.getElementById("booking-message");
    const submitButton = document.getElementById("booking-submit");

    if (!bookingForm) {
        return;
    }


    /* =====================================
       2. FORMSPREE SETTINGS
    ===================================== */

    const FORM_ENDPOINT = "https://formspree.io/f/mwlowkyz";


    /* =====================================
       3. SERVICE PRICES
       
       EDIT THESE PRICES WHENEVER YOU WANT.

       All amounts are in USD.
    ===================================== */

    const services = {

        Massage: [
            {
                name: "Swedish Massage",
                price: 80
            },
            {
                name: "Deep Tissue Massage",
                price: 100
            },
            {
                name: "Hot Stone Massage",
                price: 120
            },
            {
                name: "Aromatherapy Massage",
                price: 90
            },
            {
                name: "Foot Massage",
                price: 60
            },
            {
                name: "Couples Massage",
                price: 180
            }
        ],

        Tattoo: [
            {
                name: "Fine Line Tattoo",
                price: 100
            },
            {
                name: "Floral Tattoo",
                price: 150
            },
            {
                name: "Script Tattoo",
                price: 120
            },
            {
                name: "Geometric Tattoo",
                price: 180
            },
            {
                name: "Blackwork Tattoo",
                price: 200
            },
            {
                name: "Minimalist Tattoo",
                price: 90
            }
        ]

    };


    /* =====================================
       4. GENERATE BOOKING REFERENCE
    ===================================== */

    function generateBookingReference() {

        const randomNumber = Math.floor(
            100000 + Math.random() * 900000
        );

        return "SEL-" + Date.now().toString().slice(-6) + randomNumber;

    }


    /* =====================================
       5. SET MINIMUM APPOINTMENT DATE
    ===================================== */

    if (appointmentDate) {

        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        appointmentDate.min = `${year}-${month}-${day}`;

    }


    /* =====================================
       6. SERVICE CATEGORY SELECTION
    ===================================== */

    if (categorySelect && serviceSelect) {

        categorySelect.addEventListener("change", function () {

            const selectedCategory = categorySelect.value;

            serviceSelect.innerHTML = "";

            if (!selectedCategory || !services[selectedCategory]) {

                serviceSelect.disabled = true;

                serviceSelect.innerHTML = `
                    <option value="">Select a category first</option>
                `;

                amountInput.value = "Select a service to view the amount";

                return;

            }

            serviceSelect.disabled = false;

            serviceSelect.innerHTML = `
                <option value="">Choose your service</option>
            `;

            services[selectedCategory].forEach(function (service) {

                const option = document.createElement("option");

                option.value = service.name;
                option.textContent = service.name;

                serviceSelect.appendChild(option);

            });

            amountInput.value = "Select a service to view the amount";

        });

    }


    /* =====================================
       7. DISPLAY SERVICE PRICE
    ===================================== */

    if (serviceSelect) {

        serviceSelect.addEventListener("change", function () {

            const selectedCategory = categorySelect.value;
            const selectedService = serviceSelect.value;

            if (!selectedCategory || !selectedService) {

                amountInput.value = "Select a service to view the amount";

                return;

            }

            const service = services[selectedCategory].find(function (item) {

                return item.name === selectedService;

            });

            if (service) {

                amountInput.value = "$" + service.price.toFixed(2);

            }

        });

    }


    /* =====================================
       8. BOOKING MESSAGE
    ===================================== */

    function showMessage(message, type) {

        if (!bookingMessage) {
            return;
        }

        bookingMessage.textContent = message;

        bookingMessage.classList.remove(
            "success",
            "error"
        );

        bookingMessage.classList.add(type);

        bookingMessage.style.display = "block";

    }


    /* =====================================
       9. SUBMIT BUTTON LOADING STATE
    ===================================== */

    function setButtonLoading(isLoading) {

        if (!submitButton) {
            return;
        }

        const buttonText = submitButton.querySelector("span");

        if (isLoading) {

            submitButton.disabled = true;

            if (buttonText) {
                buttonText.textContent = "Submitting Booking...";
            }

        } else {

            submitButton.disabled = false;

            if (buttonText) {
                buttonText.textContent = "Submit Booking Request";
            }

        }

    }


    /* =====================================
       10. FORM SUBMISSION
    ===================================== */

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!bookingForm.checkValidity()) {

            bookingForm.reportValidity();

            return;

        }

        const selectedCategory = categorySelect.value;
        const selectedService = serviceSelect.value;

        if (
            !selectedCategory ||
            !services[selectedCategory] ||
            !selectedService
        ) {

            showMessage(
                "Please select your service category and service.",
                "error"
            );

            return;

        }

        const service = services[selectedCategory].find(function (item) {

            return item.name === selectedService;

        });

        if (!service) {

            showMessage(
                "Please select a valid service.",
                "error"
            );

            return;

        }

        const bookingReference = generateBookingReference();

        const formData = new FormData(bookingForm);

        // Ensure the submitted amount matches the selected service.
        formData.set(
            "service_amount",
            "$" + service.price.toFixed(2) + " USD"
        );

        formData.set(
            "booking_reference",
            bookingReference
        );

        formData.set(
            "booking_status",
            "Awaiting review"
        );

        formData.set(
            "_subject",
            "New Booking - " + bookingReference + " - Selena Massage Spa"
        );

        setButtonLoading(true);

        if (bookingMessage) {
            bookingMessage.style.display = "none";
        }

        try {

            const response = await fetch(FORM_ENDPOINT, {

                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }

            });

            if (response.ok) {

                // Save the reference in the browser for the next payment step.
                try {

                    sessionStorage.setItem(
                        "selenaBookingReference",
                        bookingReference
                    );

                    sessionStorage.setItem(
                        "selenaBookingEmail",
                        document.getElementById("customer-email").value.trim()
                    );

                    sessionStorage.setItem(
                        "selenaBookingAmount",
                        "$" + service.price.toFixed(2) + " USD"
                    );

                    sessionStorage.setItem(
                        "selenaBookingName",
                        document.getElementById("customer-name").value.trim()
                    );

                } catch (storageError) {

                    console.warn(
                        "Booking details could not be saved in this browser.",
                        storageError
                    );

                }

                showMessage(
                    "Your booking request has been submitted successfully. Your reference is " +
                    bookingReference +
                    ". You can now continue to the payment page.",
                    "success"
                );

                // Replace the submit button with a payment-page link.
                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML = `
                        <span>Continue to Payment</span>
                        <i class="fas fa-arrow-right"></i>
                    `;

                    submitButton.type = "button";

                    submitButton.addEventListener("click", function () {

                        window.location.href = "payment.html";

                    }, { once: true });

                }

                // Prevent accidental duplicate booking submissions.
                bookingForm.querySelectorAll("input, select, textarea").forEach(function (field) {

                    field.disabled = true;

                });

                // Keep the payment button available.
                if (submitButton) {
                    submitButton.disabled = false;
                }

            } else {

                let errorMessage = "Your booking could not be submitted. Please try again.";

                try {

                    const result = await response.json();

                    if (result.errors && result.errors.length > 0) {

                        errorMessage = result.errors.map(function (error) {
                            return error.message;
                        }).join(" ");

                    }

                } catch (error) {

                    console.warn("Could not read the Formspree error response.");

                }

                showMessage(errorMessage, "error");

                setButtonLoading(false);

            }

        } catch (error) {

            console.error("Booking submission error:", error);

            showMessage(
                "A network error occurred. Please check your internet connection and try again.",
                "error"
            );

            setButtonLoading(false);

        }

    });


    /* =====================================
       11. CLEAR MESSAGE WHEN FORM CHANGES
    ===================================== */

    bookingForm.addEventListener("input", function () {

        if (
            bookingMessage &&
            bookingMessage.classList.contains("error")
        ) {

            bookingMessage.style.display = "none";

        }

    });


    /* =====================================
       12. PAGE READY
    ===================================== */

    console.log(
        "Selena Massage Spa - Booking system loaded successfully."
    );

});
