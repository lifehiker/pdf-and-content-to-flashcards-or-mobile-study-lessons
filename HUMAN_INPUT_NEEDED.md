# Human Input Needed

The current app runs as a polished local MVP with simulated generation and local browser storage. To connect production services, provide:

1. Google OAuth credentials for NextAuth
   - Create OAuth client credentials in Google Cloud Console.
   - Add production and preview callback URLs.
   - Provide `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET`.

2. PostgreSQL database URL
   - Provision PostgreSQL 16.
   - Provide `DATABASE_URL`.

3. OpenAI API key
   - Provide `OPENAI_API_KEY` for real flashcard and lesson generation.

4. Object storage credentials
   - Provide S3-compatible endpoint, bucket, access key, and secret for uploaded PDFs/images.

5. Stripe subscription details
   - Create monthly and annual prices.
   - Provide `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`, and `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`.

6. Resend API key
   - Verify the sending domain.
   - Provide `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
