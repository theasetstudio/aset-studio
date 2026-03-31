import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51T7WTv98aFfAd7LEEoa872mFAybYxVuEFNmZXYLQznJfMgvOf1i6eNENrpbq0uKr69F6uA3q64TWRxmEzh0lgm3J00nO9T3BXP");

export default stripePromise;