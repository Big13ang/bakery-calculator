import React, { memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Rect, Line, Circle, G } from 'react-native-svg';

/**
 * 🥖 Bakery Classic - Reusable vector illustrations
 * Designed to act as elegant, high-end visual accents for the dashboard cards.
 * All illustrations feature monoline strokes (approx. 1.5px to 2px stroke width)
 * and organic curves, following the classic warm bakery design system.
 */

interface CardIllustrationProps {
  variant: 'ingredients' | 'recipes' | 'add-ingredient' | 'add-recipe';
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const CardIllustration = memo<CardIllustrationProps>(({
  variant,
  className = "w-24 h-24",
  style,
}) => {
  return (
    <Svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={style}
    >
      <G strokeLinecap="round" strokeLinejoin="round">
        {/* 1. Shared subtle decorative background blob */}
        <Path
          d="M25,45 C20,25 45,15 70,20 C90,25 95,50 80,75 C65,95 35,90 25,75 C15,60 30,65 25,45 Z"
          fill="#F9F1E5"
        />

        {/* 2. Variant-specific foreground illustrations */}
        {variant === 'ingredients' && (
          <>
            {/* Wheat stem behind/beside the sack */}
            <Path
              d="M55,80 C60,65 65,50 78,35"
              stroke="#D9C4A9"
              strokeWidth="1.6"
            />
            {/* Left side grains */}
            <Path
              d="M67,54 C63,52 62,48 67,46 C69,50 69,53 67,54 Z"
              stroke="#D9C4A9"
              strokeWidth="1.6"
              fill="#FFFFFF"
            />
            <Path
              d="M72,42 C68,40 67,36 72,34 C74,38 74,41 72,42 Z"
              stroke="#D9C4A9"
              strokeWidth="1.6"
              fill="#FFFFFF"
            />
            
            {/* Right side grains with brand accent */}
            <G>
              <Path
                d="M73,48 C77,45 79,47 77,51 C74,51 72,50 73,48 Z"
                stroke="#D97706"
                strokeWidth="1.6"
                fill="#F9F1E5"
              />
              <Path
                d="M78,36 C82,33 84,35 82,39 C79,39 77,38 78,36 Z"
                stroke="#D97706"
                strokeWidth="1.6"
                fill="#F9F1E5"
              />
            </G>

            {/* Minimal flour sack */}
            <Path
              d="M35,46 C35,41 38,38 48,38 C58,38 61,41 61,46 L64,74 C64,77 60,79 56,79 H40 C36,79 32,77 32,74 Z"
              stroke="#4A3728"
              strokeWidth="1.8"
              fill="#FFFFFF"
            />
            {/* Rope around sack neck */}
            <Path
              d="M32,47 C39,49 54,49 61,47"
              stroke="#4A3728"
              strokeWidth="1.5"
            />
            {/* Print label on the sack */}
            <Rect
              x="42"
              y="54"
              width="12"
              height="14"
              rx={1}
              stroke="#D9C4A9"
              strokeWidth="1"
              fill="#F9F1E5"
            />
            {/* Tiny wheat stalk print */}
            <Line x1="48" y1="64" x2="48" y2="57" stroke="#D97706" strokeWidth="1" />
            <Path d="M48,60 C46,59 46,58 48,58 C48,59 47,60 48,60" stroke="#D97706" strokeWidth="0.8" />
            <Path d="M48,61 C50,60 50,59 48,59 C48,60 49,61 48,61" stroke="#D97706" strokeWidth="0.8" />

            {/* Small scoop on bottom-left */}
            <Path
              d="M20,74 L14,79"
              stroke="#D9C4A9"
              strokeWidth="1.5"
            />
            <Path
              d="M22,76 C20,72 26,68 28,72 L22,76 Z"
              stroke="#D9C4A9"
              strokeWidth="1.5"
              fill="#FFFFFF"
            />
          </>
        )}

        {variant === 'recipes' && (
          <>
            {/* Rolling pin crossing diagonally in background */}
            <Line
              x1="15"
              y1="75"
              x2="85"
              y2="25"
              stroke="#D9C4A9"
              strokeWidth="2.5"
            />
            <Line
              x1="22"
              y1="72"
              x2="20"
              y2="68"
              stroke="#D9C4A9"
              strokeWidth="1.5"
            />
            <Line
              x1="78"
              y1="28"
              x2="80"
              y2="24"
              stroke="#D9C4A9"
              strokeWidth="1.5"
            />

            {/* Open Recipe Book */}
            {/* Left page */}
            <Path
              d="M50,42 C40,38 30,38 22,43 V71 C30,66 40,66 50,70 V42"
              stroke="#4A3728"
              strokeWidth="1.8"
              fill="#FFFFFF"
            />
            {/* Right page */}
            <Path
              d="M50,42 C60,38 70,38 78,43 V71 C70,66 60,66 50,70 V42"
              stroke="#4A3728"
              strokeWidth="1.8"
              fill="#FFFFFF"
            />
            {/* Center spine line */}
            <Line x1="50" y1="42" x2="50" y2="70" stroke="#4A3728" strokeWidth="1.5" />
            
            {/* Lines on left page */}
            <Line x1="28" y1="49" x2="42" y2="49" stroke="#D9C4A9" strokeWidth="1.5" />
            <Line x1="28" y1="55" x2="38" y2="55" stroke="#D9C4A9" strokeWidth="1.5" />
            <Line x1="28" y1="61" x2="44" y2="61" stroke="#D9C4A9" strokeWidth="1.5" />
            
            {/* Lines on right page */}
            <Line x1="58" y1="49" x2="72" y2="49" stroke="#D9C4A9" strokeWidth="1.5" />
            <Line x1="58" y1="55" x2="68" y2="55" stroke="#D9C4A9" strokeWidth="1.5" />
            <Line x1="58" y1="61" x2="70" y2="61" stroke="#D9C4A9" strokeWidth="1.5" />

            {/* Floating Chef Hat */}
            <G>
              <Line
                x1="44"
                y1="32"
                x2="56"
                y2="32"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              <Path
                d="M44,32 C41,32 40,26 44,24 C44,20 50,18 50,22 C50,18 56,20 56,24 C60,26 59,32 56,32"
                stroke="#D97706"
                strokeWidth="1.5"
                fill="#F9F1E5"
              />
            </G>
          </>
        )}

        {variant === 'add-ingredient' && (
          <>
            {/* Decorative wheat detail behind jar */}
            <G>
              <Path
                d="M63,75 C68,71 72,64 74,56"
                stroke="#D9C4A9"
                strokeWidth="1.5"
              />
              <Path
                d="M72,60 C75,58 77,60 74,62 Z"
                stroke="#D9C4A9"
                strokeWidth="1"
                fill="#FFFFFF"
              />
            </G>

            {/* Minimal Glass Jar */}
            <Path
              d="M36,46 V74 C36,78 40,81 45,81 H55 C60,81 64,78 64,74 V46 H36 Z"
              stroke="#4A3728"
              strokeWidth="1.8"
              fill="#FFFFFF"
            />
            {/* Jar Neck */}
            <Path
              d="M40,46 V42 H60 V46 Z"
              stroke="#4A3728"
              strokeWidth="1.8"
              fill="#FFFFFF"
            />
            {/* Lid */}
            <Line
              x1="38"
              y1="42"
              x2="62"
              y2="42"
              stroke="#4A3728"
              strokeWidth="2"
            />
            {/* Neck thread */}
            <Line
              x1="44"
              y1="45"
              x2="56"
              y2="45"
              stroke="#D9C4A9"
              strokeWidth="1.2"
            />

            {/* Jar Label with Plus symbol */}
            <Rect
              x="42"
              y="54"
              width="16"
              height="16"
              rx={1}
              stroke="#D9C4A9"
              strokeWidth="1.5"
              fill="#F9F1E5"
            />
            {/* Plus symbol inside label */}
            <Line
              x1="46"
              y1="62"
              x2="54"
              y2="62"
              stroke="#D97706"
              strokeWidth="2"
            />
            <Line
              x1="50"
              y1="58"
              x2="50"
              y2="66"
              stroke="#D97706"
              strokeWidth="2"
            />
          </>
        )}

        {variant === 'add-recipe' && (
          <>
            {/* Recipe Sheet */}
            <Path
              d="M34,32 H58 L66,40 V74 C66,76 64,78 62,78 H34 C32,78 30,76 30,74 V36 C30,34 32,32 34,32 Z"
              stroke="#4A3728"
              strokeWidth="1.8"
              fill="#FFFFFF"
            />
            {/* Folded corner */}
            <Path
              d="M58,32 V40 H66"
              stroke="#4A3728"
              strokeWidth="1.8"
            />
            {/* Text lines on sheet */}
            <Line x1="36" y1="46" x2="54" y2="46" stroke="#D9C4A9" strokeWidth="1.5" />
            <Line x1="36" y1="52" x2="48" y2="52" stroke="#D9C4A9" strokeWidth="1.5" />
            <Line x1="36" y1="58" x2="52" y2="58" stroke="#D9C4A9" strokeWidth="1.5" />

            {/* Small spoon crossing sheet */}
            <G>
              <Line
                x1="24"
                y1="74"
                x2="38"
                y2="60"
                stroke="#D9C4A9"
                strokeWidth="1.5"
              />
              <Path
                d="M36,62 C34,60 36,56 39,54 C42,52 45,55 43,58 C41,61 38,64 36,62 Z"
                stroke="#D9C4A9"
                strokeWidth="1.5"
                fill="#FFFFFF"
              />
            </G>

            {/* Small Plus badge circle */}
            <G>
              <Circle
                cx="62"
                cy="68"
                r="8"
                stroke="#D97706"
                strokeWidth="1.5"
                fill="#FDF8F1"
              />
              <Line
                x1="59"
                y1="68"
                x2="65"
                y2="68"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              <Line
                x1="62"
                y1="65"
                x2="62"
                y2="71"
                stroke="#D97706"
                strokeWidth="1.5"
              />
            </G>
          </>
        )}
      </G>
    </Svg>
  );
});

CardIllustration.displayName = 'CardIllustration';
