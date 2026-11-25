
/* =========================================
   SELENA MASSAGE SPA WITH TATTOO
   PAYMENT.JS — COMPLETE VERSION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. GET HTML ELEMENTS
    ===================================== */

    const paymentForm = document.getElementById("payment-form");

    if (!paymentForm) return;

    const bookingReference = document.getElementById("booking-reference");
    const customerName = document.getElementById("payment-customer-name");
    const customerEmail = document.getElementById("payment-customer-email");
    const paymentAmount = document.getElementById("payment-amount");

    const paymentMethod = document.getElementById("payment-method");
    const transactionReference = document.getElementById("transaction-reference");

    const paymentProof = document.getElementById("payment-proof");
    const proofPreview = document.getElementById("payment-proof-preview");

    const paymentMessage = document.getElementById("payment-message");
    const submitButton = document.getElementById("payment-submit");

    const btcDetails = document.getElementById("btc-details");
    const usdtDetails = document.getElementById("usdt-details");
    const cardDetails = document.getElementById("card-details");

    const summaryReference = document.getElementById("summary-booking-reference");
    const summaryName = document.getElementById("summary-customer-name");
    const summaryEmail = document.getElementById("summary-customer-email");
    const summaryAmount = document.getElementById("summary-booking-amount");

    const copyWalletButton = document.getElementById("copy-wallet-button");


    /* =====================================
       2. PAYMENT CONFIGURATION
    ===================================== */

    const PAYMENT_FORM_ENDPOINT =
        "https://formspree.io/f/xwloyqlb";

    const BTC_WALLET_ADDRESS =
        "bc1qqk50lap6aygnkkwxqvnyjdw7k2n0h0rjex9l0n";

    // Add the real USDT wallet and network when available.
    const USDT_WALLET_ADDRESS = "";
    const USDT_NETWORK = "";

    // Add a legitimate hosted card checkout URL when available.
    const CARD_CHECKOUT_URL = "";

    // Initial screenshot size limit: 5 MB.
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    let selectedProofFile = null;


    /* =====================================
       3. LOAD SAVED BOOKING INFORMATION
    ===================================== */

    const savedReference =
        sessionStorage.getItem("selenaBookingReference");

    const savedName =
        sessionStorage.getItem("selenaBookingName");

    const savedEmail =
        sessionStorage.getItem("selenaBookingEmail");

    const savedAmount =
        sessionStorage.getItem("selenaBookingAmount");


    function displayBookingDetails() {

        if (bookingReference) {
            bookingReference.value = savedReference || "";
        }

        if (customerName) {
            customerName.value = savedName || "";
        }

        if (customerEmail) {
            customerEmail.value = savedEmail || "";
        }

        if (paymentAmount) {
            paymentAmount.value =
                savedAmount && Number.isFinite(Number(savedAmount))
                    ? Number(savedAmount).toFixed(2)
                    : "";
        }

        if (summaryReference) {
            summaryReference.textContent =
                savedReference || "Not available";
        }

        if (summaryName) {
            summaryName.textContent =
                savedName || "Not available";
        }

        if (summaryEmail) {
            summaryEmail.textContent =
                savedEmail || "Not available";
        }

        if (summaryAmount) {

            summaryAmount.textContent =
                savedAmount && Number.isFinite(Number(savedAmount))
                    ? "$" + Number(savedAmount).toFixed(2)
                    : "Confirm amount";

        }

    }

    displayBookingDetails();


    /* =====================================
       4. PAYMENT MESSAGE
    ===================================== */

    function showPaymentMessage(message, type) {

        if (!paymentMessage) {
            alert(message);
            return;
        }

        paymentMessage.textContent = message;
        paymentMessage.className = type;
        paymentMessage.style.display = "block";

        paymentMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    function clearPaymentMessage() {

        if (!paymentMessage) return;

        paymentMessage.textContent = "";
        paymentMessage.className = "";
        paymentMessage.style.display = "none";

    }


    /* =====================================
       5. PAYMENT METHOD DETAILS
    ===================================== */

    function hideAllPaymentDetails() {

        if (btcDetails) btcDetails.hidden = true;
        if (usdtDetails) usdtDetails.hidden = true;
        if (cardDetails) cardDetails.hidden = true;

    }


    function updatePaymentMethod() {

        if (!paymentMethod) return;

        hideAllPaymentDetails();

        const selectedMethod = paymentMethod.value;

        if (selectedMethod === "Bitcoin" && btcDetails) {

            btcDetails.hidden = false;

        } else if (selectedMethod === "USDT" && usdtDetails) {

            usdtDetails.hidden = false;

        } else if (selectedMethod === "Card" && cardDetails) {

            cardDetails.hidden = false;

        }

        clearProofPreview();
        clearPaymentMessage();

    }


    if (paymentMethod) {

        paymentMethod.addEventListener(
            "change",
            updatePaymentMethod
        );

        updatePaymentMethod();

    }


    /* =====================================
       6. COPY BITCOIN WALLET ADDRESS
    ===================================== */

    if (copyWalletButton) {

        copyWalletButton.addEventListener("click", async function () {

            try {

                await navigator.clipboard.writeText(
                    BTC_WALLET_ADDRESS
                );

                const originalText =
                    copyWalletButton.textContent;

                copyWalletButton.textContent = "Copied!";

                setTimeout(function () {

                    copyWalletButton.textContent = originalText;

                }, 2000);

            } catch (error) {

                showPaymentMessage(
                    "Unable to copy automatically. Please select and copy the Bitcoin wallet address.",
                    "error"
                );

            }

        });

    }


    /* =====================================
       7. CLEAR SCREENSHOT PREVIEW
    ===================================== */

    function clearProofPreview() {

        selectedProofFile = null;

        if (paymentProof) {
            paymentProof.value = "";
        }

        if (proofPreview) {
            proofPreview.innerHTML = "";
        }

    }


    /* =====================================
       8. PAYMENT SCREENSHOT PREVIEW
    ===================================== */

    if (paymentProof) {

        paymentProof.addEventListener("change", function () {

            clearPaymentMessage();

            if (proofPreview) {
                proofPreview.innerHTML = "";
            }

            selectedProofFile = null;

            const file = paymentProof.files[0];

            if (!file) return;

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                paymentProof.value = "";

                showPaymentMessage(
                    "Please upload a JPG, PNG, or WEBP payment screenshot.",
                    "error"
                );

                return;

            }

            if (file.size > MAX_FILE_SIZE) {

                paymentProof.value = "";

                showPaymentMessage(
                    "Your screenshot is larger than 5 MB. Please select a smaller image.",
                    "error"
                );

                return;

            }

            selectedProofFile = file;

            const imageURL = URL.createObjectURL(file);
            const previewImage = document.createElement("img");

            previewImage.src = imageURL;
            previewImage.alt = "Payment proof preview";

            previewImage.onload = function () {
                URL.revokeObjectURL(imageURL);
            };

            if (proofPreview) {
                proofPreview.appendChild(previewImage);
            }

        });

    }


    /* =====================================
       9. VALIDATE PAYMENT METHOD
    ===================================== */

    function validatePaymentMethod() {

        if (!paymentMethod) {
            showPaymentMessage(
                "Payment method field is missing.",
                "error"
            );
            return false;
        }

        const selectedMethod = paymentMethod.value;

        if (!selectedMethod) {

            showPaymentMessage(
                "Please select a payment method.",
                "error"
            );

            return false;

        }

        if (selectedMethod === "Bitcoin") {

            if (!BTC_WALLET_ADDRESS) {

                showPaymentMessage(
                    "Bitcoin payment details are not configured.",
                    "error"
                );

                return false;

            }

        } else if (selectedMethod === "USDT") {

            if (!USDT_WALLET_ADDRESS || !USDT_NETWORK) {

                showPaymentMessage(
                    "USDT payment is not available yet. Please contact Selena Massage Spa.",
                    "error"
                );

                return false;

            }

        } else if (selectedMethod === "Card") {

            if (!CARD_CHECKOUT_URL) {

                showPaymentMessage(
                    "Card checkout is not configured yet. Please contact Selena Massage Spa.",
                    "error"
                );

                return false;

            }

            // A card payment must be completed through the
            // legitimate hosted payment provider.
            showPaymentMessage(
                "Please complete your card payment through the secure checkout provider.",
                "error"
            );

            return false;

        } else {

            showPaymentMessage(
                "The selected payment method is not supported.",
                "error"
            );

            return false;

        }

        return true;

    }


    /* =====================================
       10. SUBMIT PAYMENT TO FORMSPREE
    ===================================== */

    paymentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearPaymentMessage();

        if (!paymentForm.reportValidity()) {
            return;
        }

        // Check that booking information exists.
        if (
            !savedReference ||
            !savedName ||
            !savedEmail ||
            !savedAmount
        ) {

            showPaymentMessage(
                "Your booking information is missing. Please return to the booking page and submit your booking again.",
                "error"
            );

            return;

        }

        // Validate the amount.
        if (
            !Number.isFinite(Number(savedAmount)) ||
            Number(savedAmount) <= 0
        ) {

            showPaymentMessage(
                "The booking amount is invalid. Please contact Selena Massage Spa.",
                "error"
            );

            return;

        }

        // Validate the selected payment method.
        if (!validatePaymentMethod()) {
            return;
        }

        // Require a transaction reference.
        if (
            !transactionReference ||
            !transactionReference.value.trim()
        ) {

            showPaymentMessage(
                "Please enter your transaction reference.",
                "error"
            );

            return;

        }

        // Require a payment screenshot.
        if (!selectedProofFile) {

            showPaymentMessage(
                "Please upload your payment screenshot.",
                "error"
            );

            return;

        }

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "Submit Payment Details";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting payment details...";
        }

        try {

            const formData = new FormData(paymentForm);

            // Attach the saved booking details.
            formData.set(
                "booking_reference",
                savedReference
            );

            formData.set(
                "customer_name",
                savedName
            );

            formData.set(
                "customer_email",
                savedEmail
            );

            formData.set(
                "payment_amount",
                Number(savedAmount).toFixed(2)
            );

            formData.set(
                "payment_method",
                paymentMethod.value
            );

            formData.set(
                "payment_status",
                "Pending verification"
            );

            formData.set(
                "_subject",
                "Selena Spa Payment Submission - " + savedReference
            );

            formData.set(
                "submitted_at",
                new Date().toISOString()
            );

            // Send payment information and screenshot to Formspree.
            const response = await fetch(
                PAYMENT_FORM_ENDPOINT,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Payment submission failed."
                );
            }

            showPaymentMessage(
                "Your payment details have been submitted successfully. Your payment is PENDING VERIFICATION. Selena Massage Spa will confirm your payment after checking the transaction.",
                "success"
            );

            if (submitButton) {

                submitButton.textContent =
                    "Payment Details Submitted";

            }

            // Prevent duplicate submissions.
            paymentForm.querySelectorAll(
                "input, select, textarea, button"
            ).forEach(function (field) {

                field.disabled = true;

            });

        } catch (error) {

            console.error(
                "Payment submission error:",
                error
            );

            showPaymentMessage(
                "We could not submit your payment details. Please check your internet connection and try again.",
                "error"
            );

            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

            }

        }

    });


    /* =====================================
       11. INITIAL PAGE SETTINGS
    ===================================== */

    hideAllPaymentDetails();

    updatePaymentMethod();

});

