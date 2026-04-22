/**
 * 省份选择器组件
 */
import React from 'react'
import { provinces, ProvinceData } from '../../data/provinces'

interface ProvinceSelectorProps {
  onSelect: (province: ProvinceData) => void
  selectedProvince: ProvinceData
}

export const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({ onSelect, selectedProvince }) => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-gray-900/90 rounded-lg p-3 shadow-2xl border border-gray-700">
        <h3 className="text-white text-sm font-semibold mb-2">选择省份</h3>
        <select
          value={selectedProvince.name}
          onChange={(e) => {
            const province = provinces.find(p => p.name === e.target.value)
            if (province) {
              onSelect(province)
            }
          }}
          className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {provinces.map((province) => (
            <option key={province.name} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
        <div className="mt-2 text-xs text-gray-400">
          当前: {selectedProvince.name}
        </div>
      </div>
    </div>
  )
}

export default ProvinceSelector
