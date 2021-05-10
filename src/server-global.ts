import path from 'path';

import winston from 'winston';

export enum ProductCategory {
    Jeans,
    Jackets,
    Coats,
    TShirts,
    Sneakers,
    Hats,
}

class ServerGlobal {
    private readonly _logger: winston.Logger;
    private readonly _productCategories: { value: ProductCategory, label: string }[];

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
        return this._productCategories;
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
        const matchingPosition = this._productCategories.find((productCategory) => productCategory.value === value);

        if (!matchingPosition) {
            return null;
        }

        return matchingPosition.label;
    }
}

export default ServerGlobal;