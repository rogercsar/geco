import React from 'react';
import { motion } from 'framer-motion';

const PieChart = ({ data, size = 200, showLegend = true, colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-secondary-500">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-secondary-500">
        <p>Nenhum valor encontrado</p>
      </div>
    );
  }

  let currentAngle = 0;
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  const createPath = (startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage * 3.6);
    
    const path = createPath(startAngle, endAngle);
    const color = colors[index % colors.length];
    
    currentAngle = endAngle;
    
    return {
      ...item,
      path,
      color,
      percentage,
      startAngle,
      endAngle
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => (
            <motion.path
              key={index}
              d={segment.path}
              fill={segment.color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            />
          ))}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-secondary-900">
              {total.toLocaleString()}
            </div>
            <div className="text-xs text-secondary-600">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="flex items-center space-x-2"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-secondary-900 truncate">
                  {segment.label}
                </div>
                <div className="text-xs text-secondary-600">
                  {segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;

