import Product from "../entities/Product";

export type Event = {
    title: string;
    description: string;
    start: Date;
    end: Date;
};

export interface CalendarProvider {
    createEvent(event: Event): void;
}

export class NotificationService {
    constructor(private calendarProvider: CalendarProvider) {}

    createBuyReminder(at: Date, product: Product) {
        this.calendarProvider.createEvent({
            title: `Reminder to buy ${product.title}`,
            description: `Buy now: ${product.getBuyURL()}`,
            start: at,
            end: at,
        });
    }
}
