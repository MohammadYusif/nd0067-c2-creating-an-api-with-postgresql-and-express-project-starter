import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { verifyAuthToken } from '../middleware/auth';

const store = new OrderStore();

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      user_id: parseInt(req.body.user_id),
      status: req.body.status || 'active'
    };

    if (!order.user_id) {
      res.status(400).json({
        error: 'Missing required field: user_id'
      });
      return;
    }

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);
    const productId = parseInt(req.body.product_id);
    const quantity = parseInt(req.body.quantity);

    if (!productId || !quantity) {
      res.status(400).json({
        error: 'Missing required fields: product_id, quantity'
      });
      return;
    }

    const orderProduct = await store.addProduct(orderId, productId, quantity);
    res.json(orderProduct);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getCurrentOrderByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const order = await store.getCurrentOrderByUser(userId);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const getCompletedOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const orders = await store.getCompletedOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
  app.get('/orders/user/:userId/current', verifyAuthToken, getCurrentOrderByUser);
  app.get(
    '/orders/user/:userId/completed',
    verifyAuthToken,
    getCompletedOrdersByUser
  );
};

export default orderRoutes;
