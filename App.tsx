
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { View, Customer, Salesman, SaleRecord, Expense, InventoryItem, BottleLog, SalesmanPayment, StockAdjustment, MonthlyClosing, ExpenseAccount } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { showToast } from './utils/toast';
import { mockCustomers, mockSalesmen, mockSales, mockExpenses, mockInventory, mockBottleLogs, mockSalesmanPayments, mockStockAdjustments } from './mockData';
import { mockAreas } from './mockData';
import DomainProtection from './components/auth/DomainProtection';
import { getEnvironmentConfig } from './config/domainConfig';

// Component Imports
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const DailyBottlesAssigned = lazy(() => import('./components/dashboard/DailyBottlesAssigned'));
const CustomerTable = lazy(() => import('./components/dashboard/CustomerTable'));
const CustomerFilters = lazy(() => import('./components/dashboard/CustomerFilters'));
const DailySales = lazy(() => import('./components/dashboard/DailySales'));
const Expenses = lazy(() => import('./components/dashboard/Expenses'));
const Inventory = lazy(() => import('./components/dashboard/Inventory'));
const DeliverySchedule = lazy(() => import('./components/dashboard/DeliverySchedule'));
const DailyReminders = lazy(() => import('./components/dashboard/DailyReminders'));
const BottleTracking = lazy(() => import('./components/dashboard/BottleTracking'));
const Salesmen = lazy(() => import('./components/salesmen/Salesmen'));
const Reports = lazy(() => import('./components/dashboard/Reports'));
const ClosingReport = lazy(() => import('./components/dashboard/ClosingReport'));
const CounterSales = lazy(() => import('./components/dashboard/CounterSales'));
const Stock = lazy(() => import('./components/dashboard/Stock'));
const Outstanding = lazy(() => import('./components/dashboard/Outstanding'));
const CustomerDetail = lazy(() => import('./components/dashboard/CustomerDetail'));
const InventoryItemDetail = lazy(() => import('./components/inventory/InventoryItemDetail'));
const SalesmanReport = lazy(() => import('./components/salesmen/SalesmanReport'));

