import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "./auth";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Feature = {
  id: number;
  name: string;
  value: string;
};

type CreateUnitProps = {
  user: AuthUser | null;
  onLogout: () => void | Promise<void>;
  logoutError: string | null;
  isLoggingOut: boolean;
};

function CreateUnit({
  user,
  onLogout,
  logoutError,
  isLoggingOut,
}: CreateUnitProps) {
  const navigate = useNavigate();
  const contractInput = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState<Feature[]>([
    { id: 1, name: "", value: "" },
  ]);
  const [contract, setContract] = useState<File | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const updateFeature = (
    id: number,
    field: "name" | "value",
    value: string,
  ) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature,
      ),
    );
  };

  const addFeature = () => {
    setFeatures((currentFeatures) => [
      ...currentFeatures,
      {
        id: Math.max(0, ...currentFeatures.map((feature) => feature.id)) + 1,
        name: "",
        value: "",
      },
    ]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveNotice(
      contract
        ? "The form and contract are selected, but unit creation and file upload are not connected to the API yet. Nothing was saved or uploaded."
        : "The form is complete, but unit creation is not connected to the API yet. No unit was saved.",
    );
  };

  return (
    <div className="app">
      <Sidebar user={user} activeItem="Create Unit" />

      <main className="main">
        <Header
          eyebrow="PROPERTY MANAGEMENT"
          title="Create a new unit"
          user={user}
          profileLabel="Dashboard"
          profilePath="/dashboard"
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />

        {logoutError && (
          <p role="alert" className="login-error">
            {logoutError}
          </p>
        )}

        <form className="create-unit-form" onSubmit={handleSubmit}>
          <section className="create-unit-section">
            <div className="section-heading">
              <div>
                <h2>Unit details</h2>
                <p>Add the address and basic information for this property.</p>
              </div>
            </div>

            <div className="unit-form-grid">
              <label>
                Code number
                <input
                  name="codeNumber"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. APT-101"
                  required
                />
              </label>
              <label className="unit-form-wide">
                Address
                <input
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Street address"
                  required
                />
              </label>
              <label>
                Country
                <input
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  placeholder="Country"
                  required
                />
              </label>
              <label>
                City
                <input
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City"
                  required
                />
              </label>
              <label>
                Area (m²)
                <input
                  name="area"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 120"
                  required
                />
              </label>
              <label>
                Payment status
                <select name="paymentStatus" defaultValue="" required>
                  <option value="" disabled>
                    Select payment status
                  </option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="partially_paid">Partially paid</option>
                </select>
              </label>
              <label>
                Total price
                <input
                  name="totalPrice"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter total price"
                  required
                />
              </label>
            </div>
          </section>

          <section className="create-unit-section">
            <div className="section-heading">
              <div>
                <h2>Unit contract</h2>
                <p>Attach the contract document for this property (optional).</p>
              </div>
            </div>

            <div className="contract-upload">
              <input
                ref={contractInput}
                className="contract-file-input"
                id="unit-contract"
                name="contract"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => {
                  setContract(event.currentTarget.files?.[0] ?? null);
                  setSaveNotice(null);
                }}
              />
              <label className="contract-upload-label" htmlFor="unit-contract">
                <span className="contract-upload-icon" aria-hidden="true">
                  ↑
                </span>
                <span>
                  <strong>
                    {contract ? "Choose a different file" : "Choose contract"}
                  </strong>
                  <span>PDF, DOC, or DOCX</span>
                </span>
              </label>
              {contract && (
                <div className="contract-file">
                  <span className="contract-file-name">{contract.name}</span>
                  <button
                    className="remove-feature-button"
                    type="button"
                    onClick={() => {
                      setContract(null);
                      if (contractInput.current) {
                        contractInput.current.value = "";
                      }
                    }}
                    aria-label="Remove selected contract"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="create-unit-section">
            <div className="section-heading">
              <div>
                <h2>Features</h2>
                <p>Add any number of features with a name and value.</p>
              </div>
              <button
                className="add-feature-button"
                type="button"
                onClick={addFeature}
              >
                + Add feature
              </button>
            </div>

            <div className="feature-list">
              {features.map((feature, index) => (
                <div className="feature-row" key={feature.id}>
                  <label>
                    Feature name
                    <input
                      name={`features[${index}][name]`}
                      value={feature.name}
                      onChange={(event) =>
                        updateFeature(feature.id, "name", event.target.value)
                      }
                      placeholder="e.g. Bedrooms"
                    />
                  </label>
                  <label>
                    Value
                    <input
                      name={`features[${index}][value]`}
                      value={feature.value}
                      onChange={(event) =>
                        updateFeature(feature.id, "value", event.target.value)
                      }
                      placeholder="e.g. 3"
                    />
                  </label>
                  <button
                    className="remove-feature-button"
                    type="button"
                    onClick={() =>
                      setFeatures((currentFeatures) =>
                        currentFeatures.filter(
                          (item) => item.id !== feature.id,
                        ),
                      )
                    }
                    aria-label={`Remove feature ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {saveNotice && (
            <p className="form-notice" role="status">
              {saveNotice}
            </p>
          )}

          <div className="create-unit-actions">
            <button
              className="close-button"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button className="login-submit" type="submit">
              Create unit <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateUnit;
