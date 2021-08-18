import path from 'path';
import fs from 'fs';

import winston from 'winston';

import { Topic } from './model/shared/topic';

export enum ProductCategory {
    Jeans = 1,
    Jackets,
    Coats,
    TShirts,
    Sneakers,
    Hats,
};

export enum ProductGender {
    Men = 1,
    Women,
};

export enum PaymentMonth {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
};

export enum PaymentYear {
    Y_2021,
    Y_2022,
    Y_2023,
    Y_2024,
    Y_2025,
};

export enum PaymentSize {
    XS,
    S,
    M,
    L,
    XL,
};

class ServerGlobal {
    private readonly _logger: winston.Logger;
    private readonly _productCategories: ReadonlyArray<{ value: ProductCategory, label: string }>;
    private readonly _paymentMonths: ReadonlyArray<{ value: PaymentMonth, label: string }>;
    private readonly _paymentYears: ReadonlyArray<{ value: PaymentYear, label: string }>;
    private readonly _paymentSizes: ReadonlyArray<{ value: PaymentSize, label: string }>;
    private readonly _productGenders: ReadonlyArray<{ value: ProductGender, label: string }>;
    private readonly _contactTopics: ReadonlyArray<{ value: Topic, label: string }>;

    private static _instance: ServerGlobal;

    private constructor() {
        this._logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(__dirname, '../logs.log'),
                    level: 'info',
                }),
            ],
        });

        this._productCategories = [
            { value: ProductCategory.Jeans, label: 'Jeans' },
            { value: ProductCategory.Jackets, label: 'Jackets' },
            { value: ProductCategory.Coats, label: 'Coats' },
            { value: ProductCategory.TShirts, label: 'T-Shirts' },
            { value: ProductCategory.Sneakers, label: 'Sneakers' },
            { value: ProductCategory.Hats, label: 'Hats' },
        ];

        this._paymentMonths = [
            { value: PaymentMonth.January, label: 'January' },
            { value: PaymentMonth.February, label: 'February' },
            { value: PaymentMonth.March, label: 'March' },
            { value: PaymentMonth.April, label: 'April' },
            { value: PaymentMonth.May, label: 'May' },
            { value: PaymentMonth.June, label: 'June' },
            { value: PaymentMonth.July, label: 'July' },
            { value: PaymentMonth.August, label: 'August' },
            { value: PaymentMonth.September, label: 'September' },
            { value: PaymentMonth.October, label: 'October' },
            { value: PaymentMonth.November, label: 'November' },
            { value: PaymentMonth.December, label: 'December' },

        ];

        this._paymentYears = [
            { value: PaymentYear.Y_2021, label: '2021' },
            { value: PaymentYear.Y_2022, label: '2022' },
            { value: PaymentYear.Y_2023, label: '2023' },
            { value: PaymentYear.Y_2024, label: '2024' },
            { value: PaymentYear.Y_2025, label: '2025' },
        ];

        this._paymentSizes = [
            { value: PaymentSize.XS, label: 'XS' },
            { value: PaymentSize.S, label: 'S' },
            { value: PaymentSize.M, label: 'M' },
            { value: PaymentSize.L, label: 'L' },
            { value: PaymentSize.XL, label: 'XL' },
        ];

        this._productGenders = [
            { value: ProductGender.Men, label: 'Men' },
            { value: ProductGender.Women, label: 'Women' },
        ];

        this._contactTopics = [
            { value: Topic.Delivery, label: 'Delivery' },
            { value: Topic.OrderIssues, label: 'Order Issues' },
            { value: Topic.ReturnsAndRefunds, label: 'Returns and Refunds' },
            { value: Topic.Technical, label: 'Technical' },
        ];
    }

    /**
    * Getter for singelton instance
    * @returns ServerGlobal singelton instance
    */
    public static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new ServerGlobal();
        return this._instance;
    }

    /**
    * Getter for the logger
    * @returns logger instance 
    */
    public get logger() {
        return this._logger;
    }

    /**
    * Getter for _productCategories property
    * @returns _productsCategories property
    */
    public get productCategories() {
        return [...this._productCategories];
    }

    /**
    * Getter for the values of the product categories
    * @returns product categories values array
    */
    public get productCategoriesValues() {
        return this._productCategories.map((productCategory) => productCategory.value);
    }

    /**
    * Getter for label of provided category value
    * @param value value of category
    * @returns label string
    */
    public getCategoryLabel(value: ProductCategory) {
        const matcingCategory = this._productCategories.find((productCategory) => productCategory.value === value);

        if (!matcingCategory) {
            return null;
        }

        return matcingCategory.label;
    }

    /**
    * Validator for category value
    * @param value category value
    * @returns boolean flag indicates whether the category is valid
    */
    public isValidCategoryValue(value: ProductCategory) {
        return !!this._productCategories.find((productCategory) => productCategory.value === value);
    }

    /**
    * Getter for _paymentMonths property
    * @returns _paymentMonths property
    */
    public get paymentMonths() {
        return [...this._paymentMonths];
    }

    /**
    * Getter for the values of the payment months
    * @returns payment months values array
    */
    public get paymentMonthsValues() {
        return this._paymentMonths.map((paymentMonth) => paymentMonth.value);
    }

    /**
    * Getter for _paymentYears property
    * @returns _paymentYears property
    */
    public get paymentYears() {
        return [...this._paymentYears];
    }

    /**
    * Getter for the values of the payment months
    * @returns payment months values array
    */
    public get paymentYearsValues() {
        return this._paymentYears.map((paymentYear) => paymentYear.value);
    }

    /**
    * Getter for _paymentSizes property
    * @returns _paymentSizes property
    */
    public get paymentSizes() {
        return [...this._paymentSizes];
    }

    /**
    * Getter for _productGenders property
    * @returns _productGenders property
    */
    public get productGenders() {
        return [...this._productGenders];
    }

    /**
    * Getter for the values of the product genders
    * @returns product genders values array
    */
    public get productGendersValues() {
        return this._productGenders.map((productGender) => productGender.value);
    }

    /**
    * Getter for label of provided gender value
    * @param value value of gender
    * @returns label string
    */
    public getGenderLabel(value: ProductGender) {
        const matchingGender = this._productGenders.find((productGender) => productGender.value === value);

        if (!matchingGender) {
            return null;
        }

        return matchingGender.label;
    }

    /**
    * Validator for gender value
    * @param value gender value
    * @returns boolean flag indicates whether the value is valid
    */
    public isValidGenderValue(value: ProductGender) {
        return !!this._productGenders.find((productGender) => productGender.value === value);
    }

    /**
    * Getter for label of provided contact topic value
    * @param value value of contact topic
    * @returns label string
    */
    public getContactTopicLabel(value: Topic) {
        const matchingTopic = this._contactTopics.find((contactTopic) => contactTopic.value === value);

        if (!matchingTopic) {
            return null;
        }

        return matchingTopic.label;
    }

    /**
    * Getter for _contactTopics property
    * @returns _contactTopics property
    */
    public get contactTopics() {
        return [...this._contactTopics];
    }
}

export default ServerGlobal;