// Auth Components
const LoginChooser = lazy(() => import('./components/auth/LoginChooser'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const SalesmanLogin = lazy(() => import('./components/auth/SalesmanLogin'));
const SalesmanDashboard = lazy(() => import('./components/salesman_dashboard/SalesmanDashboard'));

// Modal Imports
const AddCustomerModal = lazy(() => import('./components/customer/AddCustomerModal'));
const EditCustomerModal = lazy(() => import('./components/customer/EditCustomerModal'));
const DeleteCustomerModal = lazy(() => import('./components/customer/DeleteCustomerModal'));
const AddSaleModal = lazy(() => import('./components/customer/AddSaleModal'));
const AddExpenseModal = lazy(() => import('./components/expenses/AddExpenseModal'));
const EditExpenseModal = lazy(() => import('./components/expenses/EditExpenseModal'));
const AddInventoryItemModal = lazy(() => import('./components/inventory/AddInventoryItemModal'));
const EditInventoryItemModal = lazy(() => import('./components/inventory/EditInventoryItemModal'));
const AdjustStockModal = lazy(() => import('./components/inventory/AdjustStockModal'));
const DeleteInventoryItemModal = lazy(() => import('./components/inventory/DeleteInventoryItemModal'));
const EditScheduleModal = lazy(() => import('./components/customer/EditScheduleModal'));
const AdjustEmptyBottlesModal = lazy(() => import('./components/customer/AdjustEmptyBottlesModal'));
const AddSalesmanModal = lazy(() => import('./components/salesmen/AddSalesmanModal'));
const AddSalesmanPaymentModal = lazy(() => import('./components/salesmen/AddSalesmanPaymentModal'));
const AddCounterSaleModal = lazy(() => import('./components/dashboard/AddCounterSaleModal'));
const EditSaleModal = lazy(() => import('./components/sales/EditSaleModal'));
const DeleteSaleModal = lazy(() => import('./components/sales/DeleteSaleModal'));

type AuthStatus = 'chooser' | 'admin-login' | 'salesman-login' | 'signup' | 'logged-in';
type UserType = 'admin' | 'salesman';

const App: React.FC = () => {
    // Domain Protection Configuration
    const domainConfig = getEnvironmentConfig();
    
    // Authentication State
    const [authStatus, setAuthStatus] = useState<AuthStatus>('chooser');
    const [userType, setUserType] = useState<UserType | null>(null);
    const [loggedInSalesman, setLoggedInSalesman] = useState<Salesman | null>(null);
    const [adminName, setAdminName] = useState<string | null>(null);

    // Data State using Local Storage
    const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', mockCustomers);
    const [salesmen, setSalesmen] = useLocalStorage<Salesman[]>('salesmen', mockSalesmen);
    const [areas, setAreas] = useLocalStorage<any[]>('areas', mockAreas);
    const [sales, setSales] = useLocalStorage<SaleRecord[]>('sales', mockSales);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', mockExpenses);
    const [expenseAccounts, setExpenseAccounts] = useLocalStorage<ExpenseAccount[]>('expenseAccounts', []);
    const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory', mockInventory);
    const [warehouseStock, setWarehouseStock] = useLocalStorage<number>('warehouseStock', 1000);
    const [bottleLogs, setBottleLogs] = useLocalStorage<BottleLog[]>('bottleLogs', mockBottleLogs);
    const [cashBalance, setCashBalance] = useLocalStorage<number>('cashBalance', 0);
    const [bankBalance, setBankBalance] = useLocalStorage<number>('bankBalance', 0);
    const [salesmanPayments, setSalesmanPayments] = useLocalStorage<SalesmanPayment[]>('salesmanPayments', mockSalesmanPayments);
    const [stockAdjustments, setStockAdjustments] = useLocalStorage<StockAdjustment[]>('stockAdjustments', mockStockAdjustments);
    const [monthlyClosings, setMonthlyClosings] = useLocalStorage<MonthlyClosing[]>('monthlyClosings', []);

    // Normalize customer records on first load to ensure new fields exist and avoid undefineds
    useEffect(() => {
        setCustomers(prev => prev.map(c => ({
            ...c,
            outstandingBalance: typeof (c as any).outstandingBalance === 'number' ? (c as any).outstandingBalance : 0,
            receivedAmount: typeof (c as any).receivedAmount === 'number' ? (c as any).receivedAmount : 0,
            advancePayment: typeof (c as any).advancePayment === 'number' ? (c as any).advancePayment : 0,
            assignedAreaId: typeof (c as any).assignedAreaId === 'number' ? (c as any).assignedAreaId : undefined,
            sector: typeof (c as any).sector === 'string' ? (c as any).sector : undefined,
            assignedSalesmanId: typeof (c as any).assignedSalesmanId === 'number' ? (c as any).assignedSalesmanId : undefined,
            deliveryArea: typeof c.deliveryArea === 'string' ? c.deliveryArea : undefined,
        })));
        // ensure salesmen carry assignedAreaId default if missing
        setSalesmen(prev => prev.map(s => ({ ...s, assignedAreaId: typeof (s as any).assignedAreaId === 'number' ? (s as any).assignedAreaId : undefined })));
        // ensure areas exist
        if (!areas || areas.length === 0) {
            setAreas(mockAreas as any);
        }
        // load admin name from persisted currentUser if present
        try {
            const raw = window.localStorage.getItem('currentUser');
            if (raw) {
                const cu = JSON.parse(raw) as { name?: string; email?: string };
                setAdminName(cu.name || cu.email || null);
            }
        } catch (err) {
            // ignore
        }
    }, []);

    // UI State
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
    const [selectedSalesman, setSelectedSalesman] = useState<Salesman | null>(null);

    // Modal States
    const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
    const [isEditCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [isDeleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false);
    const [isAddSaleModalOpen, setAddSaleModalOpen] = useState(false);
    const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [addExpenseInitialAccountId, setAddExpenseInitialAccountId] = useState<number | null>(null);
    const [isEditExpenseModalOpen, setEditExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [isAddInventoryItemModalOpen, setAddInventoryItemModalOpen] = useState(false);
    const [isEditInventoryItemModalOpen, setEditInventoryItemModalOpen] = useState(false);
    const [isAdjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
    const [isDeleteInventoryItemModalOpen, setDeleteInventoryItemModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
    const [isEditScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
    const [isAdjustBottlesModalOpen, setAdjustBottlesModalOpen] = useState(false);
    const [isAddSalesmanModalOpen, setAddSalesmanModalOpen] = useState(false);
    const [isAddSalesmanPaymentModalOpen, setAddSalesmanPaymentModalOpen] = useState(false);
    const [isAddCounterSaleModalOpen, setAddCounterSaleModalOpen] = useState(false);
    const [isEditSaleModalOpen, setEditSaleModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);
    const [isDeleteSaleModalOpen, setDeleteSaleModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<SaleRecord | null>(null);

    // Customer Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
    const [dueFilter, setDueFilter] = useState(false);

    // Derived State for Customers View
    const filteredCustomers = useMemo(() => {
        return customers
            .filter(c => {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    c.name.toLowerCase().includes(searchLower) ||
                    (c.mobile || '').toLowerCase().includes(searchLower) ||
                    c.totalBalance.toString().toLowerCase().includes(searchLower) ||
                    c.bottlesPurchased.toString().toLowerCase().includes(searchLower) ||
                    (c.houseNumber || '').toString().toLowerCase().includes(searchLower) ||
                    (c.deliveryArea || '').toLowerCase().includes(searchLower);

                const matchesStatus =
                    statusFilter === 'all' ||
                    (statusFilter === 'pending' && c.totalBalance > 0) ||
                    (statusFilter === 'paid' && c.totalBalance <= 0);

                const matchesDue = !dueFilter || c.deliveryDueToday;

                return matchesSearch && matchesStatus && matchesDue;
            })
            .sort((a, b) => b.id - a.id);
    }, [customers, searchTerm, statusFilter, dueFilter]);

    // Handlers
    const handleLogin = (type: UserType, salesman?: Salesman) => {
        setAuthStatus('logged-in');
        setUserType(type);
        if (type === 'salesman' && salesman) {
            setLoggedInSalesman(salesman);
        }
        setActiveView('dashboard');
        // If admin logged in, try to read persisted currentUser and set adminName
        if (type === 'admin') {
            try {
                const raw = window.localStorage.getItem('currentUser');
                if (raw) {
                    const cu = JSON.parse(raw) as { name?: string; email?: string };
                    setAdminName(cu.name || cu.email || null);
                }
            } catch (err) { /* ignore */ }
        }
    };

    const handleLogout = () => {
        setAuthStatus('chooser');
        setUserType(null);
        setLoggedInSalesman(null);
        // clear persisted current user and admin name
        try {
            window.localStorage.removeItem('currentUser');
        } catch (err) { /* ignore */ }
        setAdminName(null);
    };

    const handleNavigate = (view: View) => {
        setActiveView(view);
        setSelectedCustomer(null);
        setSelectedInventoryItem(null);
        setSelectedSalesman(null);
    };

    // Customer Handlers
    const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'bottlesPurchased' | 'paidBottles' | 'totalBalance' | 'deliveryDueToday' | 'deliveryDays' | 'emptyBottlesOnHand'>) => {
        const newCustomer: Customer = {
            ...customerData,
            id: Date.now(),
            bottlesPurchased: 0,
            paidBottles: 0,
            totalBalance: 0,
            deliveryDueToday: false, // Default value
            deliveryDays: [],
            emptyBottlesOnHand: 0,
            // ensure manual fields exist
            outstandingBalance: 0,
            receivedAmount: 0,
            advancePayment: 0,
            assignedAreaId: (customerData as any).assignedAreaId ?? undefined,
            sector: (customerData as any).sector ?? undefined,
            assignedSalesmanId: (customerData as any).assignedSalesmanId ?? undefined,
        };
        setCustomers(prev => [...prev, newCustomer]);
        showToast('Customer added successfully!', 'success');
    };

    const handleUpdateCustomer = (updatedCustomer: Customer) => {
        setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        setEditCustomerModalOpen(false);
        showToast('Customer updated!', 'success');
    };

    const handleDeleteCustomer = () => {
        if (selectedCustomer) {
            const customerId = selectedCustomer.id;
            setCustomers(prev => prev.filter(c => c.id !== customerId));
            setSales(prev => prev.filter(s => s.customerId !== customerId));
            setBottleLogs(prev => prev.filter(b => b.customerId !== customerId));
            setDeleteCustomerModalOpen(false);
            setSelectedCustomer(null);
            showToast('Customer and all related data deleted!', 'success');
        }
    };
    
    // Sale Handlers
    const handleAddSale = (saleData: { customerId: number; customerName: string; bottlesSold: number; amountReceived: number; updateBalance: boolean; salesmanId?: number; bottlesReturned: number; bottleCategory?: string; bottleItemId?: number; paymentMethod?: 'cash'|'bank' }) => {
        const { customerId, bottlesSold, amountReceived, updateBalance, bottlesReturned, customerName, bottleCategory, bottleItemId } = saleData;

        // Get customer to access their individual bottle price
        const customer = customers.find(c => c.id === customerId);
        if (!customer) {
            showToast('Customer not found!', 'error');
            setAddSaleModalOpen(false);
            return;
        }

        // Inventory Check: prefer matching by bottleCategory (category or name), otherwise fallback to '19-Liter' name match
        const matchedItems = bottleCategory
            ? inventory.filter(i => i.category === bottleCategory || i.name.includes(bottleCategory))
            : inventory.filter(i => i.name.includes('19-Liter'));

        // If no items matched and bottleCategory provided, try fallback name match
        const itemsToAdjust = matchedItems.length > 0 ? matchedItems : inventory.filter(i => i.name.includes('19-Liter'));

        // If still nothing matched, warn and abort
        if (itemsToAdjust.length === 0) {
            showToast('No inventory item found for this sale category.', 'error');
            setAddSaleModalOpen(false);
            return;
        }

        // Ensure every matched item has enough stock (we require each item to have >= bottlesSold)
        const insufficient = itemsToAdjust.find(i => i.stock < bottlesSold);
        if (insufficient) {
            showToast(`Insufficient stock for ${insufficient.name}! Only ${insufficient.stock} available.`, 'error');
            setAddSaleModalOpen(false);
            return;
        }

        // Deduct from each matched inventory item and create stock adjustment logs
        if (bottlesSold > 0) {
            setInventory(prev => prev.map(i => {
                const match = itemsToAdjust.find(mi => mi.id === i.id);
                if (match) return { ...i, stock: i.stock - bottlesSold };
                return i;
            }));

            const adjustments = itemsToAdjust.map(it => ({ id: Date.now() + Math.floor(Math.random() * 1000), itemId: it.id, date: new Date().toISOString().split('T')[0], quantityChange: -bottlesSold, reason: `Sale to ${customerName}`, adjustedBy: 'System' } as StockAdjustment));
            setStockAdjustments(prev => [...adjustments, ...prev]);
        }

        // Determine unit price: prefer selected inventory item sellPrice if provided
        let unitPrice = 0;
        if (bottleItemId) {
            const foundItem = inventory.find(i => i.id === bottleItemId);
            if (foundItem && typeof foundItem.sellPrice === 'number') unitPrice = foundItem.sellPrice;
        }
        // If still zero, leave unitPrice at 0; we'll treat amountReceived explicitly. Recording unitPrice is preferred.
        setCustomers(prevCustomers => prevCustomers.map(c => {
            if (c.id === customerId) {
                const cost = bottlesSold * unitPrice;
                const newBottlesPurchased = c.bottlesPurchased + bottlesSold;
                const newPaidBottles = updateBalance ? c.paidBottles + Math.floor(unitPrice ? amountReceived / unitPrice : 0) : c.paidBottles;
                const newTotalBalance = updateBalance ? c.totalBalance + cost - amountReceived : c.totalBalance;
                const newEmptyBottlesOnHand = (c.emptyBottlesOnHand || 0) - bottlesReturned + bottlesSold;

                // Calculate effective rate: use unitPrice if available, otherwise calculate from amountReceived if both are present
                const effectiveRate = unitPrice || (bottlesSold > 0 && amountReceived ? amountReceived / bottlesSold : undefined);

                return { 
                    ...c, 
                    bottlesPurchased: newBottlesPurchased, 
                    paidBottles: newPaidBottles, 
                    totalBalance: newTotalBalance, 
                    emptyBottlesOnHand: newEmptyBottlesOnHand,
                    lastKnownRate: effectiveRate || c.lastKnownRate // Only update if we have a valid rate
                };
            }
            return c;
        }));

    const newSale: SaleRecord = { ...saleData, id: Date.now(), date: new Date().toISOString().split('T')[0], bottleCategory, unitPrice: unitPrice || undefined };
        setSales(prev => [newSale, ...prev]);

        if(bottlesReturned > 0 || bottlesSold > 0) {
            const newLog: BottleLog = { id: Date.now(), customerId, date: new Date().toISOString().split('T')[0], bottlesTaken: bottlesSold, bottlesReturned };
            setBottleLogs(prev => [newLog, ...prev]);
        }
        showToast('Sale added!', 'success');
    };

    const handleUpdateSale = (updatedSale: SaleRecord) => {
        const originalSale = sales.find(s => s.id === updatedSale.id);
        if (!originalSale) return;

        // Recalculate customer balance if amount received changed
        if (originalSale.amountReceived !== updatedSale.amountReceived && !updatedSale.isCounterSale) {
            const amountDifference = updatedSale.amountReceived - originalSale.amountReceived;
            setCustomers(prev => prev.map(c => {
                if (c.id === updatedSale.customerId) {
                    // a smaller received amount INCREASES balance.
                    return { ...c, totalBalance: c.totalBalance - amountDifference };
                }
                return c;
            }));
        }

        setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
        setEditSaleModalOpen(false);
        showToast('Sale updated successfully!', 'success');
    };
    
    const handleConfirmDeleteSale = () => {
        if (!saleToDelete) return;

        // 1. Revert Inventory — find items by the sale's bottleCategory (if present) or fallback to 19-Liter
        if (saleToDelete.bottlesSold > 0) {
            const matchedForRevert = saleToDelete.bottleCategory
                ? inventory.filter(i => i.category === saleToDelete.bottleCategory || i.name.includes(saleToDelete.bottleCategory))
                : inventory.filter(i => i.name.includes('19-Liter'));

            const itemsToRevert = matchedForRevert.length > 0 ? matchedForRevert : inventory.filter(i => i.name.includes('19-Liter'));

            if (itemsToRevert.length > 0) {
                setInventory(prev => prev.map(i => {
                    const match = itemsToRevert.find(mi => mi.id === i.id);
                    if (match) return { ...i, stock: i.stock + saleToDelete.bottlesSold };
                    return i;
                }));

                const adjustments = itemsToRevert.map(it => ({ id: Date.now() + Math.floor(Math.random() * 1000), itemId: it.id, date: new Date().toISOString().split('T')[0], quantityChange: saleToDelete.bottlesSold, reason: `Sale Reversal (ID: ${saleToDelete.id})`, adjustedBy: 'System' } as StockAdjustment));
                setStockAdjustments(prev => [...adjustments, ...prev]);
            }
        }

        // 2. Revert Customer Stats
        if (!saleToDelete.isCounterSale) {
            setCustomers(prev => prev.map(c => {
                if (c.id === saleToDelete.customerId) {
                    const unit = saleToDelete.unitPrice || 0;
                    const cost = saleToDelete.bottlesSold * unit;
                    const newTotalBalance = c.totalBalance - (cost - saleToDelete.amountReceived);
                    const newBottlesPurchased = c.bottlesPurchased - saleToDelete.bottlesSold;
                    const newEmptyBottlesOnHand = c.emptyBottlesOnHand - saleToDelete.bottlesSold + saleToDelete.bottlesReturned;
                    // Note: paidBottles logic is complex to reverse accurately without a full payment ledger.
                    return { ...c, totalBalance: newTotalBalance, bottlesPurchased: newBottlesPurchased, emptyBottlesOnHand: newEmptyBottlesOnHand };
                }
                return c;
            }));
        }

        // 3. Delete sale record
        setSales(prev => prev.filter(s => s.id !== saleToDelete.id));
        
        setDeleteSaleModalOpen(false);
        setSaleToDelete(null);
        showToast('Sale deleted and data reverted!', 'success');
    };

    const handleConfirmDeleteItem = () => {
        if(itemToEdit) {
            const itemId = itemToEdit.id;
            // Return remaining stock to warehouse before deleting
            if (itemToEdit.stock && itemToEdit.stock > 0) {
                setWarehouseStock(prev => prev + itemToEdit.stock);
            }
            setInventory(prev => prev.filter(i => i.id !== itemId));
            setStockAdjustments(prev => prev.filter(sa => sa.itemId !== itemId));
            setDeleteInventoryItemModalOpen(false);
            setItemToEdit(null);
            showToast('Item and history deleted!', 'success');
        }
    };

    // Monthly closing: archive sales/expenses (and related logs/adjustments) for a period, then remove them from active data
    const handleCloseMonth = (startIso: string, endIso: string) => {
        try {
            const start = new Date(startIso + 'T00:00:00');
            const end = new Date(endIso + 'T23:59:59');

            const inRange = (dateStr: string) => {
                const d = new Date(dateStr + 'T00:00:00');
                return d >= start && d <= end;
            };

            const salesToArchive = sales.filter(s => inRange(s.date));
            const expensesToArchive = expenses.filter(e => inRange(e.date));
            const bottleLogsToArchive = bottleLogs.filter(b => inRange(b.date));
            const stockAdjustmentsToArchive = stockAdjustments.filter(sa => inRange(sa.date));

            const totalRevenue = salesToArchive.reduce((sum, s) => sum + (s.unitPrice ? s.unitPrice * s.bottlesSold : s.amountReceived || 0), 0);
            const totalExpenses = expensesToArchive.reduce((sum, e) => sum + e.amount, 0);

            // For each customer, compute unpaid amount during the period and add to their totalBalance
            setCustomers(prevCustomers => prevCustomers.map(c => {
                const custSales = salesToArchive.filter(s => s.customerId === c.id);
                const expected = custSales.reduce((sum, s) => sum + (s.unitPrice ? s.unitPrice * s.bottlesSold : (s.amountReceived || 0)), 0);
                const received = custSales.reduce((sum, s) => sum + (s.amountReceived || 0), 0);
                const unpaid = Math.max(0, expected - received);
                if (unpaid > 0) {
                    return { ...c, totalBalance: c.totalBalance + unpaid };
                }
                return c;
            }));

            const closing: MonthlyClosing = {
                id: Date.now(),
                periodStart: startIso,
                periodEnd: endIso,
                createdAt: new Date().toISOString(),
                sales: salesToArchive,
                expenses: expensesToArchive,
                totalRevenue,
                totalExpenses,
                    totalCashRevenue: salesToArchive.reduce((sum, s) => sum + (s.paymentMethod === 'bank' ? 0 : (s.amountReceived || 0)), 0),
                    totalBankRevenue: salesToArchive.reduce((sum, s) => sum + (s.paymentMethod === 'bank' ? (s.amountReceived || 0) : 0), 0),
                    totalCashExpenses: expensesToArchive.reduce((sum, e) => sum + (e.paymentAccount === 'bank' ? 0 : e.amount), 0),
                    totalBankExpenses: expensesToArchive.reduce((sum, e) => sum + (e.paymentAccount === 'bank' ? e.amount : 0), 0),
                    netBalance: (totalRevenue - totalExpenses)
                };

            setMonthlyClosings(prev => [closing, ...prev]);

            // Remove archived records from active datasets
            setSales(prev => prev.filter(s => !inRange(s.date)));
            setExpenses(prev => prev.filter(e => !inRange(e.date)));
            setBottleLogs(prev => prev.filter(b => !inRange(b.date)));
            setStockAdjustments(prev => prev.filter(sa => !inRange(sa.date)));

            showToast(`Closed period ${startIso} → ${endIso}. Archived ${salesToArchive.length} sales and ${expensesToArchive.length} expenses.`, 'success');
        } catch (err) {
            console.error('Error closing month', err);
            showToast('Failed to close month. See console for details.', 'error');
        }
    };

    const recordPayment = (customerId: number, amount: number, date: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (!customer) return;
        const sale: SaleRecord = { id: Date.now(), customerId, customerName: customer.name, bottlesSold: 0, amountReceived: amount, date, isCounterSale: false, bottlesReturned: 0 };
        setSales(prev => [sale, ...prev]);
        setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, totalBalance: Math.max(0, c.totalBalance - amount) } : c));
        showToast('Payment recorded!', 'success');
    };

    // Expense handlers: update and delete should reconcile cash/bank balances
    const handleUpdateExpense = (updatedExpense: Expense) => {
        const original = expenses.find(e => e.id === updatedExpense.id);
        if (!original) return;

        // Revert original deduction
        if (original.paymentAccount === 'bank') {
            setBankBalance(prev => prev + (original.amount || 0));
        } else {
            setCashBalance(prev => prev + (original.amount || 0));
        }

        // Apply new deduction
        if (updatedExpense.paymentAccount === 'bank') {
            setBankBalance(prev => prev - (updatedExpense.amount || 0));
        } else {
            setCashBalance(prev => prev - (updatedExpense.amount || 0));
        }

        setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
        setEditExpenseModalOpen(false);
        showToast('Expense updated!', 'success');
    };

    const handleDeleteExpense = (expenseId: number) => {
        const exp = expenses.find(e => e.id === expenseId);
        if (!exp) return;

        // Revert the deduction
        if (exp.paymentAccount === 'bank') {
            setBankBalance(prev => prev + (exp.amount || 0));
        } else {
            setCashBalance(prev => prev + (exp.amount || 0));
        }

        setExpenses(prev => prev.filter(e => e.id !== expenseId));
        // If currently editing this expense, close modal
        if (editingExpense && editingExpense.id === expenseId) {
            setEditExpenseModalOpen(false);
            setEditingExpense(null);
        }
        showToast('Expense deleted and balances reconciled!', 'success');
    };


    // Effect to update delivery-due status daily
    useEffect(() => {
        const today = new Date().toLocaleString('en-us', { weekday: 'long' });
        setCustomers(prev => prev.map(c => ({
            ...c,
            deliveryDueToday: c.deliveryDays.includes(today)
        })));
    }, []); // Runs once on app load

    const renderContent = () => {
        if (!userType || userType === 'admin') {
            switch (activeView) {
                case 'dashboard': return <>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-brand-text-primary">Dashboard Overview</h1>
                    </div>
                    <Dashboard customers={customers} sales={sales} expenses={expenses} onNavigate={handleNavigate} onViewCustomer={(c) => { setSelectedCustomer(c); setActiveView('customerDetail'); }} />
                </>;
                case 'customers': return (
                    <>
                        <CustomerFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} dueFilter={dueFilter} onDueFilterChange={setDueFilter} />
                        <CustomerTable
                            customers={filteredCustomers} salesmen={salesmen}
                            onAddCustomer={() => setAddCustomerModalOpen(true)}
                            onAddSale={(c) => { setSelectedCustomer(c); setAddSaleModalOpen(true); }}
                            onViewDetails={(c) => { setSelectedCustomer(c); setActiveView('customerDetail'); }}
                            onEdit={(c) => { setSelectedCustomer(c); setEditCustomerModalOpen(true); }}
                            onDelete={(c) => { setSelectedCustomer(c); setDeleteCustomerModalOpen(true); }}
                                sales={sales}
                                bottleLogs={bottleLogs}
                        />
                    </>
                );
                case 'customerDetail': return selectedCustomer ? <CustomerDetail customer={selectedCustomer} salesHistory={sales.filter(s => s.customerId === selectedCustomer.id)} bottleLogs={bottleLogs.filter(b => b.customerId === selectedCustomer.id)} salesmen={salesmen} onBack={() => handleNavigate('customers')} /> : <div>No customer selected.</div>;
                case 'dailyAssigned': return <DailyBottlesAssigned salesmen={salesmen} />;
                case 'sales': return <DailySales sales={sales} salesmen={salesmen} onAddCounterSale={() => setAddCounterSaleModalOpen(true)} onEditSale={(s) => {setEditingSale(s); setEditSaleModalOpen(true)}} onDeleteSale={(s) => {setSaleToDelete(s); setDeleteSaleModalOpen(true)}} />;
                case 'expenses': return <Expenses expenses={expenses} accounts={expenseAccounts} onAddExpense={(id?: number | null) => { setAddExpenseModalOpen(true); setAddExpenseInitialAccountId(id ?? null); }} onEditExpense={(e) => {setEditingExpense(e); setEditExpenseModalOpen(true)}} onDeleteExpense={handleDeleteExpense} />;
                case 'inventory': return <Inventory inventory={inventory} onAddItem={() => setAddInventoryItemModalOpen(true)} onEditItem={(i) => {setItemToEdit(i); setEditInventoryItemModalOpen(true)}} onDeleteItem={(i) => {setItemToEdit(i); setDeleteInventoryItemModalOpen(true)}} onAdjustStock={(i) => {setItemToEdit(i); setAdjustStockModalOpen(true)}} onViewDetails={(i) => {setSelectedInventoryItem(i); setActiveView('inventoryDetail')}} />;
                case 'inventoryDetail': return selectedInventoryItem ? <InventoryItemDetail item={selectedInventoryItem} history={stockAdjustments.filter(sa => sa.itemId === selectedInventoryItem.id)} onBack={() => handleNavigate('inventory')} /> : <div>No item selected.</div>;
                case 'stock': return <Stock inventory={inventory} onAddItem={() => setAddInventoryItemModalOpen(true)} onEditItem={(i) => {setItemToEdit(i); setEditInventoryItemModalOpen(true)}} onDeleteItem={(i) => {setItemToEdit(i); setDeleteInventoryItemModalOpen(true)}} onAdjustStock={(i) => {setItemToEdit(i); setAdjustStockModalOpen(true)}} onViewDetails={(i) => {setSelectedInventoryItem(i); setActiveView('inventoryDetail')}} warehouseStock={warehouseStock} />;
                case 'schedule': return <DeliverySchedule customers={customers} onEditSchedule={(c) => { setSelectedCustomer(c); setEditScheduleModalOpen(true); }} />;
                case 'reminders': return <DailyReminders customers={customers} sales={sales} />;
                case 'bottleTracking': return <BottleTracking customers={customers} onAdjustBottles={(c) => { setSelectedCustomer(c); setAdjustBottlesModalOpen(true); }} />;
                case 'salesmen': return <Salesmen salesmen={salesmen} onAddSalesman={() => setAddSalesmanModalOpen(true)} onDeleteSalesman={(id) => setSalesmen(salesmen.filter(s => s.id !== id))} onViewReport={(s) => {setSelectedSalesman(s); setActiveView('salesmanReport')}} onAddPayment={(s) => {setSelectedSalesman(s); setAddSalesmanPaymentModalOpen(true)}} />;
                case 'salesmanReport': return selectedSalesman ? <SalesmanReport salesman={selectedSalesman} salesRecords={sales} salesmanPayments={salesmanPayments} customers={customers} onBack={() => handleNavigate('salesmen')} /> : <div>No salesman selected.</div>;
                case 'reports': return <Reports sales={sales} expenses={expenses} customers={customers} />;
                case 'counterSales': return <>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-brand-text-primary">Counter Sales</h1>
                        <button onClick={() => setAddCounterSaleModalOpen(true)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Record Counter Sale</button>
                    </div>
                    <CounterSales sales={sales} />
                </>;
                case 'closing': return <ClosingReport sales={sales} expenses={expenses} monthlyClosings={monthlyClosings} onCloseMonth={handleCloseMonth} />;
                case 'outstanding': return <Outstanding customers={customers} sales={sales} monthlyClosings={monthlyClosings} onRecordPayment={recordPayment} />;
                default: return <div>Not Found</div>;
            }
        }
        return null;
    };

    // Wrap all content with domain protection
    const renderApp = () => {
        if (authStatus === 'chooser') {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginChooser onChoose={(type) => setAuthStatus(type === 'admin' ? 'admin-login' : 'salesman-login')} />
                </Suspense>
            );
        }
        if (authStatus === 'admin-login') {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <Login onLogin={() => handleLogin('admin')} showSignup={() => setAuthStatus('signup')} />
                </Suspense>
            );
        }
         if (authStatus === 'salesman-login') {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <SalesmanLogin salesmen={salesmen} onLogin={(salesman) => handleLogin('salesman', salesman)} onBack={() => setAuthStatus('chooser')} />
                </Suspense>
            );
        }
        if (authStatus === 'signup') {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <Signup onSignup={() => handleLogin('admin')} showLogin={() => setAuthStatus('admin-login')} />
                </Suspense>
            );
        }
        if (userType === 'salesman' && loggedInSalesman) {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <SalesmanDashboard salesman={loggedInSalesman} customers={customers} onLogout={handleLogout} />
                </Suspense>
            );
        }

        return (
            <div className="flex h-screen bg-brand-bg">
                <div className="no-print">
                    <Sidebar activeView={activeView} onNavigate={handleNavigate} />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="no-print">
                        <Header
                            onLogout={handleLogout}
                            adminName={adminName}
                            onOpenNotifications={() => handleNavigate('reminders')}
                            notificationsCount={customers.filter(c => c.deliveryDueToday || c.totalBalance > 0).length}
                        />
                    </div>
                    
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                        <Suspense fallback={<div>Loading...</div>}>
                            {renderContent()}
                        </Suspense>
                    </main>
                    {/* Footer removed per request */}
                </div>

                {/* Modals */}
                <div className="no-print">
                    <Suspense fallback={null}>
                        <AddCustomerModal isOpen={isAddCustomerModalOpen} onClose={() => setAddCustomerModalOpen(false)} onAddCustomer={handleAddCustomer} salesmen={salesmen} areas={areas} />
                        <EditCustomerModal isOpen={isEditCustomerModalOpen} onClose={() => setEditCustomerModalOpen(false)} customer={selectedCustomer} onUpdateCustomer={handleUpdateCustomer} salesmen={salesmen} areas={areas} />
                        <DeleteCustomerModal isOpen={isDeleteCustomerModalOpen} onClose={() => setDeleteCustomerModalOpen(false)} onConfirm={handleDeleteCustomer} customerName={selectedCustomer?.name || ''} />
                        <AddSaleModal isOpen={isAddSaleModalOpen} onClose={() => setAddSaleModalOpen(false)} onAddSale={handleAddSale} customer={selectedCustomer} salesmen={salesmen} inventory={inventory} />

                        <AddExpenseModal isOpen={isAddExpenseModalOpen} onClose={() => { setAddExpenseModalOpen(false); setAddExpenseInitialAccountId(null); }} accounts={expenseAccounts} onCreateAccount={(name: string) => {
                            const acc = { id: Date.now(), name };
                            setExpenseAccounts(prev => [acc, ...prev]);
                            return acc;
                        }} onAddExpense={(expense) => {
                            // Persist expense
                            const withId = { ...expense, id: Date.now() };
                            setExpenses(prev => [withId, ...prev]);
                            // Deduct from selected account
                            if (expense.paymentAccount === 'bank') {
                                setBankBalance(prev => prev - (expense.amount || 0));
                            } else {
                                // default to cash when undefined
                                setCashBalance(prev => prev - (expense.amount || 0));
                            }
                            showToast('Expense added!', 'success');
                        }} initialAccountId={addExpenseInitialAccountId} />
                        <EditExpenseModal isOpen={isEditExpenseModalOpen} onClose={() => setEditExpenseModalOpen(false)} accounts={expenseAccounts} expense={editingExpense} onUpdateExpense={handleUpdateExpense} />
                        
                        <AddInventoryItemModal isOpen={isAddInventoryItemModalOpen} onClose={() => setAddInventoryItemModalOpen(false)} onAddItem={(item) => {
                            const newItem = {...item, id: Date.now()};
                            setInventory(prev => [newItem, ...prev]);
                            // Deduct from warehouse pool when adding initial stock to inventory
                            if (newItem.stock && newItem.stock > 0) {
                                setWarehouseStock(prev => Math.max(0, prev - newItem.stock));
                                // Record a stock adjustment for the transfer
                                setStockAdjustments(prev => [{ id: Date.now() + Math.floor(Math.random() * 1000), itemId: newItem.id, date: new Date().toISOString().split('T')[0], quantityChange: newItem.stock, reason: 'Received to inventory from warehouse', adjustedBy: 'System' }, ...prev]);
                            }
                            showToast('Item added!', 'success');
                        }} />
                        <EditInventoryItemModal isOpen={isEditInventoryItemModalOpen} onClose={() => setEditInventoryItemModalOpen(false)} item={itemToEdit} onUpdateItem={(item) => { setInventory(prev => prev.map(i => i.id === item.id ? item : i)); setEditInventoryItemModalOpen(false); showToast('Item updated!', 'success');}} />
                        <AdjustStockModal isOpen={isAdjustStockModalOpen} onClose={() => setAdjustStockModalOpen(false)} item={itemToEdit} onAdjustStock={(itemId, newStock, quantityChange, reason) => {
                            // Transfer logic: if newStock > oldStock, deduct the difference from warehouseStock; if newStock < oldStock, return the difference to warehouseStock
                            setInventory(prev => prev.map(i => {
                                if (i.id !== itemId) return i;
                                const old = i.stock;
                                const diff = newStock - old;
                                if (diff > 0) {
                                    // taking from warehouse
                                    setWarehouseStock(ws => Math.max(0, ws - diff));
                                } else if (diff < 0) {
                                    // returning to warehouse
                                    setWarehouseStock(ws => ws + Math.abs(diff));
                                }
                                return { ...i, stock: newStock };
                            }));
                            setStockAdjustments(prev => [{id: Date.now(), itemId, date: new Date().toISOString().split('T')[0], quantityChange, reason, adjustedBy: 'Admin'}, ...prev]);
                            setAdjustStockModalOpen(false);
                            showToast('Stock adjusted!', 'success');
                        }} />
                        <DeleteInventoryItemModal isOpen={isDeleteInventoryItemModalOpen} onClose={() => setDeleteInventoryItemModalOpen(false)} itemName={itemToEdit?.name || ''} onConfirm={handleConfirmDeleteItem} />
                        
                        <EditScheduleModal isOpen={isEditScheduleModalOpen} onClose={() => setEditScheduleModalOpen(false)} customer={selectedCustomer} onSave={(customerId, newSchedule) => { setCustomers(prev => prev.map(c => c.id === customerId ? {...c, deliveryDays: newSchedule} : c)); showToast('Schedule updated!', 'success'); }} />
                        <AdjustEmptyBottlesModal isOpen={isAdjustBottlesModalOpen} onClose={() => setAdjustBottlesModalOpen(false)} customer={selectedCustomer} onSave={(customerId, newCount) => { setCustomers(prev => prev.map(c => c.id === customerId ? {...c, emptyBottlesOnHand: newCount} : c)); showToast('Bottle count updated!', 'success'); }} />
                        
                        <AddSalesmanModal isOpen={isAddSalesmanModalOpen} onClose={() => setAddSalesmanModalOpen(false)} onAddSalesman={(s) => { setSalesmen(prev => [{...s, id: Date.now()}, ...prev]); showToast('Salesman added!', 'success');}}/>
                        <AddSalesmanPaymentModal isOpen={isAddSalesmanPaymentModalOpen} onClose={() => setAddSalesmanPaymentModalOpen(false)} salesman={selectedSalesman} onRecordPayment={(salesmanId, amount, date) => { setSalesmanPayments(prev => [{id: Date.now(), salesmanId, amount, date}, ...prev]); setAddSalesmanPaymentModalOpen(false); showToast('Payment recorded!', 'success'); }} />
                        
                        <AddCounterSaleModal isOpen={isAddCounterSaleModalOpen} onClose={() => setAddCounterSaleModalOpen(false)} onRecordSale={(amount, description) => { const sale: SaleRecord = {id: Date.now(), customerId: 0, customerName: 'Counter Sale', bottlesSold: 0, amountReceived: amount, date: new Date().toISOString().split('T')[0], isCounterSale: true, description, bottlesReturned: 0 }; setSales(prev => [sale, ...prev]); setAddCounterSaleModalOpen(false); showToast('Counter sale recorded!', 'success'); }} />
                        <EditSaleModal isOpen={isEditSaleModalOpen} onClose={() => setEditSaleModalOpen(false)} sale={editingSale} onUpdateSale={handleUpdateSale} salesmen={salesmen} />
                        <DeleteSaleModal isOpen={isDeleteSaleModalOpen} onClose={() => setDeleteSaleModalOpen(false)} saleInfo={saleToDelete ? `${saleToDelete.customerName} (PKR ${saleToDelete.amountReceived})` : ''} onConfirm={handleConfirmDeleteSale} />
                    </Suspense>
                </div>
            </div>
        );
    };

    return (
        <DomainProtection 
            authorizedDomains={domainConfig.authorizedDomains}
            allowLocalhost={domainConfig.allowLocalhost}
        >
            {renderApp()}
        </DomainProtection>
    );
};

export default App;
