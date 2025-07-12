import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
      <Link to="/" className="text-blue-600 underline">Go Home</Link>
    </div>
  );
}
