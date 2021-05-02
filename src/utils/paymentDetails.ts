import stripe from 'tipsi-stripe';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const test_key =
  'pk_test_51HlaLaKgpG3Swz4j8zy0ePAKbU0wAEZCbNNLch7yFRGXFqvH964ANzUaa4woTEJb907z9nGA1xQlCjABD4hDzZAl00t2buDVX6';
const publish_key =
  'pk_live_51HlaLaKgpG3Swz4jzRXPLyZ3eP55dakM1Hf86NpNAGkBSVUyVrFWU9fcmEGL0aPpGpXapj0xW8YPhzuYYLSZjGJp00usnb7qkH';
stripe.setOptions({
  publishableKey: publish_key,
});
export default stripe;
