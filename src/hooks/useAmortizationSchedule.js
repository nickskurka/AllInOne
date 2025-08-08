/**
 * useAmortizationSchedule.js
 * Custom hook for loan amortization calculations
 */

import { useState, useMemo } from 'react';

export const useAmortizationSchedule = (inputs) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const schedule = useMemo(() => {
    if (!inputs.loanAmount || !inputs.interestRate || !inputs.loanTerm) {
      return { payments: [], summary: null };
    }

    setIsCalculating(true);

    try {
      const {
        loanAmount,
        downPayment = 0,
        interestRate,
        loanTerm,
        termUnit,
        paymentFrequency,
        startDate,
        paymentType,
        extraPayment = 0
      } = inputs;

      // Calculate principal after down payment
      const principal = loanAmount - downPayment;

      if (principal <= 0) {
        return { payments: [], summary: null };
      }

      // Convert annual rate to period rate
      const annualRate = interestRate / 100;
      let periodsPerYear;

      switch (paymentFrequency) {
        case 'weekly': periodsPerYear = 52; break;
        case 'bi-weekly': periodsPerYear = 26; break;
        case 'monthly': periodsPerYear = 12; break;
        case 'quarterly': periodsPerYear = 4; break;
        case 'yearly': periodsPerYear = 1; break;
        default: periodsPerYear = 12;
      }

      const periodRate = annualRate / periodsPerYear;

      // Calculate total number of payments
      const termInYears = termUnit === 'months' ? loanTerm / 12 : loanTerm;
      let totalPayments = Math.ceil(termInYears * periodsPerYear);

      // Calculate payment amount using PMT formula
      let paymentAmount;
      if (periodRate === 0) {
        paymentAmount = principal / totalPayments;
      } else {
        if (paymentType === 'BOP') {
          // Beginning of period (annuity due)
          paymentAmount = (principal * periodRate) /
            ((1 - Math.pow(1 + periodRate, -totalPayments)) / (1 + periodRate));
        } else {
          // End of period (ordinary annuity) - default
          paymentAmount = (principal * periodRate) /
            (1 - Math.pow(1 + periodRate, -totalPayments));
        }
      }

      // Round payment to nearest cent
      paymentAmount = Math.round(paymentAmount * 100) / 100;

      // Generate amortization schedule
      const payments = [];
      let remainingBalance = principal;
      let totalInterestPaid = 0;
      let totalPrincipalPaid = 0;
      let cumulativeInterest = 0;

      const baseDate = startDate ? new Date(startDate) : new Date();

      for (let paymentNum = 1; paymentNum <= totalPayments && remainingBalance > 0.01; paymentNum++) {
        // Calculate payment date
        let paymentDate = new Date(baseDate);
        const periodsToAdd = paymentType === 'BOP' ? paymentNum - 1 : paymentNum;

        switch (paymentFrequency) {
          case 'weekly':
            paymentDate.setDate(baseDate.getDate() + (periodsToAdd * 7));
            break;
          case 'bi-weekly':
            paymentDate.setDate(baseDate.getDate() + (periodsToAdd * 14));
            break;
          case 'monthly':
            paymentDate.setMonth(baseDate.getMonth() + periodsToAdd);
            break;
          case 'quarterly':
            paymentDate.setMonth(baseDate.getMonth() + (periodsToAdd * 3));
            break;
          case 'yearly':
            paymentDate.setFullYear(baseDate.getFullYear() + periodsToAdd);
            break;
        }

        // Calculate interest for this period
        const interestPayment = remainingBalance * periodRate;

        // Calculate principal payment
        let principalPayment = paymentAmount - interestPayment + extraPayment;

        // Ensure we don't overpay
        if (principalPayment > remainingBalance) {
          principalPayment = remainingBalance;
        }

        const actualPayment = interestPayment + principalPayment;
        const newBalance = remainingBalance - principalPayment;

        cumulativeInterest += interestPayment;

        payments.push({
          paymentNumber: paymentNum,
          date: paymentDate.toLocaleDateString(),
          principalPaid: Math.round(principalPayment * 100) / 100,
          interestPaid: Math.round(interestPayment * 100) / 100,
          totalPayment: Math.round(actualPayment * 100) / 100,
          remainingBalance: Math.round(newBalance * 100) / 100,
          cumulativeInterest: Math.round(cumulativeInterest * 100) / 100
        });

        totalInterestPaid += interestPayment;
        totalPrincipalPaid += principalPayment;
        remainingBalance = newBalance;

        // Break if loan is paid off
        if (remainingBalance <= 0.01) break;
      }

      const summary = {
        principal: Math.round(principal * 100) / 100,
        totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
        totalAmountPaid: Math.round((totalInterestPaid + principal) * 100) / 100,
        monthlyPayment: paymentAmount,
        totalPayments: payments.length,
        payoffDate: payments.length > 0 ? payments[payments.length - 1].date : null,
        interestPercentage: Math.round((totalInterestPaid / principal) * 10000) / 100
      };

      setIsCalculating(false);
      return { payments, summary };

    } catch (error) {
      console.error('Error calculating amortization:', error);
      setIsCalculating(false);
      return { payments: [], summary: null };
    }
  }, [inputs]);

  return { ...schedule, isCalculating };
};
