/**
 * ProConvert – Conversion Data & Logic Module
 * 
 * Defines all unit categories, their units, and conversion factors.
 * Implements ratio-based conversion for most categories and
 * formula-based conversion for Temperature.
 */

export interface UnitInfo {
  label: string;
  symbol: string;
  factor: number; // relative to base unit (ignored for temperature)
}

export interface Category {
  label: string;
  icon: string;
  units: Record<string, UnitInfo>;
  baseUnit: string;
  type: 'ratio' | 'formula';
}

export const categories: Record<string, Category> = {
  length: {
    label: 'Length',
    icon: '📏',
    baseUnit: 'm',
    type: 'ratio',
    units: {
      m:  { label: 'Meter', symbol: 'm', factor: 1 },
      km: { label: 'Kilometer', symbol: 'km', factor: 1000 },
      cm: { label: 'Centimeter', symbol: 'cm', factor: 0.01 },
      mm: { label: 'Millimeter', symbol: 'mm', factor: 0.001 },
      mi: { label: 'Mile', symbol: 'mi', factor: 1609.344 },
      ft: { label: 'Foot', symbol: 'ft', factor: 0.3048 },
      in: { label: 'Inch', symbol: 'in', factor: 0.0254 },
    },
  },
  mass: {
    label: 'Mass',
    icon: '⚖️',
    baseUnit: 'kg',
    type: 'ratio',
    units: {
      kg: { label: 'Kilogram', symbol: 'kg', factor: 1 },
      g:  { label: 'Gram', symbol: 'g', factor: 0.001 },
      lb: { label: 'Pound', symbol: 'lb', factor: 0.453592 },
      oz: { label: 'Ounce', symbol: 'oz', factor: 0.0283495 },
    },
  },
  temperature: {
    label: 'Temperature',
    icon: '🌡️',
    baseUnit: 'C',
    type: 'formula',
    units: {
      C: { label: 'Celsius', symbol: '°C', factor: 0 },
      F: { label: 'Fahrenheit', symbol: '°F', factor: 0 },
      K: { label: 'Kelvin', symbol: 'K', factor: 0 },
    },
  },
  time: {
    label: 'Time',
    icon: '⏱️',
    baseUnit: 's',
    type: 'ratio',
    units: {
      s:   { label: 'Second', symbol: 's', factor: 1 },
      min: { label: 'Minute', symbol: 'min', factor: 60 },
      hr:  { label: 'Hour', symbol: 'hr', factor: 3600 },
      day: { label: 'Day', symbol: 'day', factor: 86400 },
    },
  },
  speed: {
    label: 'Speed',
    icon: '🚀',
    baseUnit: 'ms',
    type: 'ratio',
    units: {
      ms:  { label: 'Meters/sec', symbol: 'm/s', factor: 1 },
      kmh: { label: 'Kilometers/hr', symbol: 'km/h', factor: 0.277778 },
      mph: { label: 'Miles/hr', symbol: 'mph', factor: 0.44704 },
    },
  },
  area: {
    label: 'Area',
    icon: '📐',
    baseUnit: 'm2',
    type: 'ratio',
    units: {
      m2:   { label: 'Square Meter', symbol: 'm²', factor: 1 },
      km2:  { label: 'Square Km', symbol: 'km²', factor: 1e6 },
      ft2:  { label: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      acre: { label: 'Acre', symbol: 'acre', factor: 4046.86 },
    },
  },
  volume: {
    label: 'Volume',
    icon: '🧪',
    baseUnit: 'L',
    type: 'ratio',
    units: {
      L:   { label: 'Liter', symbol: 'L', factor: 1 },
      mL:  { label: 'Milliliter', symbol: 'mL', factor: 0.001 },
      m3:  { label: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      gal: { label: 'Gallon', symbol: 'gal', factor: 3.78541 },
    },
  },
};

/**
 * Convert temperature between C, F, K using direct formulas.
 */
function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;

  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5 / 9; break;
    case 'K': celsius = value - 273.15; break;
    default: return value;
  }

  // Convert from Celsius to target
  switch (to) {
    case 'C': return celsius;
    case 'F': return celsius * 9 / 5 + 32;
    case 'K': return celsius + 273.15;
    default: return value;
  }
}

/**
 * Main conversion function.
 * Returns the converted value rounded to 4 decimal places.
 */
export function convert(
  categoryKey: string,
  fromUnit: string,
  toUnit: string,
  value: number
): number {
  const category = categories[categoryKey];
  if (!category) return 0;

  if (fromUnit === toUnit) return value;

  // Temperature uses formula-based conversion
  if (category.type === 'formula') {
    return parseFloat(convertTemperature(value, fromUnit, toUnit).toFixed(4));
  }

  // Ratio-based conversion: value * fromFactor / toFactor
  const fromFactor = category.units[fromUnit]?.factor ?? 1;
  const toFactor = category.units[toUnit]?.factor ?? 1;
  const result = (value * fromFactor) / toFactor;
  return parseFloat(result.toFixed(4));
}

/**
 * Get the list of unit keys for a given category.
 */
export function getUnitKeys(categoryKey: string): string[] {
  const category = categories[categoryKey];
  return category ? Object.keys(category.units) : [];
}
