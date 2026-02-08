/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

import { getCurrencyConfig } from "./currency";

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions | undefined;

function processInput(inputValue: InputNumberValue): number | null {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fNumber(inputValue: InputNumberValue, options?: Options) {
  const currencyConfig = getCurrencyConfig();

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(currencyConfig.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fCurrency(inputValue: InputNumberValue, options?: Options) {
  const currencyConfig = getCurrencyConfig();

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(currencyConfig.locale, {
    style: "currency",
    currency: currencyConfig.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue: InputNumberValue, options?: Options) {
  const currencyConfig = getCurrencyConfig();

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(currencyConfig.locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(number / 100);

  return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue: InputNumberValue, options?: Options) {
  const currencyConfig = getCurrencyConfig();

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(currencyConfig.locale, {
    notation: "compact",
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fNumberToPercentage(inputValue: number) {
  return `${inputValue.toFixed(1)} % `
};
// ----------------------------------------------------------------------

export function fNumberToCurrency(inputValue: InputNumberValue, options?: Options) {
  const currencyConfig = getCurrencyConfig();

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(currencyConfig.locale, {
    style: "currency",
    currency: currencyConfig.code,
  }).format(number);

  return fm;
}
// ----------------------------------------------------------------------

export function fData(inputValue: InputNumberValue) {
  const number = processInput(inputValue);
  if (number === null || number === 0) return "0 bytes";

  const units = ["bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
  const decimal = 2;
  const baseValue = 1024;

  const index = Math.floor(Math.log(number) / Math.log(baseValue));
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]} `;

  return fm;
}
