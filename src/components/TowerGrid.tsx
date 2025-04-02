import React from "react";
import { Building2, Users, Clock } from "lucide-react";
import type { Tower } from "../types";

interface TowerGridProps {
  tower: Tower;
  onUpdateHome: (
    floor: number,
    homeIndex: number,
    residents: number,
    days: number
  ) => void;
}

export function TowerGrid({ tower, onUpdateHome }: TowerGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 print:hidden">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Tower {tower.name}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-2 text-left">Home</th>
              <th className="border px-4 py-2 text-left">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Residents</span>
                </div>
              </th>
              <th className="border px-4 py-2 text-left">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Days Stayed</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tower.stories.map((story, storyIndex) =>
              story.homes.map((home, homeIndex) => (
                <tr
                  key={`${story.floor}-${home.number}`}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-2">{home.number}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      value={home.residents}
                      onChange={(e) =>
                        onUpdateHome(
                          storyIndex,
                          homeIndex,
                          parseInt(e.target.value) || 0,
                          home.daysStayed
                        )
                      }
                      className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={home.daysStayed}
                      onChange={(e) =>
                        onUpdateHome(
                          storyIndex,
                          homeIndex,
                          home.residents,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
