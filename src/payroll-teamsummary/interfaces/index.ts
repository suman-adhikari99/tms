export interface ISalaryDetails {
  group: string;
  priority: string;
  benefits: string[] | {}[];
  deductions: string[] | {}[];
}

export interface IRoleWisePaymentInfo {
  role?: string;
  grossPay: number | string | null;
  totalBenefits: number | string | null;
  totalDeductions: number | string | null;
  salaryDetails: ISalaryDetails;
  netPay: number | string | null;
}

export interface IProject {
  id: string;
  title: string;
  deliveryDate: string;
  payrollStatus: string;
  role: string[];
  amount?: number | string | null;
}

export interface ITrackedTimePayment {
  date: string | Date;
  trackedHours: string;
  totalBreak: string;
  totalWorkedHours: string;
  overtime: string;
  prescribedHours: string;
  totalBaseTimeMS: string | number;
  totalOvertimeMS: string | number;
  payment: string | number;
}