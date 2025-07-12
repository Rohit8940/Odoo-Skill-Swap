export default function SkillCard({ skill, type }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{skill}</h3>
      <p className="text-sm text-gray-500">{type === "offered" ? "Offered" : "Wanted"}</p>
    </div>
  );
}
