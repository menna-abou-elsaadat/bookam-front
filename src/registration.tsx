import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

type RegistrationProps = {
  onRegister: () => void;
  onLogin: () => void;
};

type RegisterMutationData = {
  register: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      roles: string[];
    };
  };
};

type RegisterMutationVariables = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
};

const REGISTER_MUTATION = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $phone: String!
    $role: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      phone: $phone
      role: $role
    ) {
      token
      user {
        id
        name
        email
        roles
      }
    }
  }
`;

function Registration({ onRegister, onLogin }: RegistrationProps) {
  const [register, { loading }] = useMutation<
    RegisterMutationData,
    RegisterMutationVariables
  >(REGISTER_MUTATION);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );

  return (
    <main className="login-page">
      <section className="login-promo">
        <div className="login-promo-copy">
          <p className="eyebrow">YOUR PROPERTY, IN GOOD HANDS</p>
          <h1>A calmer way to care for your properties.</h1>
          <p>
            Keep your units, rental income, and everyday details together in one
            happy place.
          </p>
        </div>

        <div className="login-preview" aria-hidden="true">
          <div className="login-preview-icon">⌂</div>
          <div>
            <span>YOUR PORTFOLIO</span>
            <strong>Everything in its place</strong>
          </div>
          <span className="login-preview-sparkle">✦</span>
        </div>
        <p className="login-promo-footer">
          A little more peace of mind, daily.
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <img
            className="bookam-logo"
            src="/bookam-logo.jpeg"
            alt="Bookam — Book. Manage. Grow."
          />
          <p className="eyebrow">GET STARTED</p>
          <h2>Create your account</h2>
          <p className="login-subtitle">
            Set up your space and keep your properties in one place.
          </p>

          <form
            className="login-form"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const password = form.elements.namedItem("password");
              const confirmPassword =
                form.elements.namedItem("confirmPassword");

              if (
                !(password instanceof HTMLInputElement) ||
                !(confirmPassword instanceof HTMLInputElement)
              ) {
                throw new Error("Registration password fields are missing.");
              }

              confirmPassword.setCustomValidity(
                password.value === confirmPassword.value
                  ? ""
                  : "Passwords do not match.",
              );

              if (!form.reportValidity()) {
                return;
              }

              const formData = new FormData(form);
              setRegistrationError(null);
              try {
                const { data } = await register({
                  variables: {
                    name: String(formData.get("name")),
                    email: String(formData.get("email")),
                    password: String(formData.get("password")),
                    phone: String(formData.get("phone")),
                    role: "owner",
                  },
                });
                const token = data?.register.token;
                if (!token) {
                  throw new Error("Registration did not return an auth token.");
                }

                localStorage.setItem("authToken", token);
                onRegister();
              } catch (error) {
                setRegistrationError(
                  error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.",
                );
              }
            }}
          >
            <label htmlFor="registration-name">Full name</label>
            <input
              id="registration-name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              required
            />

            <label htmlFor="registration-email">Email address</label>
            <input
              id="registration-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="registration-phone">Phone number</label>
            <input
              id="registration-phone"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              autoComplete="tel"
              required
            />

            <label htmlFor="registration-password">Password</label>
            <input
              id="registration-password"
              name="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              onChange={(event) => {
                const confirmPassword =
                  event.currentTarget.form?.elements.namedItem(
                    "confirmPassword",
                  );
                if (confirmPassword instanceof HTMLInputElement) {
                  confirmPassword.setCustomValidity("");
                }
              }}
              required
            />

            <label htmlFor="registration-confirm-password">
              Confirm password
            </label>
            <input
              id="registration-confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={8}
              onChange={(event) => event.currentTarget.setCustomValidity("")}
              required
            />

            {registrationError && <p role="alert">{registrationError}</p>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-note">
            Already have an account?{" "}
            <button className="auth-link" type="button" onClick={onLogin}>
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Registration;
