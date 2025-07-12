export default function SwapRequest({ user, skill, status }) {
  return (
    <div className="border p-4 rounded-lg mb-2">
      <p><strong>{user}</strong> requested <strong>{skill}</strong></p>
      <p className="text-sm text-gray-600">Status: {status}</p>
    </div>
  );
}
