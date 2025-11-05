import React from 'react';
import { motion } from 'framer-motion';

const LineChart = ({ 
  data, 
  height = 200, 
  showDots = true, 
  showGrid = true,
  color = '#3b82f6',
  strokeWidth = 2,
  showValues = false
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-secondary-500">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const width = 100;
  const padding = 20;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxValue - item.value) / range) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className="w-full">
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                <line
                  key={index}
                  x1={padding}
                  y1={padding + ratio * chartHeight}
                  x2={width - padding}
                  y2={padding + ratio * chartHeight}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
            </g>
          )}

          {/* Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Dots */}
          {showDots && points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="hover:r-6 transition-all duration-200 cursor-pointer"
            />
          ))}

          {/* Value labels */}
          {showValues && points.map((point, index) => (
            <motion.text
              key={index}
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="text-xs font-medium fill-secondary-900"
              initial={{ opacity: 0, y: point.y - 5 }}
              animate={{ opacity: 1, y: point.y - 10 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + 0.5,
                ease: "easeOut"
              }}
            >
              {point.value}
            </motion.text>
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-5">
          {data.map((item, index) => (
            <div
              key={index}
              className="text-xs text-secondary-600 text-center"
              style={{ 
                transform: `translateX(${index * (chartWidth / (data.length - 1))}px)`,
                marginLeft: index === 0 ? '0' : '-50%'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;

