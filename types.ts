// Implemented the application's type definitions.

export type View = 
  | 'dashboard'
  | 'customers'
  | 'stock'
  | 'outstanding'
  | 'counterSales'
  | 'sales'
  | 'expenses'
  | 'inventory'
  | 'schedule'
  | 'reminders'
  | 'bottleTracking'
  | 'salesmen'
  | 'reports'
  | 'closing'
  | 'dailyAssigned'
  | 'settings'
  | 'customerDetail'
  | 'inventoryDetail'
  | 'salesmanReport';

export interface Customer {
  id: number;
  name: string;
  houseNumber: string;
  floor: number;
  mobile: string;
  // bottlePrice removed: pricing is derived from inventory item sellPrice
  bottlesPurchased: number;
  paidBottles: number;
  totalBalance: number;
  deliveryDueToday: boolean;
  salesmanId?: number;
  deliveryArea?: string;
  dailyRequirement?: number;
  deliveryDays: string[];
  emptyBottlesOnHand: number;
  lastKnownRate?: number; // Last known bottle rate from sales history

  // Manual/administrative fields (optional)
  outstandingBalance?: number; // manual outstanding amount that can be entered by admin
  receivedAmount?: number; // manual payments received recorded outside sales
  advancePayment?: number; // advance/credit given to customer

  // Assignment fields
  assignedAreaId?: number; // links to an Area
  sector?: string; // sector code A..F (simple string to keep flexible)
  assignedSalesmanId?: number; // optional explicit assignment
}

export interface Area {
  id: number;
  name: string;
  description?: string;
}

export interface Salesman {
  id: number;
  name: string;
  mobile: string;
  hireDate: string; // ISO date string
  assignedAreaId?: number; // optional area assignment
}

export interface SaleRecord {
  id: number;
  customerId: number;
  customerName: string;
  bottlesSold: number;
  amountReceived: number;
  date: string; // ISO date string
  salesmanId?: number;
  isCounterSale?: boolean;
  description?: string;
  bottlesReturned: number;
  bottleCategory?: string;
  bottleItemId?: number;
  unitPrice?: number; // recorded unit price used for this sale (from inventory.s sellPrice)
  paymentMethod?: 'cash' | 'bank';
}

export interface Expense {
  id: number;
  date: string; // ISO date string
  // 'name' is the primary label for an expense (e.g., Supplier or Title). 'category' kept for backward compatibility.
  name?: string;
  category?: string;
  description: string;
  amount: number;
  paymentAccount?: 'cash' | 'bank'; // which account the expense was paid from
  accountId?: number; // optional link to an expense account (owner/vendor)
}

export interface ExpenseAccount {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  sellPrice?: number; // optional selling price per unit
}

export interface BottleLog {
  id: number;
  customerId: number;
  date: string; // ISO date string
  bottlesTaken: number;
  bottlesReturned: number;
}

export interface SalesmanPayment {
    id: number;
    salesmanId: number;
    amount: number;
    date: string; // ISO date string
}

export interface StockAdjustment {
    id: number;
    itemId: number;
    date: string; // ISO date string
    quantityChange: number;
    reason: string;
    adjustedBy: string; // User who made the change
}

export interface MonthlyClosing {
  id: number;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  createdAt: string; // ISO date when archived
  sales: SaleRecord[];
  expenses: Expense[];
  totalRevenue: number;
  totalExpenses: number;
  totalCashRevenue: number;
  totalBankRevenue: number;
  totalCashExpenses: number;
  totalBankExpenses: number;
  netBalance: number;
}

// Daily assignment for salesman — standalone, not linked to inventory or revenue
export interface DailyBottleAssignment {
  id: number;
  date: string; // ISO date
  salesmanId: number;
  salesmanName: string;
  assignedCount: number; // bottles assigned for the day
  soldCount: number; // bottles sold (entered manually)
  remainingCount: number; // calculated or entered remaining bottles
  notes?: string;
}
