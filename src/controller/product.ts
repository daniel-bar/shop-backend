import mongoose from 'mongoose';

import ServerGlobal from '../server-global';

import {
    IProduct,
    ProductDB,
    IProductDocument,
} from '../model/product';

import {
    IAddProductRequest,
    IGetProductsRequest,
    IGetProductRequest,
    IGetCategoriesRequest,
} from '../model/express/request/product';
import {
    IAddProductResponse,
    IGetProductsResponse,
    IGetProductResponse,
    IGetCategoriesResponse,
} from '../model/express/response/product';

const addProduct = async (req: IAddProductRequest, res: IAddProductResponse) => {
    ServerGlobal.getInstance().logger.info('<addProduct>: Start processing request');

    try {
        // Validate provided title and content of valid length
        if (
            req.body.title.length < 3 ||
            req.body.title.length > 50 ||
            req.body.description.length < 3 ||
            req.body.description.length > 350
        ) {
            ServerGlobal.getInstance().logger.error(
                '<addProduct>: Failed to add product because invalid product fields length'
            );

            res.status(400).send({
                success: false,
                message: 'Please provide valid length of product fields',
            });
            return;
        }

        // Creating the product
        const newProduct = new ProductDB({
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
        });

        // Saving the product in DB
        await newProduct.save();

        ServerGlobal.getInstance().logger.info(
            `<addProduct>: Successfully added product with id: ${newProduct.id}`
        );

        res.status(201).send({
            success: true,
            message: 'Successfully created a new product',
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<addProduct>: Failed to add product because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const getProducts = async (req: IGetProductsRequest, res: IGetProductsResponse) => {
    ServerGlobal.getInstance().logger.info('<getProducts>: Start processing request');

    try {
        type product = Pick<IProduct, 'id' | 'category' | 'title' | 'description' | 'price'>;

        const products: ReadonlyArray<product> = await ProductDB.aggregate<product>([
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    category: 1,
                    title: 1,
                    description: 1,
                    price: 1,
                },
            },
        ]);

        ServerGlobal.getInstance().logger.info('<getProducts>: Successfully got the products');

        res.status(200).send({
            success: true,
            message: 'Successfully retrieved products',
            data: products.map((product) => ({
                ...product,
                id: product.id.toHexString(),
            })),
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<getProducts>: Failed to get products because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const getProduct = async (req: IGetProductRequest, res: IGetProductResponse) => {
    ServerGlobal.getInstance().logger.info('<getProduct>: Start processing request');

    try {
        const product: Pick<
            IProductDocument, keyof mongoose.Document | 'category' | 'title' | 'description' | 'price'
        > | null = await ProductDB.findById(req.params.id, {
            category: 1,
            title: 1,
            description: 1,
            price: 1
        });

        if (!product) {
            ServerGlobal.getInstance().logger.error(
                `<getProduct>: Failed to get product with id ${req.params.id}`
            );

            res.status(400).send({
                success: false,
                message: 'Could not find product',
            });
            return;
        }

        ServerGlobal.getInstance().logger.info('<getProduct>: Successfully got product');

        res.status(200).send({
            success: true,
            message: 'Successfully retrieved product',
            data: {
                category: ServerGlobal.getInstance().getCategoryLabel(product.category)!,
                title: product.title,
                description: product.description,
                price: product.price,
            },
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<getProduct>: Failed to get product because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

const getCategories = async (req: IGetCategoriesRequest, res: IGetCategoriesResponse) => {
    ServerGlobal.getInstance().logger.info('<getCategories>: Start processing request');

    try {
        res.status(200).send({
            success: true,
            message: 'Successfully retrieved categories',
            data: { categories: ServerGlobal.getInstance().productCategories },
        });
        return;
    } catch (e) {
        ServerGlobal.getInstance().logger.error(
            `<getCategories>: Failed to get categories because of server error: ${e}`
        );

        res.status(500).send({
            success: false,
            message: 'Server error',
        });
        return;
    }
}

export {
    addProduct,
    getProducts,
    getProduct,
    getCategories,
}