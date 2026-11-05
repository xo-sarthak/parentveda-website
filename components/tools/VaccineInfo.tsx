import INFO from "@/lib/vaccine-info.json";

/* "Learn why" content for each vaccine, the same text the app's vaccination
   tracker shows (pp_vaccine_data.dart), exported to vaccine-info.json. */
type Info = {
  id: string;
  name: string;
  protects: string;
  diseases: string[];
  why: string;
  reactions?: string[];
  myths?: [string, string][];
  faqs?: [string, string][];
  redFlags?: string[];
};

const REACTIONS = ["Mild soreness or redness where the shot was given", "A low-grade fever for a day or two", "Being a little more sleepy or fussy than usual"];
const RED_FLAGS = ["Difficult or noisy breathing, or swelling of the face or lips", "A seizure, or unusual floppiness or drowsiness", "A high fever that won't settle, or a rash with vomiting"];

export default function VaccineInfo() {
  return (
    <section className="vax-info" aria-labelledby="vax-info-title">
      <h2 id="vax-info-title">What each vaccine protects against</h2>
      {(INFO as unknown as Info[]).map((v) => (
        <details key={v.id}>
          <summary>
            <strong>{v.name}</strong>
            <span>{v.protects}</span>
          </summary>
          <h4>Protects against</h4>
          <ul>
            {v.diseases.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h4>Why it matters</h4>
          <p>{v.why}</p>
          {v.myths?.map(([m, f]) => (
            <p key={m}>
              <strong>Myth:</strong> {m} <strong>Fact:</strong> {f}
            </p>
          ))}
          {v.faqs && v.faqs.length > 0 && (
            <>
              <h4>Parents ask</h4>
              {v.faqs.map(([q, a]) => (
                <p key={q}>
                  <strong>{q}</strong> {a}
                </p>
              ))}
            </>
          )}
          <h4>Usual reactions</h4>
          <ul>
            {(v.reactions ?? REACTIONS).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h4>See a doctor at once if</h4>
          <ul>
            {(v.redFlags ?? RED_FLAGS).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}
