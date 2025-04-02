import React, { useState, useEffect } from "react";
import { HeaterIcon as WaterIcon, Calendar } from "lucide-react";
import { TowerGrid } from "./components/TowerGrid";
import { BillCalculator } from "./components/BillCalculator";
import type { Tower } from "./types";

// Generate initial data for towers
const generateTowerData = (towerName: string): Tower => {
  const stories = Array.from({ length: 15 }, (_, floorIndex) => ({
    floor: floorIndex + 1,
    homes: Array.from({ length: 4 }, (_, homeIndex) => ({
      id: `${towerName}-${floorIndex + 1}-${homeIndex + 1}`,
      number: `${floorIndex + 1}${String.fromCharCode(65 + homeIndex)}`, // 1A, 1B, 1C, 1D
      residents: 0,
      daysStayed: 0,
    })),
  }));

  return {
    id: towerName.toLowerCase(),
    name: towerName,
    stories,
  };
};

const initialTowers: Tower[] = [generateTowerData("A"), generateTowerData("B")];

const STORAGE_KEY = "water-bill-towers";

const MONTHS = [
  { value: "1", label: "January", days: 31 },
  { value: "2", label: "February", days: 28 },
  { value: "3", label: "March", days: 31 },
  { value: "4", label: "April", days: 30 },
  { value: "5", label: "May", days: 31 },
  { value: "6", label: "June", days: 30 },
  { value: "7", label: "July", days: 31 },
  { value: "8", label: "August", days: 31 },
  { value: "9", label: "September", days: 30 },
  { value: "10", label: "October", days: 31 },
  { value: "11", label: "November", days: 30 },
  { value: "12", label: "December", days: 31 },
];

function App() {
  const [towers, setTowers] = useState<Tower[]>(() => {
    // Try to load saved towers from localStorage
    const savedTowers = localStorage.getItem(STORAGE_KEY);
    return savedTowers ? JSON.parse(savedTowers) : initialTowers;
  });
  const [totalBillAmount, setTotalBillAmount] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth.toString();
  });

  // Save towers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(towers));
  }, [towers]);

  const handleUpdateHome = (
    towerId: string,
    floor: number,
    homeIndex: number,
    residents: number,
    days: number
  ) => {
    setTowers((currentTowers) =>
      currentTowers.map((tower) =>
        tower.id === towerId
          ? {
              ...tower,
              stories: tower.stories.map((story, storyIndex) =>
                storyIndex === floor
                  ? {
                      ...story,
                      homes: story.homes.map((home, index) =>
                        index === homeIndex
                          ? { ...home, residents, daysStayed: days }
                          : home
                      ),
                    }
                  : story
              ),
            }
          : tower
      )
    );
  };

  const handleMonthChange = (monthValue: string) => {
    setSelectedMonth(monthValue);
    const selectedMonthData = MONTHS.find((m) => m.value === monthValue);
    if (selectedMonthData) {
      setTowers((currentTowers) =>
        currentTowers.map((tower) => ({
          ...tower,
          stories: tower.stories.map((story) => ({
            ...story,
            homes: story.homes.map((home) => ({
              ...home,
              daysStayed: selectedMonthData.days,
            })),
          })),
        }))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WaterIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Water Bill Splitter
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label} ({month.days} days)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-4 py-6 max-w-7xl">
          {towers.map((tower) => (
            <TowerGrid
              key={tower.id}
              tower={tower}
              onUpdateHome={(floor, homeIndex, residents, days) =>
                handleUpdateHome(tower.id, floor, homeIndex, residents, days)
              }
            />
          ))}
          <BillCalculator towers={towers} onCalculate={setTotalBillAmount} />
        </div>
      </main>
    </div>
  );
}

export default App;
