import Image from "next/image";
import Section from "@/components/Section";
import ChatBox from "@/components/ChatBox";
import { fetchResume } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const resume = await fetchResume(); // basics, skills, work, projects, awards, education
  const basics = resume?.basics || {};
  const skills = resume?.skills || [];
  const work = resume?.work || [];
  const projects = resume?.projects || [];
  const awards = resume?.awards || [];

  return (
    <main id="home" className="wrap" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      {/* top row: profile + about */}
      <div className="card hoverable" id="profile">
        <h2>Profile picture</h2>
        <Image className="profile" alt="Profile" src="/profile.jpg" width={800} height={800}/>
        <div className="muted" style={{marginTop:8}}>
          {basics?.name || "Lokesh Eedara"} — MIS Graduate • AI & Full-Stack Developer
        </div>
      </div>

      <div className="card hoverable" id="about">
        <h2>About</h2>
        <p>{basics?.summary || "AI & Full-Stack developer."}</p>
        <div className="chips">
          {skills.flatMap((s:any)=>(s.keywords||[])).slice(0,20).map((k:string,i:number)=><span key={i}>{k}</span>)}
        </div>
      </div>

      {/* middle: wide chat */}
      <div style={{gridColumn:"1 / -1"}}>
        <ChatBox/>
      </div>

      {/* experience */}
      <div className="card hoverable" id="experience" style={{gridColumn:"1 / -1"}}>
        <h2>Experience</h2>
        {work.map((w:any, i:number)=>(
          <div key={i} className="section">
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <strong>{w.position}</strong><span className="muted">{w.name}</span>
            </div>
            <p className="muted">{w.summary}</p>
            <div className="tags">{(w.highlights||[]).map((h:string, j:number)=><span key={j}>{h}</span>)}</div>
          </div>
        ))}
      </div>

      {/* projects */}
      <div className="card hoverable" id="projects" style={{gridColumn:"1 / -1"}}>
        <h2>Projects</h2>
        {projects.map((p:any, i:number)=>(
          <div key={i} className="section">
            <div className="proj__title" style={{fontWeight:700}}>{p.name}</div>
            <p>{p.description}</p>
            <div className="tags">{(p.highlights||[]).map((h:string, j:number)=><span key={j}>{h}</span>)}</div>
          </div>
        ))}
      </div>

      {/* awards */}
      <div className="card hoverable" id="awards" style={{gridColumn:"1 / -1"}}>
        <h2>Awards</h2>
        {awards.map((a:any, i:number)=>(
          <div key={i} className="section" style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{fontSize:24}}>🏆</div>
            <div>
              <div style={{fontWeight:700}}>{a.title}</div>
              <div className="muted">{a.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
