import { useState } from "react";

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    income: "",
    goal: "",
    protection: "",
    occupation: "",
    city: "",
    workHours: "8",
    previousClaims: "0",
    incomeStability: "0.65",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResult, setApiResult] = useState(null);

  const updateForm = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    // After displaying the real result, the next click continues to the app.
    if (apiResult) {
      if (onComplete) onComplete(apiResult);
      return;
    }

    const incomeMidpoints = {
      "below-15000": 11500,
      "15000-30000": 22500,
      "30000-50000": 40000,
      "50000-100000": 75000,
      "above-100000": 110000,
    };

    if (
      !formData.name.trim() ||
      !formData.income ||
      !formData.occupation ||
      !formData.city.trim() ||
      !formData.workHours ||
      !formData.previousClaims.trim() ||
      !formData.incomeStability
    ) {
      setError("Please complete all required profile fields.");
      return;
    }

    const monthlyIncome = incomeMidpoints[formData.income];
    const hours = Number(formData.workHours);
    const claims = Number(formData.previousClaims);
    const stability = Number(formData.incomeStability);

    if (
      !monthlyIncome ||
      !Number.isFinite(hours) || hours < 1 || hours > 24 ||
      !Number.isInteger(claims) || claims < 0 ||
      !Number.isFinite(stability) || stability < 0 || stability > 1
    ) {
      setError("Please check your income, working hours, claims, and stability.");
      return;
    }

    const apiBase = import.meta.env.VITE_API_URL;
    if (!apiBase) {
      setError("API URL is not configured. Set VITE_API_URL and rebuild the frontend.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiBase.replace(/\/$/, "")}/onboarding/profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: `rupee-${Date.now()}`,
            name: formData.name.trim(),
            occupation: formData.occupation,
            city: formData.city.trim(),
            monthly_income: monthlyIncome,
            income_stability: stability,
            work_hours_per_day: hours,
            // The backend recalculates these from city and occupation.
            city_risk: 0,
            occupation_risk: 0,
            previous_claims: claims,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = data.detail
          ? (typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail))
          : `Request failed (${response.status})`;
        throw new Error(detail);
      }

      setApiResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to Rupee+. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f6f4fc;
          color: #292a31;
        }

        .onboarding-page {
          min-height: 100vh;
          background: #f6f4fc;
          display: flex;
          flex-direction: column;
        }

        .onboarding-nav {
          height: 72px;
          background: white;
          border-bottom: 1px solid #e8e6ee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6%;
        }

        .onboarding-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 19px;
          font-weight: 900;
        }

        .brand-mark {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #c8ff00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #292a31;
        }

        .step-counter {
          font-size: 10px;
          font-weight: 800;
          color: #777;
        }

        .onboarding-container {
          width: min(700px, 92%);
          margin: 55px auto;
          flex: 1;
        }

        .progress-area {
          margin-bottom: 35px;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 9px;
        }

        .progress-label {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          color: #777;
          letter-spacing: 0.5px;
        }

        .progress-number {
          font-size: 9px;
          font-weight: 900;
          color: #292a31;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: #e5e3eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #c8ff00;
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .onboarding-card {
          background: white;
          border: 1px solid #e7e5ed;
          border-radius: 28px;
          padding: 42px;
          box-shadow: 0 18px 50px rgba(41, 42, 49, 0.06);
        }

        .step-tag {
          display: inline-flex;
          background: #292a31;
          color: #c8ff00;
          padding: 7px 11px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .onboarding-card h1 {
          margin: 0;
          font-size: 38px;
          line-height: 1.05;
          letter-spacing: -1.7px;
        }

        .onboarding-card > p {
          margin: 13px 0 30px;
          color: #777;
          font-size: 12px;
          line-height: 1.7;
          max-width: 500px;
        }

        .field {
          margin-bottom: 20px;
        }

        .field label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          margin-bottom: 8px;
          text-transform: uppercase;
          color: #555;
        }

        .field input,
        .field select {
          width: 100%;
          height: 50px;
          border: 1px solid #dddbe4;
          border-radius: 13px;
          padding: 0 15px;
          font-size: 12px;
          color: #292a31;
          background: #faf9fc;
          outline: none;
        }

        .field input:focus,
        .field select:focus {
          border-color: #c8ff00;
          box-shadow: 0 0 0 3px rgba(200, 255, 0, 0.18);
        }

        .choice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }

        .choice-button {
          border: 1px solid #dddbe4;
          background: #faf9fc;
          border-radius: 15px;
          padding: 17px;
          text-align: left;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .choice-button:hover {
          border-color: #b8e900;
        }

        .choice-button.selected {
          border-color: #292a31;
          background: #c8ff00;
        }

        .choice-title {
          display: block;
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .choice-description {
          display: block;
          font-size: 9px;
          color: #777;
          line-height: 1.4;
        }

        .choice-button.selected .choice-description {
          color: #454600;
        }

        .protection-box {
          background: #292a31;
          color: white;
          border-radius: 20px;
          padding: 22px;
          margin-top: 8px;
        }

        .protection-box-title {
          color: #c8ff00;
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .protection-box p {
          color: #bbb;
          font-size: 9px;
          line-height: 1.6;
          margin: 0;
        }

        .button-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 32px;
        }

        .back-button,
        .next-button {
          min-height: 48px;
          padding: 0 22px;
          border-radius: 13px;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .back-button {
          background: white;
          color: #292a31;
          border: 1px solid #dddbe4;
        }

        .back-button:hover {
          background: #f6f4fc;
        }

        .next-button {
          margin-left: auto;
          border: none;
          background: #c8ff00;
          color: #292a31;
          box-shadow: 0 8px 20px rgba(200, 255, 0, 0.25);
        }

        .next-button:hover {
          transform: translateY(-1px);
        }

        .trust-note {
          text-align: center;
          margin-top: 22px;
          font-size: 9px;
          color: #999;
        }

        .summary {
          background: #f6f4fc;
          border-radius: 17px;
          padding: 18px;
          margin-top: 20px;
        }

        .summary-title {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          color: #777;
          margin-bottom: 10px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 7px 0;
          border-bottom: 1px solid #e7e5ed;
          font-size: 10px;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row span:first-child {
          color: #888;
        }

        .summary-row span:last-child {
          font-weight: 900;
        }

        @media (max-width: 600px) {
          .onboarding-nav {
            padding: 0 5%;
          }

          .onboarding-container {
            margin: 35px auto;
          }

          .onboarding-card {
            padding: 25px;
            border-radius: 22px;
          }

          .onboarding-card h1 {
            font-size: 30px;
          }

          .choice-grid {
            grid-template-columns: 1fr;
          }

          .button-row {
            flex-direction: column-reverse;
          }

          .next-button,
          .back-button {
            width: 100%;
            margin-left: 0;
          }
        }
      `}</style>

      <nav className="onboarding-nav">
        <div className="onboarding-brand">
          <div className="brand-mark">₹</div>
          Rupee+
        </div>

        <div className="step-counter">
          STEP {step} OF 3
        </div>
      </nav>

      <main className="onboarding-container">

        <div className="progress-area">
          <div className="progress-top">
            <span className="progress-label">
              Build your financial safety profile
            </span>

            <span className="progress-number">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(step / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        <section className="onboarding-card">

          {step === 1 && (
            <>
              <div className="step-tag">
                Step 01 · About you
              </div>

              <h1>
                Let's start with you.
              </h1>

              <p>
                Tell us your name so we can personalize your Rupee+
                financial safety experience.
              </p>

              <div className="field">
                <label htmlFor="name">
                  Your name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="occupation">Occupation</label>
                <select
                  id="occupation"
                  value={formData.occupation}
                  onChange={(event) =>
                    updateForm("occupation", event.target.value)
                  }
                >
                  <option value="">Select occupation</option>
                  <option value="delivery rider">Delivery rider</option>
                  <option value="driver">Driver</option>
                  <option value="construction worker">Construction worker</option>
                  <option value="factory worker">Factory worker</option>
                  <option value="security guard">Security guard</option>
                  <option value="domestic worker">Domestic worker</option>
                  <option value="street vendor">Street vendor</option>
                  <option value="shop worker">Shop worker</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="office worker">Office worker</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(event) =>
                    updateForm("city", event.target.value)
                  }
                />
              </div>

              <div className="button-row">
                <div />

                <button
                  className="next-button"
                  onClick={nextStep}
                  disabled={
                    !formData.name.trim() ||
                    !formData.occupation ||
                    !formData.city.trim()
                  }
                  style={{
                    opacity:
                      formData.name.trim() &&
                      formData.occupation &&
                      formData.city.trim() ? 1 : 0.5,
                  }}
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="step-tag">
                Step 02 · Your goals
              </div>

              <h1>
                Understand your money.
              </h1>

              <p>
                A few simple details help Rupee+ understand what
                financial safety means for you.
              </p>

              <div className="field">
                <label htmlFor="income">
                  Monthly income
                </label>

                <select
                  id="income"
                  value={formData.income}
                  onChange={(event) =>
                    updateForm("income", event.target.value)
                  }
                >
                  <option value="">
                    Select your income range
                  </option>

                  <option value="below-15000">
                    Below ₹15,000
                  </option>

                  <option value="15000-30000">
                    ₹15,000 – ₹30,000
                  </option>

                  <option value="30000-50000">
                    ₹30,000 – ₹50,000
                  </option>

                  <option value="50000-100000">
                    ₹50,000 – ₹1,00,000
                  </option>

                  <option value="above-100000">
                    Above ₹1,00,000
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Your biggest financial goal
                </label>

                <div className="choice-grid">

                  <button
                    type="button"
                    className={
                      formData.goal === "emergency"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("goal", "emergency")
                    }
                  >
                    <span className="choice-title">
                      Emergency savings
                    </span>

                    <span className="choice-description">
                      Build a safety cushion for unexpected expenses.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.goal === "health"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("goal", "health")
                    }
                  >
                    <span className="choice-title">
                      Health protection
                    </span>

                    <span className="choice-description">
                      Stay financially prepared for health emergencies.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.goal === "family"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("goal", "family")
                    }
                  >
                    <span className="choice-title">
                      Protect my family
                    </span>

                    <span className="choice-description">
                      Create a stronger financial safety net.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.goal === "growth"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("goal", "growth")
                    }
                  >
                    <span className="choice-title">
                      Grow my savings
                    </span>

                    <span className="choice-description">
                      Build better saving habits over time.
                    </span>
                  </button>

                </div>
              </div>

              <div className="button-row">

                <button
                  className="back-button"
                  onClick={previousStep}
                >
                  ← Back
                </button>

                <button
                  className="next-button"
                  onClick={nextStep}
                  disabled={!formData.income || !formData.goal}
                  style={{
                    opacity:
                      formData.income && formData.goal
                        ? 1
                        : 0.5,
                  }}
                >
                  Continue →
                </button>

              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="step-tag">
                Step 03 · Protection
              </div>

              <h1>
                Add your safety layer.
              </h1>

              <p>
                Choose the level of financial protection you'd like
                Rupee+ to help you understand.
              </p>

              <div className="field">
                <label>
                  Protection preference
                </label>

                <div className="choice-grid">

                  <button
                    type="button"
                    className={
                      formData.protection === "basic"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("protection", "basic")
                    }
                  >
                    <span className="choice-title">
                      Basic
                    </span>

                    <span className="choice-description">
                      Essential protection for everyday emergencies.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.protection === "balanced"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("protection", "balanced")
                    }
                  >
                    <span className="choice-title">
                      Balanced
                    </span>

                    <span className="choice-description">
                      A practical balance between protection and cost.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.protection === "strong"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("protection", "strong")
                    }
                  >
                    <span className="choice-title">
                      Strong
                    </span>

                    <span className="choice-description">
                      More coverage for a stronger safety net.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.protection === "maximum"
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() =>
                      updateForm("protection", "maximum")
                    }
                  >
                    <span className="choice-title">
                      Maximum
                    </span>

                    <span className="choice-description">
                      Prioritize maximum financial protection.
                    </span>
                  </button>

                </div>
              </div>

              <div className="protection-box">
                <div className="protection-box-title">
                  Your Rupee+ safety profile
                </div>

                <p>
                  Your choices help us personalize the dashboard
                  experience. This is a frontend demo and does not
                  activate or purchase an insurance policy.
                </p>
              </div>

              <div className="field">
                <label htmlFor="workHours">Average working hours per day</label>
                <input
                  id="workHours"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.workHours}
                  onChange={(event) =>
                    updateForm("workHours", event.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="previousClaims">Previous insurance claims</label>
                <input
                  id="previousClaims"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.previousClaims}
                  onChange={(event) =>
                    updateForm("previousClaims", event.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="incomeStability">
                  Income stability (0 = variable, 1 = very stable)
                </label>
                <select
                  id="incomeStability"
                  value={formData.incomeStability}
                  onChange={(event) =>
                    updateForm("incomeStability", event.target.value)
                  }
                >
                  <option value="0.25">Very variable</option>
                  <option value="0.45">Somewhat variable</option>
                  <option value="0.65">Moderately stable</option>
                  <option value="0.8">Mostly stable</option>
                  <option value="0.95">Very stable</option>
                </select>
              </div>

              <div className="summary">

                <div className="summary-title">
                  Profile summary
                </div>

                <div className="summary-row">
                  <span>Name</span>
                  <span>{formData.name || "Not provided"}</span>
                </div>

                <div className="summary-row">
                  <span>Income</span>
                  <span>
                    {formData.income
                      ? formData.income.replaceAll("-", " ")
                      : "Not selected"}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Goal</span>
                  <span>
                    {formData.goal || "Not selected"}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Protection</span>
                  <span>
                    {formData.protection || "Not selected"}
                  </span>
                </div>

              </div>

              {error && (
                <p role="alert" style={{ color: "#b42318" }}>
                  {error}
                </p>
              )}

              {apiResult && (
                <div className="protection-box" aria-live="polite">
                  <div className="protection-box-title">
                    Your calculated Rupee+ profile
                  </div>
                  <p>Risk score: {apiResult.risk_score}</p>
                  <p>Risk level: {apiResult.risk_level}</p>
                  <p>
                    Monthly premium: ₹
                    {Number(apiResult.monthly_premium).toFixed(2)}
                  </p>
                  <p>
                    Insurance allocation: ₹
                    {Number(apiResult.insurance_allocation).toFixed(2)}
                  </p>
                  <p>
                    Savings allocation: ₹
                    {Number(apiResult.savings_allocation).toFixed(2)}
                  </p>
                  <p>{apiResult.message}</p>
                  <p>
                    Income ranges use representative amounts, not your exact income.
                    This estimate is not an insurance purchase or policy activation.
                  </p>
                </div>
              )}

              <div className="button-row">

                <button
                  className="back-button"
                  onClick={previousStep}
                >
                  ← Back
                </button>

                <button
                  className="next-button"
                  onClick={handleComplete}
                  disabled={loading || (!formData.protection && !apiResult)}
                  style={{
                    opacity: loading ? 0.7 : 1,
                  }}
                >{loading ? "Calculating..." : apiResult ? "Continue to dashboard" : "Calculate my profile"}</button>

              </div>
            </>
          )}

        </section>

        <div className="trust-note">
          Your information is used only to personalize this demo experience.
        </div>

      </main>
    </div>
  );
}

export default Onboarding;