export default function Profile() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input type="text" placeholder="Your Name" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Skills Offered</label>
          <input type="text" placeholder="e.g., Photoshop, Excel" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Skills Wanted</label>
          <input type="text" placeholder="e.g., Guitar, French" className="w-full border p-2 rounded" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
