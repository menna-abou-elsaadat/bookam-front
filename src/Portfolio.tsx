import { useState, type FormEvent } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { AuthUser } from "./auth";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChangePassword from "./ChangePassword";

type UpdateProfileMutationData = {
  updateProfile: { user: AuthUser } | null;
};

type UpdateProfileMutationVariables = {
  name: string;
  email: string;
  phone: string;
};

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($name: String!, $email: String!, $phone: String) {
    updateProfile(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
      roles
    }
  }
`;

type PortfolioProps = {
  user: AuthUser | null;
  onProfileUpdate: (user: AuthUser) => void;
  onLogout: () => void | Promise<void>;
  logoutError: string | null;
  isLoggingOut: boolean;
};

function Portfolio({
  user,
  onProfileUpdate,
  onLogout,
  logoutError,
  isLoggingOut,
}: PortfolioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updateProfile, { loading: isSavingProfile }] = useMutation<
    UpdateProfileMutationData,
    UpdateProfileMutationVariables
  >(UPDATE_PROFILE_MUTATION);

  const initials =
    user?.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  const handleCancel = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setSaveMessage(null);
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    setSaveMessage(null);
    setSaveError(null);
    if (!name.trim()) {
      setSaveError("Full name is required.");
      return;
    }

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();
      const { data } = await updateProfile({
        variables: {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
        },
      });

      const updatedUser = data?.updateProfile;
      console.log("Updated user:", updatedUser);
      if (!updatedUser) {
        setSaveError("Unable to save your profile changes.");
        return;
      }

      onProfileUpdate(updatedUser);
      setIsEditing(false);
      setSaveMessage("Your profile has been updated.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save your profile changes.",
      );
    }
  };

  return (
    <div className="app">
      <Sidebar user={user} activeItem="My Portfolio" />

      <main className="main">
        <Header
          eyebrow="YOUR ACCOUNT"
          title="My Portfolio"
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

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PROPERTY COLLECTION</p>
            <h2>
              Welcome, {user?.name ?? "Owner"}!{" "}
              <span aria-hidden="true">✦</span>
            </h2>
            <p>Keep your contact details up to date in one place.</p>
          </div>
          <div className="welcome-icon">▤</div>
        </section>

        <section className="portfolio-profile">
          {user ? (
            <>
              <div className="portfolio-profile-heading">
                <div className="portfolio-avatar" aria-hidden="true">
                  {initials}
                </div>
                <div>
                  <p className="eyebrow">YOUR PROFILE</p>
                  <h2>{user.name}</h2>
                  <p>
                    {user.roles.length > 0 ? user.roles.join(", ") : "Account"}
                  </p>
                </div>
                <div className="portfolio-profile-actions">
                  {!isEditing && (
                    <button
                      className="portfolio-edit-button"
                      type="button"
                      onClick={() => {
                        setSaveMessage(null);
                        setSaveError(null);
                        setIsEditing(true);
                      }}
                    >
                      Edit profile
                    </button>
                  )}
                  <ChangePassword />
                </div>
              </div>

              <form className="portfolio-form" onSubmit={handleSubmit}>
                <div className="portfolio-form-grid">
                  <label>
                    Full name
                    <input
                      autoComplete="name"
                      required
                      value={name}
                      readOnly={!isEditing}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      autoComplete="email"
                      type="email"
                      required
                      value={email}
                      readOnly={!isEditing}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      autoComplete="tel"
                      type="tel"
                      value={phone}
                      placeholder="Add a phone number"
                      readOnly={!isEditing}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </label>
                </div>

                {saveMessage && (
                  <p className="portfolio-save-message" role="status">
                    {saveMessage}
                  </p>
                )}
                {saveError && (
                  <p className="login-error" role="alert">
                    {saveError}
                  </p>
                )}

                {isEditing && (
                  <div className="portfolio-form-actions">
                    <button
                      className="portfolio-cancel-button"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="login-submit"
                      type="submit"
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                )}
              </form>
            </>
          ) : (
            <p className="empty-state">
              We couldn’t find saved profile details for this session. Log out
              and sign in again to load your user data.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Portfolio;
