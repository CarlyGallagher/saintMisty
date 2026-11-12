import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  fetchEmailPreferences,
  updateEmailPreferences,
  unsubscribeWithToken,
} from "../api/newsletter";
import "../styles/EmailPreferences.css";

const OPTIONS = [
  { key: "music", label: "Music", hint: "New songs, releases and pre-saves" },
  { key: "merch", label: "Merch", hint: "New drops and restocks" },
  { key: "shows", label: "Shows", hint: "Tour dates and tickets" },
];
const ALL_KEYS = OPTIONS.map((o) => o.key);

// Reached from the "Update your preferences" and "Unsubscribe" links in each newsletter
export default function EmailPreferences() {
  const { id, token } = useParams();
  const [searchParams] = useSearchParams();
  const cameToUnsubscribe = searchParams.get("unsubscribe") === "1";

  const [state, setState] = useState("loading"); // loading, ready, saving, unsubscribed, error
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEmailPreferences(id, token);
        setEmail(data.email);
        // No saved categories means they get everything
        setInterests(data.interests?.length ? data.interests : ALL_KEYS);
        setState("ready");
      } catch (err) {
        setError(err.response?.data?.error || "We couldn't load your email settings. Please try again later.");
        setState("error");
      }
    })();
  }, [id, token]);

  const toggle = (key) => {
    setMessage("");
    setInterests((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setState("saving");
    setMessage("");
    try {
      const data = await updateEmailPreferences(id, token, interests);
      setInterests(data.interests);
      setMessage("Saved! You'll only get the emails you picked.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Couldn't save. Please try again.");
    } finally {
      setState((s) => (s === "saving" ? "ready" : s));
    }
  };

  const handleUnsubscribe = async () => {
    setState("saving");
    setMessage("");
    try {
      await unsubscribeWithToken(id, token);
      setState("unsubscribed");
    } catch (err) {
      setMessage(err.response?.data?.error || "Couldn't unsubscribe. Please try again.");
      setState("ready");
    }
  };

  return (
    <div className="email-prefs-page">
      <div className="email-prefs-card">
        <div className="email-prefs-header">
          <h1>Email settings</h1>
        </div>

        <div className="email-prefs-body">
          {state === "loading" && <p>Loading...</p>}

          {state === "error" && <p role="alert">{error}</p>}

          {state === "unsubscribed" && (
            <>
              <h2>You're unsubscribed</h2>
              <p>
                <strong>{email}</strong> won't get any more Saint Misty emails. Changed your mind? You can sign up
                again on the website any time.
              </p>
            </>
          )}

          {(state === "ready" || state === "saving") && (
            <>
              {cameToUnsubscribe && (
                <div className="email-prefs-unsub-first">
                  <h2>Unsubscribe?</h2>
                  <p>
                    Stop all Saint Misty emails to <strong>{email}</strong>, or pick just the ones you want below.
                  </p>
                  <button
                    type="button"
                    className="email-prefs-btn email-prefs-btn-danger"
                    onClick={handleUnsubscribe}
                    disabled={state === "saving"}
                  >
                    Unsubscribe from everything
                  </button>
                </div>
              )}

              <form onSubmit={handleSave}>
                <h2>{cameToUnsubscribe ? "Or choose what you get" : "What do you want to hear about?"}</h2>
                {!cameToUnsubscribe && (
                  <p>
                    Emails go to <strong>{email}</strong>.
                  </p>
                )}

                <fieldset className="email-prefs-options">
                  <legend className="sr-only">Email topics</legend>
                  {OPTIONS.map(({ key, label, hint }) => (
                    <label key={key} className="email-prefs-option">
                      <input type="checkbox" checked={interests.includes(key)} onChange={() => toggle(key)} />
                      <span>
                        <strong>{label}</strong>
                        <small>{hint}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>

                <button
                  type="submit"
                  className="email-prefs-btn"
                  disabled={state === "saving" || interests.length === 0}
                >
                  {state === "saving" ? "Saving..." : "Save preferences"}
                </button>
                {interests.length === 0 && (
                  <p className="email-prefs-note">Pick at least one, or unsubscribe below.</p>
                )}
              </form>

              {message && (
                <p className="email-prefs-message" role="status">
                  {message}
                </p>
              )}

              {!cameToUnsubscribe && (
                <div className="email-prefs-footer">
                  <button
                    type="button"
                    className="email-prefs-link"
                    onClick={handleUnsubscribe}
                    disabled={state === "saving"}
                  >
                    Unsubscribe from all emails
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
