import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import { verifyAuthToken } from "../middleware/auth";
import app from "../server";

const store = new ProductStore();

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product: Product = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      category: req.body.category,
    };

    if (!product.name || !product.price) {
      res.status(400).json({
        error: "Missing required fields: name, price",
      });
      return;
    }

    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params.category;
    const products = await store.getByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    const updated = await store.update(id, product);
    res.json(updated);
  } catch (err) {
    res.status(400).json(err);
  }
};

// In productRoutes:
app.put("/products/:id", verifyAuthToken, update);

const productRoutes = (app: express.Application): void => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.get("/products/category/:category", getByCategory);
};

export default productRoutes;
