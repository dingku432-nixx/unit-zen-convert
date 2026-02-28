import { useState, useEffect, useCallback } from 'react';
import { categories, convert, getUnitKeys } from '@/lib/conversion';
import { Sun, Moon, ArrowDownUp, Zap } from 'lucide-react';

const Index = () => {
  const [dark, setDark] = useState(false);
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [swapRotation, setSwapRotation] = useState(0);
  const [resultKey, setResultKey] = useState(0);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Update units when category changes
  useEffect(() => {
    const keys = getUnitKeys(category);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setResult(null);
    setError('');
    setInputValue('');
  }, [category]);

  // Real-time conversion
  const doConvert = useCallback((val: string, from: string, to: string, cat: string) => {
    if (val === '') {
      setResult(null);
      setError('');
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setResult(null);
      return;
    }
    setError('');
    setResult(convert(cat, from, to, num));
    setResultKey(k => k + 1);
  }, []);

  useEffect(() => {
    doConvert(inputValue, fromUnit, toUnit, category);
  }, [inputValue, fromUnit, toUnit, category, doConvert]);

  const handleSwap = () => {
    setSwapRotation(r => r + 180);
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleConvertClick = () => {
    if (!inputValue) {
      setError('Please enter a value');
      return;
    }
    doConvert(inputValue, fromUnit, toUnit, category);
  };

  const cat = categories[category];
  const unitKeys = getUnitKeys(category);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-colors duration-500 relative overflow-hidden"
      style={{
        background: dark
          ? 'linear-gradient(-45deg, hsl(260 70% 15%), hsl(290 60% 12%), hsl(210 70% 12%), hsl(330 55% 14%))'
          : 'linear-gradient(-45deg, hsl(250 80% 70%), hsl(280 70% 65%), hsl(200 80% 65%), hsl(320 65% 62%))',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite',
      }}
    >
      {/* Theme toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-6 right-6 z-20 p-3 rounded-2xl transition-all duration-300 hover:scale-110"
        style={{
          background: 'hsl(var(--glass-bg))',
          backdropFilter: 'blur(12px)',
          border: '1px solid hsl(var(--glass-border))',
        }}
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-foreground transition-transform duration-300" />
        )}
      </button>

      {/* Main Card */}
      <div
        className="w-full max-w-md rounded-3xl p-8 transition-all duration-500"
        style={{
          animation: 'page-fade-in 0.8s ease-out',
          background: 'hsl(var(--glass-bg))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid hsl(var(--glass-border))',
          boxShadow: '0 25px 50px -12px hsl(var(--glass-shadow))',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
              ProConvert
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart Unit Converter
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 px-4 rounded-2xl border border-border bg-secondary/50 text-foreground text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            {Object.entries(categories).map(([key, c]) => (
              <option key={key} value={key}>
                {c.icon}  {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Value
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number..."
            className="w-full h-12 px-4 rounded-2xl border border-border bg-secondary/50 text-foreground text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
            style={{
              ...(inputValue && !error ? { animation: 'glow-pulse 2s ease-in-out infinite' } : {}),
            }}
          />
          {/* Error message */}
          {error && (
            <p
              className="mt-2 text-sm text-destructive font-medium"
              style={{ animation: 'error-shake 0.4s ease-out' }}
            >
              {error}
            </p>
          )}
        </div>

        {/* From / Swap / To */}
        <div className="flex items-end gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-12 px-3 rounded-2xl border border-border bg-secondary/50 text-foreground text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {unitKeys.map((key) => (
                <option key={key} value={key}>
                  {cat.units[key].symbol} – {cat.units[key].label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary transition-all duration-300 hover:bg-primary/20 hover:scale-110"
            style={{ transform: `rotate(${swapRotation}deg)`, transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-label="Swap units"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              To
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-12 px-3 rounded-2xl border border-border bg-secondary/50 text-foreground text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {unitKeys.map((key) => (
                <option key={key} value={key}>
                  {cat.units[key].symbol} – {cat.units[key].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvertClick}
          className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          Convert
        </button>

        {/* Result */}
        {result !== null && !error && (
          <div
            key={resultKey}
            className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/20 text-center"
            style={{ animation: 'result-appear 0.4s ease-out' }}
          >
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Result</p>
            <p className="text-3xl font-bold font-display text-primary tabular-nums">
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {cat.units[toUnit]?.symbol}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Index;
