import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY");

function MinimalPage() {
  return (
    <Elements stripe={stripePromise}>
      <div>Stripe should load here.</div>
    </Elements>
  );
}
export default MinimalPage;
