import { Customer, Salesman, SaleRecord, Expense, InventoryItem, BottleLog, SalesmanPayment, StockAdjustment } from './types';

export const mockSalesmen: Salesman[] = [
    { id: 1, name: 'Ali Khan', mobile: '923001234567', hireDate: '2023-01-15', assignedAreaId: 1 },
    { id: 2, name: 'Bilal Ahmed', mobile: '923017654321', hireDate: '2023-03-10', assignedAreaId: 2 },
];

export const mockAreas = [
    { id: 1, name: 'Area A', description: 'Sector A and nearby' },
    { id: 2, name: 'Area B', description: 'Sector B and nearby' },
    { id: 3, name: 'Area C', description: 'Sector C' },
    { id: 4, name: 'Area D', description: 'Sector D' },
    { id: 5, name: 'Area E', description: 'Sector E' },
    { id: 6, name: 'Area F', description: 'Sector F' },
];

export const mockCustomers: Customer[] = [
        { 
            id: 1, name: 'Ibrahim Pasha', houseNumber: '123-B', floor: 2, mobile: '923331122333',
            bottlesPurchased: 50, paidBottles: 45, totalBalance: 500, deliveryDueToday: true, salesmanId: 1, 
            dailyRequirement: 2, deliveryDays: ['Monday', 'Thursday'], emptyBottlesOnHand: 5,
            assignedAreaId: 1
        },
        { 
            id: 2, name: 'Fatima Jinnah', houseNumber: '45-C', floor: 1, mobile: '923214455666',
            bottlesPurchased: 20, paidBottles: 20, totalBalance: 0, deliveryDueToday: false, salesmanId: 2, 
            dailyRequirement: 1, deliveryDays: ['Tuesday', 'Friday'], emptyBottlesOnHand: 2,
            assignedAreaId: 2
        },
        { 
            id: 3, name: 'Zain Abdullah', houseNumber: '88-F', floor: 5, mobile: '923118877665',
            bottlesPurchased: 15, paidBottles: 10, totalBalance: 500, deliveryDueToday: true, salesmanId: 1, 
            dailyRequirement: 1, deliveryDays: ['Wednesday', 'Saturday', 'Monday'], emptyBottlesOnHand: 3,
            assignedAreaId: 1
        },
];

export const mockSales: SaleRecord[] = [
    // Record unitPrice explicitly where known (e.g., 19-Liter = 120 from mockInventory)
    { id: 1, customerId: 1, customerName: 'Ibrahim Pasha', bottlesSold: 2, amountReceived: 240, unitPrice: 120, date: new Date().toISOString().split('T')[0], salesmanId: 1, bottlesReturned: 2, bottleCategory: '19-Liter', bottleItemId: 1 },
    { id: 2, customerId: 3, customerName: 'Zain Abdullah', bottlesSold: 1, amountReceived: 0, unitPrice: 120, date: new Date().toISOString().split('T')[0], salesmanId: 1, bottlesReturned: 1, bottleCategory: '19-Liter', bottleItemId: 1 },
    { id: 3, customerId: 2, customerName: 'Fatima Jinnah', bottlesSold: 1, amountReceived: 2, unitPrice: 2, date: '2024-05-20', salesmanId: 2, bottlesReturned: 0, bottleCategory: '5-Liter', bottleItemId: 2 },
    { id: 4, customerId: 0, customerName: 'Counter Sale', bottlesSold: 0, amountReceived: 50, date: new Date().toISOString().split('T')[0], isCounterSale: true, description: '3 small bottles', bottlesReturned: 0, bottleCategory: '1-Liter' },
];

export const mockExpenses: Expense[] = [
    { id: 1, date: new Date().toISOString().split('T')[0], category: 'Utilities', description: 'Electricity Bill', amount: 15000 },
    { id: 2, date: '2024-05-15', category: 'Maintenance', description: 'Filter Replacement', amount: 5000 },
];

export const mockInventory: InventoryItem[] = [
    { id: 1, name: '19-Liter Bottle', category: 'Containers', stock: 150, lowStockThreshold: 50, sellPrice: 120 },
    { id: 2, name: 'Bottle Caps', category: 'Supplies', stock: 800, lowStockThreshold: 200, sellPrice: 2 },
    { id: 3, name: 'RO Filters', category: 'Parts', stock: 15, lowStockThreshold: 5, sellPrice: 500 },
];

export const mockBottleLogs: BottleLog[] = [
    { id: 1, customerId: 1, date: new Date().toISOString().split('T')[0], bottlesTaken: 2, bottlesReturned: 2 },
    { id: 2, customerId: 3, date: new Date().toISOString().split('T')[0], bottlesTaken: 1, bottlesReturned: 1 },
    { id: 3, customerId: 1, date: '2024-05-20', bottlesTaken: 2, bottlesReturned: 1 },
];

export const mockSalesmanPayments: SalesmanPayment[] = [
    { id: 1, salesmanId: 1, amount: 5000, date: new Date().toISOString().split('T')[0] },
    { id: 2, salesmanId: 2, amount: 4500, date: '2024-05-18' },
];

export const mockStockAdjustments: StockAdjustment[] = [
    { id: 1, itemId: 1, date: '2024-05-10', quantityChange: 200, reason: 'Received Shipment', adjustedBy: 'Admin' },
    { id: 2, itemId: 1, date: '2024-05-12', quantityChange: -5, reason: 'Damaged Goods', adjustedBy: 'Admin' },
    { id: 3, itemId: 3, date: '2024-05-15', quantityChange: -1, reason: 'Maintenance Use', adjustedBy: 'Admin' },
];
