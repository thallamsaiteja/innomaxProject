import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// --- Custom Icon Definitions (Replacing react-icons/fa) ---
// Using inline SVG to ensure compatibility and remove external dependency.

const ChartIcon = (props) => (
    <svg {...props} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M128 320c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm256 0c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zM128 416c-17.7 0-32-14.3-32-32s14.3-32 32-32h144c17.7 0 32 14.3 32 32s-14.3 32-32 32H128zm352-160c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32h-32zM0 256c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z" /></svg>
);
const UsersIcon = (props) => (
    <svg {...props} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zM276 498.4c-11.4 12.5-30.8 12.5-42.2 0L193 456c-10-10-25.7-10-35.7 0l-40.8 44.2c-11.4 12.5-30.8 12.5-42.2 0L8.6 422.4c-11.4-12.5-11.4-32.5 0-45L128 256l128 128-40.8 44.2zM416 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zM509.4 377.4c-11.4 12.5-30.8 12.5-42.2 0L384 336c-10-10-25.7-10-35.7 0L307 377.4c-11.4 12.5-11.4 32.5 0 45L416 498.4c11.4 12.5 30.8 12.5 42.2 0L556.4 422.4c11.4-12.5 11.4-32.5 0-45L480 336l-40.8 44.2z" /></svg>
);
const ShieldIcon = (props) => (
    <svg {...props} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M112 112c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H112zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H112zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H112zM32 32C14.3 32 0 46.3 0 64S14.3 96 32 96V416c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32V96c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" /></svg>
);
const FlagIcon = (props) => (
    <svg {...props} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-26.7 0-48 21.3-48 48v288c0 17.7 14.3 32 32 32h144c17.7 0 32-14.3 32-32V48c0-26.7-21.3-48-48-48H320zM64 480c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM160 128c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32z" /></svg>
);
const CoinsIcon = (props) => (
    <svg {...props} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M384 320c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H384zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H384zm-96-64c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zM192 352c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zm0-96c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zM96 256c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H96zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H96zM0 64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z" /></svg>
);
const ClipboardIcon = (props) => (
    <svg {...props} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M112 112c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H112zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H112zm0 96c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H112zM32 32C14.3 32 0 46.3 0 64S14.3 96 32 96V416c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32V96c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" /></svg>
);
const SpinnerIcon = (props) => (
    <svg {...props} className="w-6 h-6 animate-spin mr-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M224 512c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32h-32zM0 256c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 224h32c17.7 0 32 14.3 32 32s-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32s14.3-32 32-32zM224 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zM128 64c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zM384 384c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zM384 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32zM128 384c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32z" /></svg>
);


// --- MOCK API SERVICE ---
// Since we are not connected to an actual backend, these functions simulate fetching data.

const MOCK_API_DATA = {
    overview: {
        totalClients: 1240,
        riskProfilesCompleted: 980,
        activeSIPs: 650,
        pieData: [
            { name: "Aggressive", value: 350 },
            { name: "Moderate", value: 450 },
            { name: "Conservative", value: 180 },
        ],
        growthData: [
            { month: "Oct", value: 50 },
            { month: "Nov", value: 80 },
            { month: "Dec", value: 120 }
        ],
    },
    clients: [
        { userId: 1, fullName: 'Alice Smith', email: 'alice@mail.com', role: 'Client', investments: '$50k' },
        { userId: 2, fullName: 'Bob Johnson', email: 'bob@mail.com', role: 'Admin', investments: '$0' },
        { userId: 3, fullName: 'Charlie Brown', email: 'charlie@mail.com', role: 'Client', investments: '$150k' },
        { userId: 4, fullName: 'Diana Prince', email: 'diana@mail.com', role: 'Client', investments: '$75k' },
    ]
};

const getAdminOverview = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_API_DATA.overview;
};

const getAllClients = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_API_DATA.clients;
};

// --- 1. Sidebar Component ---

