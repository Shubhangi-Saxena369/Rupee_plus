\# Rupee+



Rupee+ is a backend prototype for micro-savings and personalized micro-insurance. It provides premium calculations, onboarding, transaction round-ups, wallet balances, coverage checks, and claim workflows.



\## Current status



\* FastAPI backend with interactive API documentation

\* Premium pricing and explainability services

\* Shared application stores used by backend workflows

\* Mock UPI, account aggregator, and insurer integrations

\* Automated backend tests



This is a development prototype, not a production-ready financial service. Mock integrations do not establish real connections to banks, payment networks, or insurers.



\## Requirements



\* Python 3.14

\* pip



\## Setup



From the repository root, create and activate a virtual environment:



```powershell

python -m venv .venv

.\\.venv\\Scripts\\Activate.ps1

python -m pip install -r backend\\requirements.txt

```



\## Run the API



```powershell

python -m uvicorn backend.app.main:app --reload

```



The API runs at `http://127.0.0.1:8000` by default.



\* Interactive API docs: `http://127.0.0.1:8000/docs`

\* Alternative API docs: `http://127.0.0.1:8000/redoc`

\* Health check: `http://127.0.0.1:8000/health`



\## Main endpoints



| Method | Endpoint                 | Purpose                                      |

| ------ | ------------------------ | -------------------------------------------- |

| GET    | `/`                      | Application status                           |

| GET    | `/health`                | Health status                                |

| POST   | `/premium/calculate`     | Calculate a personalized premium             |

| POST   | `/onboarding/profile`    | Create a user profile                        |

| POST   | `/transactions/process`  | Process a transaction and allocate round-ups |

| GET    | `/wallet/{user\_id}`      | Retrieve wallet balances                     |

| POST   | `/cover/check`           | Check coverage against a required premium    |

| GET    | `/cover/{user\_id}`       | Retrieve a user's coverage                   |

| POST   | `/claims`                | Submit a claim                               |

| GET    | `/claims/{claim\_id}`     | Retrieve a claim                             |

| GET    | `/claims/user/{user\_id}` | List a user's claims                         |



\## Tests



Run the backend tests from the repository root:



```powershell

python -m pytest backend\\tests -q

```



\## Docker



If Docker is installed, run:



```powershell

docker compose up --build

```



\## Documentation



\* API reference: `docs/api.md`

\* Compliance and limitations: `docs/compliance.md`

\* Technical references: `docs/references.md`



\## Disclaimer



Rupee+ is a prototype for development and demonstration. Premium estimates, savings allocations, coverage checks, and claim decisions must not be treated as binding insurance offers, financial advice, or proof of regulatory compliance.

<!-- Trigger backend CI -->
