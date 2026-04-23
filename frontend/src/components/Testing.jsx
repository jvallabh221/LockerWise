import React, { useState, useEffect } from "react";

const App = () => {
    // Example data: Replace with your actual backend data
    const lockersExpiringToday = [
        { _id: "1", name: "Locker1" },
        { _id: "2", name: "Locker2" },
        { _id: "3", name: "Locker3" },
    ];

    const lockersExpiringNext7Days = [
        { _id: "1", name: "Locker1" },
        { _id: "2", name: "Locker2" },
        { _id: "4", name: "Locker4" },
        { _id: "5", name: "Locker5" },
    ];

    // State to hold filtered lockers
    const [filteredLockers, setFilteredLockers] = useState([]);

    useEffect(() => {
        // Extract IDs of lockers expiring today
        const todayIds = lockersExpiringToday.map((locker) => locker._id);

        // Filter lockers expiring in the next 7 days to exclude today's lockers
        const filtered = lockersExpiringNext7Days.filter((locker) => !todayIds.includes(locker._id));

        setFilteredLockers(filtered);
    }, [lockersExpiringToday, lockersExpiringNext7Days]);

    return (
        <div>
            <h2>Lockers Expiring Today</h2>
            <ul>
                {lockersExpiringToday.map((locker) => (
                    <li key={locker._id}>{locker.name}</li>
                ))}
            </ul>

            <h2>Lockers Expiring in Next 7 Days (Excluding Today)</h2>
            <ul>
                {filteredLockers.map((locker) => (
                    <li key={locker._id}>{locker.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
