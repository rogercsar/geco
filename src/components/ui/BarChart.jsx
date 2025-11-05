import React from 'react';
import { motion } from 'framer-motion';

const BarChart = ({ data, height = 200, showValues = true, color = '#3b82f6' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-secondary-500">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <div className="w-full">
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <div
              key={index}
              className="border-t border-secondary-200"
              style={{ marginTop: `${ratio * 100}%` }}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative h-full flex items-end justify-between px-2">
          {data.map((item, index) => {
            const percentage = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 mx-1">
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${percentage}%` }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="w-full rounded-t-sm relative group"
                  style={{ 
                    backgroundColor: color,
                    minHeight: item.value > 0 ? '4px' : '0px'
                  }}
                >
                  {/* Tooltip */}
                  {showValues && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {item.label}: {item.value}
                    </div>
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-2 text-xs text-secondary-600 text-center truncate w-full">
                  {item.label}
                </div>

                {/* Value */}
                {showValues && (
                  <div className="text-xs font-medium text-secondary-900 mt-1">
                    {item.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;

