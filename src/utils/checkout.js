// src/utils/checkout.js

// ✅ Stripe Payment Link for Supreme subscription
// This replaces the old redirectToCheckout flow
// because Stripe removed client-side checkout redirects.

const SUPREME_PAYMENT_LINK = "https://buy.stripe.com/test_cNi28lb2D2GneIL2fceME00";

export async function startSupremeCheckout() {
  try {
    if (!SUPREME_PAYMENT_LINK) {
      console.error("[Stripe] Missing payment link");
      throw new Error("Missing Stripe payment link");
    }

    // Redirect browser directly to Stripe checkout page
    window.location.href = SUPREME_PAYMENT_LINK;
  } catch (error) {
    console.error("[Stripe] Checkout redirect failed:", error);
    throw error;
  }
}