"use client"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">This is a test version to verify the component works.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Websites</h2>
          <p className="text-gray-600">Manage web projects</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Games</h2>
          <p className="text-gray-600">Manage game projects</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Experiences</h2>
          <p className="text-gray-600">Manage work experience</p>
        </div>
      </div>
    </div>
  )
}
