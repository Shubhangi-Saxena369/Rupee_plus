\# Technical References



This document lists the main technologies and repository areas used by the Rupee+ prototype.



\## Technologies



\* \*\*Python\*\* — backend programming language.

\* \*\*FastAPI\*\* — HTTP API framework and generated OpenAPI documentation.

\* \*\*Pydantic\*\* — request and response schema validation.

\* \*\*Uvicorn\*\* — ASGI server for running the API.

\* \*\*NumPy, scikit-learn, and joblib\*\* — numerical and machine-learning dependencies used by the project.



See `backend/requirements.txt` for the versions pinned by this repository.



\## Repository structure



\* `backend/app/main.py` — creates the FastAPI application and registers routers.

\* `backend/app/api/routes/` — premium, onboarding, transactions, wallet, coverage, and claims endpoints.

\* `backend/app/schemas/` — request and response models.

\* `backend/app/services/` — pricing, allocation, coverage, claims, and supporting service logic.

\* `backend/app/integrations/` — mock UPI, account aggregator, and insurer integrations.

\* `backend/tests/` — automated backend tests.

\* `backend/Dockerfile` and `docker-compose.yml` — container configuration.

\* `.github/workflows/ci.yml` — GitHub Actions workflow for installing dependencies and running tests.



\## Useful commands



Run the API from the repository root:



```powershell

python -m uvicorn backend.app.main:app --reload

```



Run backend tests:



```powershell

python -m pytest backend\\tests -q

```



While the API is running, visit `http://127.0.0.1:8000/docs` for interactive API documentation.



\## External documentation



\* Python: https://docs.python.org/3/

\* FastAPI: https://fastapi.tiangolo.com/

\* Pydantic: https://docs.pydantic.dev/

\* Uvicorn: https://www.uvicorn.org/

\* NumPy: https://numpy.org/doc/

\* scikit-learn: https://scikit-learn.org/stable/documentation.html

\* joblib: https://joblib.readthedocs.io/

\* GitHub Actions: https://docs.github.com/actions



These are general technical references, not evidence of regulatory compliance or endorsement of the application.