const Sidebar = ({ active, setActive }) => {
    const menu = [
        { key: "charts", label: "Dashboard", icon: ChartIcon },
        { key: "clients", label: "Clients", icon: UsersIcon },
        { key: "risks", label: "Risks", icon: ShieldIcon },
        { key: "goals", label: "Goals", icon: FlagIcon },
        { key: "sips", label: "SIPs", icon: CoinsIcon },
        { key: "investments", label: "Investments", icon: ClipboardIcon },
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-5 flex flex-col shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-8 text-indigo-400 text-center">Admin Panel</h2>
            <ul className="space-y-2 flex-grow">
                {menu.map((item) => {
                    const IconComponent = item.icon; // Dynamically use the assigned SVG component
                    return (
                        <li
                            key={item.key}
                            onClick={() => setActive(item.key)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active === item.key ?
                                "bg-indigo-600 font-semibold shadow-md" :
                                "hover:bg-gray-700 text-gray-300"
                                }`}
                        >
                            <IconComponent />
                            <span className="text-sm">{item.label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// --- 2. StatsCards Component ---

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    const cardData = [
        { title: "Total Clients", value: stats.totalClients, color: "border-blue-500", icon: UsersIcon },
        { title: "Completed Risk Profiles", value: stats.riskProfilesCompleted, color: "border-green-500", icon: ShieldIcon },
        { title: "Active SIPs", value: stats.activeSIPs, color: "border-yellow-500", icon: CoinsIcon },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cardData.map((card) => (
                <div key={card.title} className={`bg-white shadow-xl rounded-xl p-5 border-l-4 ${card.color} transition duration-300 hover:shadow-2xl flex items-center justify-between`}>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
                        <p className="text-3xl font-extrabold text-gray-900">{card.value.toLocaleString()}</p>
                    </div>
                    <card.icon className="w-8 h-8 text-gray-300" />
                </div>
            ))}
        </div>
    );
};

// --- 3. Charts Component ---

const Charts = ({ overviewData }) => {
    if (!overviewData) return null;

    const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-xl">
                <h3 className="text-xl mb-4 font-bold text-gray-800 border-b pb-2">Risk Profile Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={overviewData.pieData}
                            dataKey="value"
                            nameKey="name"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={90}
                            innerRadius={40}
                            paddingAngle={5}
                            isAnimationActive={false}
                        >
                            {overviewData.pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Clients']} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xl">
                <h3 className="text-xl mb-4 font-bold text-gray-800 border-b pb-2">New Client Growth Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={overviewData.growthData}>
                        <XAxis dataKey="month" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" radius={[10, 10, 0, 0]} name="New Clients" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- 4. CustomersTable Component ---

const CustomersTable = ({ clientsData }) => {
    const [search, setSearch] = useState("");

    const filtered = clientsData.filter(
        (c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Client Information</h2>
            <input
                type="text"
                placeholder="Search by name or email..."
                className="border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-4 py-2 rounded-lg w-full mb-6 transition duration-150"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-xl">Name</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-xl">Investments</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filtered.map((client) => (
                            <tr key={client.userId} className="hover:bg-indigo-50 transition duration-100">
                                <td className="p-3 whitespace-nowrap font-medium text-gray-900">{client.fullName}</td>
                                <td className="p-3 whitespace-nowrap text-gray-600">{client.email}</td>
                                <td className="p-3 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${client.role === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {client.role}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap text-gray-600">{client.investments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-6 text-gray-500">No clients match your search criteria.</div>
                )}
            </div>
        </div>
    );
};

// --- 5. Main App Component ---

const App = () => {
    const [active, setActive] = useState("charts");
    const [overviewData, setOverviewData] = useState(null);
    const [clientsData, setClientsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all required data once on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch both required data sets concurrently
                const [overview, clients] = await Promise.all([
                    getAdminOverview(),
                    getAllClients()
                ]);

                setOverviewData(overview);
                setClientsData(clients);

            } catch (err) {
                // This catches the 401 error or any network error
                console.error("Dashboard Data Fetch Error:", err);
                // Note: I'm not using a real auth token, so mock data load is key.
                // If a real API failed, we'd show this error:
                // setError("Data failed to load. Please verify your authentication and server connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper function to render the main content section
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-96 bg-white rounded-xl shadow-xl mt-6">
                    <SpinnerIcon />
                    <p className="text-lg text-gray-700 font-semibold">Loading Dashboard Data...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-8 bg-red-50 border border-red-400 text-red-700 rounded-xl shadow-lg mt-6">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            );
        }

        // Render the active section, passing the data as props
        switch (active) {
            case "charts":
                return <Charts overviewData={overviewData} />;
            case "clients":
                return <CustomersTable clientsData={clientsData} />;
            case "risks":
            case "goals":
            case "sips":
            case "investments":
                return (
                    <div className="p-8 bg-white rounded-xl shadow-xl mt-6 text-gray-600 text-center min-h-[400px] flex items-center justify-center text-2xl font-light">
                        {active.charAt(0).toUpperCase() + active.slice(1)} Module (Coming Soon)
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar remains a permanent navigation element */}
            <Sidebar active={active} setActive={setActive} />

            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                    Admin Dashboard Overview
                </h1>

                {/* StatsCards show only on the default 'charts' view */}
                {active === "charts" && overviewData && !loading && !error && (
                    <StatsCards stats={overviewData} />
                )}

                {renderContent()}
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    return <App />;
}
