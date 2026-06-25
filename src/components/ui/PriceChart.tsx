import React, { memo } from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

interface DataPoint {
    date: Date;
    formattedDate?: string;
    price: number;
}

interface PriceChartProps {
    data: DataPoint[];
    height?: number;
    color?: string;
}

export const PriceChart = memo(({
    data,
    height = 150,
    color = '#D97706'
}: PriceChartProps) => {
    if (data.length < 2) return null;

    const screenWidth = Dimensions.get('window').width - 64; // Horizontal padding total
    const width = screenWidth;

    const minPrice = Math.min(...data.map(d => d.price));
    const maxPrice = Math.max(...data.map(d => d.price));
    const priceRange = maxPrice - minPrice || 1;

    // Add some padding to the range for better visualization
    const padding = priceRange * 0.2;
    const yMin = minPrice - padding;
    const yMax = maxPrice + padding;
    const yRange = yMax - yMin;

    const getX = (index: number) => (index / (data.length - 1)) * width;
    const getY = (price: number) => height - ((price - yMin) / yRange) * height;

    // Create path
    let d = `M ${getX(0)} ${getY(data[0].price)}`;
    for (let i = 1; i < data.length; i++) {
        // Curve implementation: simplified cubic bezier
        const prevX = getX(i - 1);
        const prevY = getY(data[i - 1].price);
        const currX = getX(i);
        const currY = getY(data[i].price);
        const midX = (prevX + currX) / 2;
        d += ` C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;
    }

    return (
        <View style={{ height, width }}>
            <Svg height={height} width={width}>
                {/* Horizontal Grid lines */}
                <Line x1="0" y1={getY(maxPrice)} x2={width} y2={getY(maxPrice)} stroke="#D9C4A9" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />
                <Line x1="0" y1={getY(minPrice)} x2={width} y2={getY(minPrice)} stroke="#D9C4A9" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />

                {/* Main Path */}
                <Path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Points */}
                {data.map((point, i) => (
                    <G key={i}>
                        <Circle
                            cx={getX(i)}
                            cy={getY(point.price)}
                            r="4"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                        />
                        {/* Date Label for every few points or key points */}
                        {(i === 0 || i === data.length - 1 || data.length < 5) && (
                            <SvgText
                                x={getX(i)}
                                y={getY(point.price) - 10}
                                fontSize="8"
                                fill="#4A3728"
                                opacity="0.6"
                                textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
                                fontFamily="Vazirmatn"
                            >
                                {point.formattedDate || point.date.toLocaleDateString('fa-IR-u-ca-persian', { month: 'short', day: 'numeric' })}
                            </SvgText>
                        )}
                    </G>
                ))}
            </Svg>
        </View>
    );
});

PriceChart.displayName = 'PriceChart';

