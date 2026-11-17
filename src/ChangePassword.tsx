import { useEffect, useRef, useState, type FormEvent } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type ChangePasswordMutationData = {
  changePassword: {
    message: string;
  };
};

type ChangePasswordMutationVariables = {
  currentPassword: string;
  newPassword: string;
};

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword: ChangePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      message
    }
  }
`;

function ChangePassword() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const passwordDialogRef = useRef<HTMLDialogElement>(null);
  const [changePassword, { loading: isSavingPassword }] = useMutation<
    ChangePasswordMutationData,
    ChangePasswordMutationVariables
  >(CHANGE_PASSWORD_MUTATION);

  useEffect(() => {
    if (isChangingPassword && !passwordDialogRef.current?.open) {
      passwordDialogRef.current?.showModal();
    }
  }, [isChangingPassword]);

  const closeDialog = () => {
    setIsChangingPassword(false);
    setPasswordMessage(null);
    setPasswordError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("currentPassword"));
    const newPassword = String(formData.get("newPassword"));
    const confirmPassword = String(formData.get("confirmPassword"));

    setPasswordMessage(null);
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const { data } = await changePassword({
        variables: { currentPassword, newPassword },
      });
      const result = data?.changePassword;
      if (!result?.message) {
        setPasswordError(
          "Unable to change your password. Check your current password and try again.",
        );
        return;
      }

      form.reset();
      setPasswordMessage("Your password has been changed.");
      passwordDialogRef.current?.close();
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to change your password. Please try again.",
      );
    }
  };

  return (
    <>
      <button
        className="portfolio-edit-button"
        type="button"
        aria-haspopup="dialog"
        disabled={isSavingPassword}
        onClick={() => {
          setPasswordMessage(null);
          setPasswordError(null);
          setIsChangingPassword(true);
        }}
      >
        Change password
      </button>

      {isChangingPassword && (
        <dialog
          ref={passwordDialogRef}
          className="portfolio-password-dialog"
          aria-labelledby="change-password-title"
          onCancel={(event) => {
            event.preventDefault();
            if (!isSavingPassword) {
              closeDialog();
            }
          }}
        >
          <div className="portfolio-password-dialog-heading">
            <div>
              <p className="eyebrow">ACCOUNT SECURITY</p>
              <h2 id="change-password-title">Change password</h2>
              <p>Enter your current password and choose a new one.</p>
            </div>
            <button
              className="portfolio-dialog-close"
              type="button"
              aria-label="Close change password dialog"
              disabled={isSavingPassword}
              onClick={closeDialog}
            >
              ×
            </button>
          </div>
          <form
            className="portfolio-password-form"
            onSubmit={handleSubmit}
          >
            <div className="portfolio-form-grid">
              <label>
                Current password
                <input
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <label>
                New password
                <input
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              <label>
                Confirm new password
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
            </div>

            {passwordMessage && (
              <p className="portfolio-save-message" role="status">
                {passwordMessage}
              </p>
            )}
            {passwordError && (
              <p className="login-error" role="alert">
                {passwordError}
              </p>
            )}

            <div className="portfolio-form-actions">
              <button
                className="portfolio-cancel-button"
                type="button"
                disabled={isSavingPassword}
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                className="login-submit"
                type="submit"
                disabled={isSavingPassword}
              >
                {isSavingPassword ? "Changing..." : "Update password"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}

export default ChangePassword;
