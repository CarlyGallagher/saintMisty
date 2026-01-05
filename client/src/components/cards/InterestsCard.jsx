export default function InterestsCard() {
  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Interests</div>

      <div style={{ fontSize: "12px" }}>
        <div style={{ display: "flex", marginBottom: "8px" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>General:</p>
          <p style={{ paddingLeft:40, margin: 0 }}>
            Music production, creative writing, Y2K aesthetics, vintage fashion,
            digital art, late night drives, vinyl collecting, synthwave
          </p>
        </div>

        <div style={{ display: "flex", marginBottom: "8px" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>Music:</p>
          <p style={{ paddingLeft:40, margin: 0 }}>
            Indie pop, alternative R&B, dream pop, bedroom pop,
            lo-fi beats, hyperpop, city pop
          </p>
        </div>

        <div style={{ display: "flex", marginBottom: "8px" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>Movies:</p>
          <p style={{ paddingLeft:40, margin: 0 }}>
            Coming-of-age films, indie dramas, sci-fi classics,
            90s rom-coms, Studio Ghibli, Wong Kar-wai films
          </p>
        </div>

        <div style={{ display: "flex" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>Zodiac:</p>
          <p style={{ paddingLeft:40, margin: 0 }}>
            ♓ Pisces Sun, Cancer Moon, Libra Rising
          </p>
        </div>
      </div>
    </div>
  );
}
