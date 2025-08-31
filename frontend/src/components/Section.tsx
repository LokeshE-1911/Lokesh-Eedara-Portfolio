import { ReactNode } from "react";
export default function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="section hoverable">
      <h3 style={{margin:"0 0 6px"}}>{title}</h3>
      {children}
    </div>
  );
}
