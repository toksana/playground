interface ConsentBannerProps {
  appName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentBanner = ({
  appName,
  onAccept,
  onDecline,
}: ConsentBannerProps) => (
  <section aria-label="Analytics consent" className="pg-consent">
    <p className="pg-consent-text">
      We use analytics cookies to see how {appName} is used.
    </p>
    <div className="pg-consent-actions">
      <button
        type="button"
        className="pg-consent-button pg-consent-accept"
        onClick={onAccept}
      >
        Accept
      </button>
      <button type="button" className="pg-consent-button" onClick={onDecline}>
        Decline
      </button>
    </div>
  </section>
);
