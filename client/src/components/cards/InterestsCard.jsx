export default function InterestsCard() {
  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Interests</div>

      <div style={{ fontSize: "15px" }}>
        <div style={{ display: "flex", marginBottom: "8px" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>General:</p>
          <p style={{ paddingLeft: 40, margin: 0 }}>
            Music production, creative writing, Y2K aesthetics, vintage fashion,
            digital art, late night drives, vinyl collecting, synthwave
          </p>
        </div>

        <div style={{ display: "flex", marginBottom: "8px" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>Music:</p>
          <p style={{ paddingLeft: 40, margin: 0 }}>
            Albums: Artpop - Gaga, Circus- Britney, II - Bad Books
          </p>
        </div>

        <div style={{ display: "flex", marginBottom: "8px" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>Movies:</p>
          <p style={{ paddingLeft: 40, margin: 0 }}>
            Juno, Lisa Frankenstein, Scream
            Shows: Portlandia, The Office, Sex and The City
          </p>
        </div>

        <div style={{ display: "flex" }}>
          <p style={{ fontWeight: "bold", margin: 0, minWidth: "80px" }}>Zodiac:</p>
          <p style={{ paddingLeft: 40, margin: 0 }}>
            Zodiac: Cancer ☀️  Aquarius 🌙 Sag ⬆️  
            B-day: July 2nd
          </p>
        </div>
      </div>
    </div>
  );
}
