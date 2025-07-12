import SkillCard from "../components/Skillcard";

export default function Home() {
  const skills = ["Photoshop", "Excel", "Python", "Cooking"];
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Browse Skills</h2>
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, idx) => (
          <SkillCard key={idx} skill={skill} type="offered" />
        ))}
      </div>
    </div>
  );
}
