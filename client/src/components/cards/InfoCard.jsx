import { Link } from "react-router-dom";
import profileImg from "../../assets/SaintMistyProfileImg.jpeg";

export default function InfoCard() {
  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Saint Misty</div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <div>
          <img
            src={profileImg}
            alt="Saint Misty"
            className="y2k-img"
            style={{ width: "100%", height: "auto", flexShrink: 0, marginBottom: "8px" }}
          />
          <p style={{ fontSize: "15px", textAlign: "center", margin: 0 }}>
            <span style={{ fontWeight: "bold" }}>Mood:</span> Gorgeous 💅
          </p>
        </div>
        <table style={{ width: "100%", fontSize: "" }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: "bold", padding: "1px" }}>Age:</td>
              <td style={{ padding: "1px" }}>69</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", padding: "1px" }}>Pronouns:</td>
              <td style={{ padding: "1px" }}>She/Her</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", padding: "1px" }}>Location:</td>
              <td style={{ padding: "1px" }}>San Diego, CA</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", padding: "1px" }}>Last Login:</td>
              <td style={{ padding: "1px" }}>{new Date().toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="y2k-divider"></div>
      <Link to="/pictures" style={{ fontSize: "12px", fontWeight: "bold" }}>
        VIEW MY PICS | VIDEOS
      </Link>
    </div>
  );
}
