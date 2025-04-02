import React, { useState } from "react";
import { Calculator, IndianRupee, Printer } from "lucide-react";
import type { Tower, BillCalculation } from "../types";

interface BillCalculatorProps {
  towers: Tower[];
  onCalculate: (totalAmount: number) => void;
}

export function BillCalculator({ towers, onCalculate }: BillCalculatorProps) {
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [calculations, setCalculations] = useState<BillCalculation[]>([]);

  const handleCalculate = () => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) return;

    let totalResidentDays = 0;
    const newCalculations: BillCalculation[] = [];

    // Calculate total resident days across all towers
    towers.forEach((tower) => {
      tower.stories.forEach((story) => {
        story.homes.forEach((home) => {
          const residentDays = home.residents * home.daysStayed;
          totalResidentDays += residentDays;

          newCalculations.push({
            towerId: tower.id,
            towerName: tower.name,
            floor: story.floor,
            homeNumber: home.number,
            residents: home.residents,
            daysStayed: home.daysStayed,
            share: 0, // Will be calculated after we have the total
          });
        });
      });
    });

    // Calculate each home's share
    newCalculations.forEach((calc) => {
      const residentDays = calc.residents * calc.daysStayed;
      calc.share = (residentDays / totalResidentDays) * amount;
    });

    setCalculations(newCalculations);
    onCalculate(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 col-span-2">
      <div className="flex items-center gap-2 mb-4 print:hidden">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Bill Calculator</h2>
      </div>
      <div className="space-y-4">
        <div className="print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Water Bill Amount
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <button
          onClick={handleCalculate}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
        >
          Calculate Shares
        </button>
        {calculations.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2 print:hidden">
                Calculation Results
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Home</th>
                      <th className="px-4 py-2 text-right">Residents</th>
                      <th className="px-4 py-2 text-right">Days</th>
                      <th className="px-4 py-2 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.map((calc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          {`T${calc.towerName}${calc.homeNumber}`}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {calc.residents}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {calc.daysStayed}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          ₹{calc.share.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors print:hidden"
            >
              <Printer className="w-4 h-4" />
              Print Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
