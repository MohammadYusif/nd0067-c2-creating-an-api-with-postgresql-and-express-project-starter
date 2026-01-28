import { Product, ProductStore } from "../models/product";

const store = new ProductStore();

describe("Product Model", () => {
  let createdProductId: number;

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("should have a getByCategory method", () => {
    expect(store.getByCategory).toBeDefined();
  });

  it("create method should add a product", async () => {
    const product: Product = {
      name: "Test Product",
      price: 29.99,
      category: "Electronics",
    };
    const result = await store.create(product);
    createdProductId = result.id as number;
    expect(result.name).toBe("Test Product");
    expect(parseFloat(result.price.toString())).toBe(29.99);
    expect(result.category).toBe("Electronics");
    expect(result.id).toBeDefined();
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(createdProductId);
    expect(result.id).toBe(createdProductId);
    expect(result.name).toBe("Test Product");
  });

  it("getByCategory method should return products in a category", async () => {
    const result = await store.getByCategory("Electronics");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].category).toBe("Electronics");
  });

  it("delete method should remove the product", async () => {
    const result = await store.delete(createdProductId);
    expect(result.id).toBe(createdProductId);
  });

  it("update method should change a product name", async () => {
    const updatedProduct = await store.update(createdProductId, {
      name: "Updated Laptop",
      price: 1200.0,
      category: "Electronics",
    });
    expect(updatedProduct.name).toBe("Updated Laptop");
    expect(parseFloat(updatedProduct.price.toString())).toBe(1200.0);
  });
});
