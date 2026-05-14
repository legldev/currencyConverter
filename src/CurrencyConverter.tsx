import { ArrowRightLeft, CalendarDays, RefreshCw, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

type Currency = {
  code: string;
  name: string;
};

type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

type ConversionResult = {
  convertedAmount: number;
  date: string;
  from: string;
  rate: number;
  sourceAmount: number;
  to: string;
};

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'ARS', name: 'Argentine Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CLP', name: 'Chilean Peso' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'UYU', name: 'Uruguayan Peso' },
];

const apiBaseUrl = 'https://api.frankfurter.dev/v1';
const today = new Date().toISOString().slice(0, 10);

const formatNumber = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(value);

const formatRate = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 2,
  }).format(value);

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [date, setDate] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedDateLabel = useMemo(() => date || 'Latest available rate', [date]);

  const convert = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    setError('');
    setResult(null);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    if (from === to) {
      setResult({
        convertedAmount: numericAmount,
        date: date || today,
        from,
        rate: 1,
        sourceAmount: numericAmount,
        to,
      });
      return;
    }

    if (date && date > today) {
      setError('Choose today or an earlier date.');
      return;
    }

    const endpoint = date ? `${apiBaseUrl}/${date}` : `${apiBaseUrl}/latest`;
    const params = new URLSearchParams({
      amount: numericAmount.toString(),
      from,
      to,
    });

    setIsLoading(true);

    try {
      const response = await fetch(`${endpoint}?${params.toString()}`);
      const data = (await response.json()) as FrankfurterResponse | { message?: string };

      if (!response.ok) {
        throw new Error('message' in data ? data.message : 'Unable to fetch exchange rate.');
      }

      const convertedAmount = (data as FrankfurterResponse).rates[to];

      if (typeof convertedAmount !== 'number') {
        throw new Error('The exchange rate was not available for that currency pair.');
      }

      setResult({
        convertedAmount,
        date: (data as FrankfurterResponse).date,
        from: (data as FrankfurterResponse).base,
        rate: convertedAmount / numericAmount,
        sourceAmount: numericAmount,
        to,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to fetch exchange rate.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError('');
  };

  const reset = () => {
    setAmount('100');
    setFrom('USD');
    setTo('EUR');
    setDate('');
    setResult(null);
    setError('');
  };

  return (
    <main className="converter-page">
      <section className="converter-hero" aria-labelledby="converter-title">
        <p className="eyebrow">Live exchange rates</p>
        <h1 id="converter-title">Currency converter</h1>
        <p className="hero-copy">
          Convert common currencies using the latest available market data, or choose a
          historical date.
        </p>
      </section>

      <form className="converter-panel" onSubmit={convert}>
        <div className="amount-row">
          <label htmlFor="amount">Amount</label>
          <div className="amount-input">
            <span>{from}</span>
            <input
              id="amount"
              inputMode="decimal"
              name="amount"
              onChange={(event) => setAmount(event.target.value)}
              pattern="[0-9]*[.]?[0-9]*"
              placeholder="100.00"
              type="text"
              value={amount}
            />
          </div>
        </div>

        <div className="currency-grid">
          <label className="select-field" htmlFor="from-currency">
            <span>From</span>
            <select
              id="from-currency"
              name="from-currency"
              onChange={(event) => setFrom(event.target.value)}
              value={from}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </label>

          <button
            aria-label="Swap currencies"
            className="icon-button swap-button"
            onClick={swapCurrencies}
            title="Swap currencies"
            type="button"
          >
            <ArrowRightLeft aria-hidden="true" size={20} />
          </button>

          <label className="select-field" htmlFor="to-currency">
            <span>To</span>
            <select
              id="to-currency"
              name="to-currency"
              onChange={(event) => setTo(event.target.value)}
              value={to}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="date-field" htmlFor="rate-date">
          <span>
            <CalendarDays aria-hidden="true" size={18} />
            Rate date
          </span>
          <input
            id="rate-date"
            max={today}
            name="rate-date"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
        </label>

        <div className="actions">
          <button className="primary-button" disabled={isLoading} type="submit">
            <RefreshCw aria-hidden="true" className={isLoading ? 'spin' : ''} size={18} />
            {isLoading ? 'Converting...' : 'Convert'}
          </button>
          <button className="secondary-button" onClick={reset} type="button">
            <RotateCcw aria-hidden="true" size={18} />
            Reset
          </button>
        </div>

        <div className="status-region" aria-live="polite">
          {error && <p className="error-message">{error}</p>}

          {!error && result && (
            <output className="result" htmlFor="amount from-currency to-currency rate-date">
              <span className="result-label">Converted amount</span>
              <strong>{formatNumber(result.convertedAmount, result.to)}</strong>
              <span className="rate-line">
                {formatNumber(result.sourceAmount, result.from)} ={' '}
                {formatNumber(result.convertedAmount, result.to)}
              </span>
              <span className="rate-line">
                1 {result.from} = {formatRate(result.rate)} {result.to}
              </span>
              <span className="rate-date">Rate date: {result.date}</span>
            </output>
          )}

          {!error && !result && (
            <p className="empty-state">Ready to convert. Date: {selectedDateLabel}.</p>
          )}
        </div>
      </form>
    </main>
  );
};

export default CurrencyConverter;
