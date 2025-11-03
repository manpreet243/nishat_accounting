import { Customer } from '../types';

export interface WhatsAppMessageOptions {
    date?: string; // human readable date to show in the reminder
    multiplier?: number; // PKR per bottle multiplier to show calculations (unit price)
    previousBalance?: number; // optional previous balance to include
    dailySale?: number; // total sales amount for the day to display
    // computed fields
    totalBottles?: number;
    paidBottles?: number;
    unpaidBottles?: number;
    totalAmount?: number;
    paidAmount?: number;
    unpaidAmount?: number;
    emptyBottles?: number;
}
export const generateWhatsAppMessageText = (customer: Customer, opts: WhatsAppMessageOptions = {}): string => {
    // Use the provided multiplier, or calculate from the most recent sale with a valid rate
    const multiplier = typeof opts.multiplier === 'number' ? opts.multiplier : customer.lastKnownRate || 50;

    const totalBottles = typeof opts.totalBottles === 'number' ? opts.totalBottles : (customer.bottlesPurchased || 0);
    const paidBottles = typeof opts.paidBottles === 'number' ? opts.paidBottles : (customer.paidBottles || 0);
    const unpaidBottles = typeof opts.unpaidBottles === 'number' ? opts.unpaidBottles : Math.max(0, totalBottles - paidBottles);

    const totalAmount = typeof opts.totalAmount === 'number' ? opts.totalAmount : totalBottles * multiplier;
    const paidAmount = typeof opts.paidAmount === 'number' ? opts.paidAmount : paidBottles * multiplier;
    const unpaidAmount = typeof opts.unpaidAmount === 'number' ? opts.unpaidAmount : unpaidBottles * multiplier;

    const emptyBottles = typeof opts.emptyBottles === 'number' ? opts.emptyBottles : (customer.emptyBottlesOnHand || 0);

    const dateLine = opts.date ? `Date: ${opts.date}\n` : '';
    const prevLine = typeof opts.previousBalance === 'number' ? `Previous Balance (before today): PKR ${opts.previousBalance.toLocaleString()}\n` : '';
    const dailySaleLine = typeof opts.dailySale === 'number' ? `Today's Receipts: PKR ${opts.dailySale.toLocaleString()}\n` : '';

    // Compose the reminder using the user's requested wording (calculations unchanged)
    const message = `Date: ${opts.date || ''}\nCustomer: ${customer.name}\n\n` +
        `totall bottles: ${totalBottles} * ${multiplier} = PKR ${totalAmount.toLocaleString()}\n` +
        ` Paid amount of bottles: ${paidBottles} * ${multiplier} = PKR ${paidAmount.toLocaleString()}\n` +
        ` Unpaid amount bottles: ${unpaidBottles} * ${multiplier} = PKR ${unpaidAmount.toLocaleString()}\n` +
        `total  Balance: PKR ${customer.totalBalance.toLocaleString()}\n` +
        `total  Balance - Unpaid Amount of bottles = PKR ${(customer.totalBalance - unpaidAmount).toLocaleString()}\n` +
        `${prevLine}` +
        `Remaining Empty Bottles: ${emptyBottles}\n\n` +
        `Thank you, Nishat Beverages.`;

    return message;
};

export const generateWhatsAppReminderUrl = (customer: Customer, opts: WhatsAppMessageOptions = {}): string => {
    const message = generateWhatsAppMessageText(customer, opts);
    const encodedMessage = encodeURIComponent(message);
    // In a real scenario, you would use the customer's mobile number.
    // Make sure the mobile number includes the country code, e.g., 923... for Pakistan
    return `https://wa.me/${customer.mobile}?text=${encodedMessage}`;
};