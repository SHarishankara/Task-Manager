
export default function LoadingSpinner({ text }) {
  return (
    <div className="nrt-loading">
      <div className="nrt-spinner"></div>
      <div>{text || "Loading..."}</div>
    </div>
  );
}