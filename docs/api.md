\# Rupee+ API Reference



The Rupee+ backend uses FastAPI. Run the API locally and visit `http://127.0.0.1:8000/docs` to explore the interactive API schemas.



\*\*Base URL:\*\* `http://127.0.0.1:8000`



\## Service endpoints



\### `GET /`



Returns the application name and running status.



\### `GET /health`



Returns the service health status.



\## Premium



\### `POST /premium/calculate`



Calculates a personalized premium using the pricing inputs supplied in the request.



The request uses `PremiumRequest`. Inputs include monthly income, income stability, work hours per day, city risk, occupation risk, and previous claims.



\## Onboarding



\### `POST /onboarding/profile`



Creates a user profile, maps city and occupation to risk values, calculates pricing and allocations, and saves the profile.



Uses `OnboardingRequest` and returns `OnboardingResponse`.



\## Transactions



\### `POST /transactions/process`



Processes a transaction and allocates its round-up between insurance and savings.



Uses `TransactionRequest` and returns `TransactionResponse`. If `insurance\_required` is omitted, the service looks up the saved profile and uses its monthly premium. A missing profile results in HTTP 404.



\## Wallet



\### `GET /wallet/{user\_id}`



Returns the user's savings balance, insurance balance, and total balance.



Returns `WalletBalanceResponse`.



\## Coverage



\### `POST /cover/check`



Checks whether the provided insurance balance meets the required premium.



Uses `CoverageRequest` and returns `CoverageResponse`.



\### `GET /cover/{user\_id}`



Returns coverage information using the saved profile and wallet balances. A missing profile results in HTTP 404.



Returns `UserCoverageResponse`.



\## Claims



\### `POST /claims`



Submits a claim for a user with a saved profile and active coverage. The implementation passes the claim to a mock insurer.



Possible explicit error responses:



\* HTTP 404 if the user profile is missing.

\* HTTP 403 if coverage is inactive.

\* HTTP 400 if claim creation fails validation.



Uses `ClaimRequest` and returns `ClaimResponse`.



\### `GET /claims/{claim\_id}`



Retrieves a claim by its ID. Returns HTTP 404 if the claim is not found.



\### `GET /claims/user/{user\_id}`



Returns the claims associated with a user.



\## Schemas and validation



The application's schema classes define field names, types, required fields, and validation constraints. Consult `/docs` on a running instance for the complete request and response schemas.



The errors listed above describe explicit checks in the route handlers; additional validation or server errors may occur.
