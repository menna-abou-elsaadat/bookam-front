import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

type LoginProps = {
  onLogin: () => void;
  onRegister: () => void;
};

type LoginMutationData = {
  login: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      roles: string[];
    };
  };
};

type LoginMutationVariables = {
  email: string;
  password: string;
};

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

function Login({ onLogin, onRegister }: LoginProps) {
  const [login, { loading }] = useMutation<
    LoginMutationData,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const [loginError, setLoginError] = useState<string | null>(null);
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
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to Bookam</h2>
          <p className="login-subtitle">Pick up right where you left off.</p>

          <form
            className="login-form"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setLoginError(null);
              try {
                const { data } = await login({
                  variables: {
                    email: String(formData.get("email")),
                    password: String(formData.get("password")),
                  },
                });
                const token = data?.login.token;
                if (!token) {
                  setLoginError("Invalid email or password");
                  return;
                }

                localStorage.setItem("authToken", token);
                onLogin();
              } catch {
                setLoginError("Invalid email or password");
              }
            }}
          >
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            {loginError && (
              <p role="alert" className="login-error">
                {loginError}
              </p>
            )}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="login-note">
            New to Bookam?{" "}
            <button className="auth-link" type="button" onClick={onRegister}>
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
