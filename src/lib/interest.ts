/**
 * Compound interest: principal * (1 + rate) ^ years
 */
export const calculateCurrentValue = (
  principalAmount: number,
  annualRate: number,
  startDate: Date | string
): number => {
  const start = new Date(startDate);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (years <= 0) return principalAmount;
  return principalAmount * Math.pow(1 + annualRate, years);
};
