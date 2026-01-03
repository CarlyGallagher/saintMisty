import { Link } from "react-router-dom";

export default function InfoCard() {
  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Saint Misty</div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <img
          src="https://via.placeholder.com/150"
          alt="Saint Misty"
          className="y2k-img"
          style={{ width: "150px", height: "150px", borderRadius: "8px" }}
        />
      </div>
      <table style={{ width: "100%", fontSize: "12px" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>Age:</td>
            <td style={{ padding: "4px" }}>21</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>Pronouns:</td>
            <td style={{ padding: "4px" }}>She/Her</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>Location:</td>
            <td style={{ padding: "4px" }}>Los Angeles, CA</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>Last Login:</td>
            <td style={{ padding: "4px" }}>{new Date().toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "4px" }}>Mood:</td>
            <td style={{ padding: "4px" }}>✨ creative ✨</td>
          </tr>
        </tbody>
      </table>
      <div className="y2k-divider"></div>
      <Link to="/pictures" style={{ fontSize: "12px", fontWeight: "bold" }}>
        VIEW MY PICS | VIDEOS
      </Link>
    </div>
  );
}
