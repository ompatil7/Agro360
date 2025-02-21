// bookingFunctions.js

import axios from "axios";

import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe from stripe-js

// Load Stripe object with your publishable key
const stripePromise = loadStripe(
  "pk_test_51P5M6mSGhKrdHERp9543ZOQccbAjRceJSwRBsyFyvOOcqfVG8PZ0ubJlncjleiL7KdsjXdbPfcR6jA8AJ2GM1tB400VJslV0wX"
);

export const crop = async (id) => {
  try {
    // 1) Get checkout session from API
    const response = await axios.get(`/api/v1/payment/checkout-session/${id}`);
    const sessionId = response.data.session.id;

    // 2) Create checkout form + change credit card
    const stripe = await stripePromise; // Await stripePromise to get the Stripe object
    await stripe.redirectToCheckout({
      sessionId: sessionId,
    });
  } catch (err) {
    //console.log(err);
  }
};
