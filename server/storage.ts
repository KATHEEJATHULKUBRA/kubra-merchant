import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  shops, type Shop, type InsertShop,
  rentals, type Rental, type InsertRental,
  rentalPayments, type RentalPayment, type InsertRentalPayment,
  sales, type Sale, type InsertSale
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(merchantId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLowStockProducts(merchantId: number, threshold: number): Promise<Product[]>;
  
  // Order methods
  getOrders(merchantId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Shop methods
  getShop(merchantId: number): Promise<Shop | undefined>;
  createShop(shop: InsertShop): Promise<Shop>;
  updateShop(merchantId: number, shop: Partial<InsertShop>): Promise<Shop | undefined>;
  
  // Rental methods
  getRental(merchantId: number): Promise<Rental | undefined>;
  createRental(rental: InsertRental): Promise<Rental>;
  updateRental(id: number, rental: Partial<InsertRental>): Promise<Rental | undefined>;
  
  // Rental Payment methods
  getRentalPayments(rentalId: number): Promise<RentalPayment[]>;
  createRentalPayment(payment: InsertRentalPayment): Promise<RentalPayment>;
  
  // Sales methods
  getDailySales(merchantId: number, date: Date): Promise<number>;
  getTotalSales(merchantId: number, startDate: Date, endDate: Date): Promise<number>;
  getSalesByDateRange(merchantId: number, startDate: Date, endDate: Date): Promise<Sale[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private shops: Map<number, Shop>;
  private rentals: Map<number, Rental>;
  private rentalPayments: Map<number, RentalPayment[]>;
  private sales: Map<number, Sale[]>;
  
  private userIdCounter: number = 1;
  private productIdCounter: number = 1;
  private orderIdCounter: number = 1;
  private orderItemIdCounter: number = 1;
  private shopIdCounter: number = 1;
  private rentalIdCounter: number = 1;
  private rentalPaymentIdCounter: number = 1;
  private saleIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.shops = new Map();
    this.rentals = new Map();
    this.rentalPayments = new Map();
    this.sales = new Map();
    
    // Seed demo merchant data
    this.seedData();
  }
  
  private seedData() {
    // Create a demo merchant
    const demoMerchant: InsertUser = {
      username: 'merchant',
      email: 'merchant@kubra.com',
      password: 'Kubra123',
      name: 'Sarah',
      phone: '+1 (555) 123-4567'
    };
    
    const merchant = this.createUser(demoMerchant);
    
    // Create a shop for demo merchant
    const shop: InsertShop = {
      merchantId: merchant.id,
      name: 'Kubra Fresh Market',
      phone: '+1 (555) 123-4567',
      email: 'info@kubramarket.com',
      address: '123 Market Street, Suite 101, San Francisco, CA 94103',
      description: 'Kubra Fresh Market is your neighborhood premium grocery store. We specialize in locally sourced organic produce, artisanal breads, and high-quality grocery essentials.',
      banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400',
      businessHours: {
        monday: '8:00 AM - 8:00 PM',
        tuesday: '8:00 AM - 8:00 PM',
        wednesday: '8:00 AM - 8:00 PM',
        thursday: '8:00 AM - 8:00 PM',
        friday: '8:00 AM - 9:00 PM',
        saturday: '9:00 AM - 9:00 PM',
        sunday: '10:00 AM - 6:00 PM'
      }
    };
    
    this.createShop(shop);
    
    // Create products
    const products: InsertProduct[] = [
      {
        name: 'Artisan Whole Wheat Bread',
        description: 'Freshly baked daily',
        price: 4.99,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        status: 'active',
        merchantId: merchant.id
      },
      {
        name: 'Organic Apples',
        description: 'Fresh local produce',
        price: 2.99,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        status: 'active',
        merchantId: merchant.id
      },
      {
        name: 'Organic Milk',
        description: 'Whole milk, 1L bottle',
        price: 3.49,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        status: 'active',
        merchantId: merchant.id
      },
      {
        name: 'Premium Coffee Beans',
        description: 'Dark roast, 500g bag',
        price: 12.99,
        stock: 24,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        status: 'active',
        merchantId: merchant.id
      },
      {
        name: 'Vegetable Mix',
        description: 'Seasonal selection',
        price: 9.99,
        stock: 15,
        image: 'https://pixabay.com/get/gf0ea24fb146b5fc7265582ac126b05ddd910cb15695b1da16f1758f04fe37a1f91cd9c67f020ae924ebef337c650c334ccbc3170a6c1652b0063fe4c97ed30c3_1280.jpg',
        status: 'active',
        merchantId: merchant.id
      },
      {
        name: 'Organic Honey',
        description: 'Local wildflower, 350g',
        price: 8.49,
        stock: 18,
        image: 'https://pixabay.com/get/g220f13b043e74ff781df6fa448d1503f09cc4e10234adb9229dae137d009792c40bd39854772880267a551d885a6a8ce0953325082ed713cc9ee66675df68886_1280.jpg',
        status: 'active',
        merchantId: merchant.id
      }
    ];
    
    products.forEach(product => this.createProduct(product));
    
    // Create orders
    const orders: { order: InsertOrder, items: InsertOrderItem[] }[] = [
      {
        order: {
          orderNumber: 'ORD-2023-1854',
          customerId: 1,
          customerName: 'Emma Wilson',
          total: 125.40,
          status: 'completed',
        },
        items: [
          {
            orderId: 0, // Will be set in createOrder
            productId: 1,
            name: 'Artisan Whole Wheat Bread',
            price: 4.99,
            quantity: 2,
            subtotal: 9.98
          },
          {
            orderId: 0, // Will be set in createOrder
            productId: 3,
            name: 'Organic Milk',
            price: 3.49,
            quantity: 3,
            subtotal: 10.47
          }
        ]
      },
      {
        order: {
          orderNumber: 'ORD-2023-1853',
          customerId: 2,
          customerName: 'James Brown',
          total: 78.25,
          status: 'processing',
        },
        items: [
          {
            orderId: 0, // Will be set in createOrder
            productId: 4,
            name: 'Premium Coffee Beans',
            price: 12.99,
            quantity: 2,
            subtotal: 25.98
          },
          {
            orderId: 0, // Will be set in createOrder
            productId: 6,
            name: 'Organic Honey',
            price: 8.49,
            quantity: 3,
            subtotal: 25.47
          }
        ]
      },
      {
        order: {
          orderNumber: 'ORD-2023-1852',
          customerId: 3,
          customerName: 'Alex Johnson',
          total: 42.99,
          status: 'pending',
        },
        items: [
          {
            orderId: 0, // Will be set in createOrder
            productId: 2,
            name: 'Organic Apples',
            price: 2.99,
            quantity: 5,
            subtotal: 14.95
          },
          {
            orderId: 0, // Will be set in createOrder
            productId: 5,
            name: 'Vegetable Mix',
            price: 9.99,
            quantity: 2,
            subtotal: 19.98
          }
        ]
      }
    ];
    
    orders.forEach(({ order, items }) => this.createOrder(order, items));
    
    // Create rental
    const rental: InsertRental = {
      merchantId: merchant.id,
      amount: 1250,
      dueDate: new Date('2023-05-31'),
      status: 'pending',
      leaseStartDate: new Date('2023-01-01'),
      leaseEndDate: new Date('2023-12-31'),
      securityDeposit: 2500
    };
    
    const createdRental = this.createRental(rental);
    
    // Create rental payments
    const rentalPayments: InsertRentalPayment[] = [
      {
        rentalId: createdRental.id,
        paymentId: 'PMT-2023-0045',
        amount: 1250,
        method: 'Credit Card',
        status: 'paid'
      },
      {
        rentalId: createdRental.id,
        paymentId: 'PMT-2023-0032',
        amount: 1250,
        method: 'Bank Transfer',
        status: 'paid'
      },
      {
        rentalId: createdRental.id,
        paymentId: 'PMT-2023-0018',
        amount: 1250,
        method: 'Credit Card',
        status: 'paid'
      },
      {
        rentalId: createdRental.id,
        paymentId: 'PMT-2023-0005',
        amount: 1200,
        method: 'Bank Transfer',
        status: 'paid'
      }
    ];
    
    rentalPayments.forEach(payment => this.createRentalPayment(payment));
    
    // Create sales data for the past 30 days
    const today = new Date();
    let salesTotal = 0;
    
    for(let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Generate random daily sales amount between 800 and 2000
      const amount = Math.random() * (2000 - 800) + 800;
      salesTotal += amount;
      
      const sale: InsertSale = {
        merchantId: merchant.id,
        date,
        amount
      };
      
      this.createSale(sale);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  // Product methods
  async getProducts(merchantId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.merchantId === merchantId);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  async getLowStockProducts(merchantId: number, threshold: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.merchantId === merchantId && product.stock <= threshold)
      .sort((a, b) => a.stock - b.stock);
  }

  // Order methods
  async getOrders(merchantId: number): Promise<Order[]> {
    // In a real-world app, we'd filter by merchant ID, but here we just return all orders for the demo
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) || [];
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = { ...order, id, createdAt: new Date() };
    this.orders.set(id, newOrder);
    
    // Save order items
    const orderItemsWithId = items.map(item => {
      const itemId = this.orderItemIdCounter++;
      return { ...item, id: itemId, orderId: id };
    });
    
    this.orderItems.set(id, orderItemsWithId);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder = { ...existingOrder, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Shop methods
  async getShop(merchantId: number): Promise<Shop | undefined> {
    return Array.from(this.shops.values()).find(shop => shop.merchantId === merchantId);
  }

  async createShop(shop: InsertShop): Promise<Shop> {
    const id = this.shopIdCounter++;
    const newShop: Shop = { ...shop, id };
    this.shops.set(id, newShop);
    return newShop;
  }

  async updateShop(merchantId: number, shopData: Partial<InsertShop>): Promise<Shop | undefined> {
    const existingShop = Array.from(this.shops.values()).find(shop => shop.merchantId === merchantId);
    if (!existingShop) return undefined;
    
    const updatedShop = { ...existingShop, ...shopData };
    this.shops.set(existingShop.id, updatedShop);
    return updatedShop;
  }

  // Rental methods
  async getRental(merchantId: number): Promise<Rental | undefined> {
    return Array.from(this.rentals.values()).find(rental => rental.merchantId === merchantId);
  }

  async createRental(rental: InsertRental): Promise<Rental> {
    const id = this.rentalIdCounter++;
    const newRental: Rental = { ...rental, id };
    this.rentals.set(id, newRental);
    return newRental;
  }

  async updateRental(id: number, rentalData: Partial<InsertRental>): Promise<Rental | undefined> {
    const existingRental = this.rentals.get(id);
    if (!existingRental) return undefined;
    
    const updatedRental = { ...existingRental, ...rentalData };
    this.rentals.set(id, updatedRental);
    return updatedRental;
  }

  // Rental Payment methods
  async getRentalPayments(rentalId: number): Promise<RentalPayment[]> {
    return this.rentalPayments.get(rentalId) || [];
  }

  async createRentalPayment(payment: InsertRentalPayment): Promise<RentalPayment> {
    const id = this.rentalPaymentIdCounter++;
    const newPayment: RentalPayment = { ...payment, id, date: new Date() };
    
    const payments = this.rentalPayments.get(payment.rentalId) || [];
    payments.push(newPayment);
    this.rentalPayments.set(payment.rentalId, payments);
    
    return newPayment;
  }

  // Sales methods
  private createSale(sale: InsertSale): Sale {
    const id = this.saleIdCounter++;
    const newSale: Sale = { ...sale, id };
    
    const merchantSales = this.sales.get(sale.merchantId) || [];
    merchantSales.push(newSale);
    this.sales.set(sale.merchantId, merchantSales);
    
    return newSale;
  }
  
  async getDailySales(merchantId: number, date: Date): Promise<number> {
    const dateString = date.toISOString().split('T')[0];
    
    const merchantSales = this.sales.get(merchantId) || [];
    return merchantSales
      .filter(sale => sale.date.toISOString().split('T')[0] === dateString)
      .reduce((total, sale) => total + Number(sale.amount), 0);
  }

  async getTotalSales(merchantId: number, startDate: Date, endDate: Date): Promise<number> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    const merchantSales = this.sales.get(merchantId) || [];
    return merchantSales
      .filter(sale => {
        const saleTime = new Date(sale.date).getTime();
        return saleTime >= start && saleTime <= end;
      })
      .reduce((total, sale) => total + Number(sale.amount), 0);
  }
  
  async getSalesByDateRange(merchantId: number, startDate: Date, endDate: Date): Promise<Sale[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    const merchantSales = this.sales.get(merchantId) || [];
    return merchantSales.filter(sale => {
      const saleTime = new Date(sale.date).getTime();
      return saleTime >= start && saleTime <= end;
    });
  }
}

import { db } from "./db";
import { eq, sql } from "drizzle-orm";

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }
  
  // Product methods
  async getProducts(merchantId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.merchantId, merchantId));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    return !!result;
  }
  
  async getLowStockProducts(merchantId: number, threshold: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.merchantId, merchantId))
      .where(
        sql`${products.stock} <= ${threshold}`
      )
      .orderBy(products.stock);
  }
  
  // Order methods
  async getOrders(merchantId: number): Promise<Order[]> {
    // In a real implementation, we would filter by merchant ID
    return await db.select().from(orders);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Start a transaction to create both order and order items
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    
    // Add order ID to all items
    const itemsWithOrderId = items.map(item => ({
      ...item,
      orderId: newOrder.id
    }));
    
    // Insert all items
    await db
      .insert(orderItems)
      .values(itemsWithOrderId);
    
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }
  
  // Shop methods
  async getShop(merchantId: number): Promise<Shop | undefined> {
    const [shop] = await db.select().from(shops).where(eq(shops.merchantId, merchantId));
    return shop || undefined;
  }
  
  async createShop(shop: InsertShop): Promise<Shop> {
    const [newShop] = await db
      .insert(shops)
      .values(shop)
      .returning();
    return newShop;
  }
  
  async updateShop(merchantId: number, shopData: Partial<InsertShop>): Promise<Shop | undefined> {
    const [updatedShop] = await db
      .update(shops)
      .set(shopData)
      .where(eq(shops.merchantId, merchantId))
      .returning();
    return updatedShop || undefined;
  }
  
  // Rental methods
  async getRental(merchantId: number): Promise<Rental | undefined> {
    const [rental] = await db.select().from(rentals).where(eq(rentals.merchantId, merchantId));
    return rental || undefined;
  }
  
  async createRental(rental: InsertRental): Promise<Rental> {
    const [newRental] = await db
      .insert(rentals)
      .values(rental)
      .returning();
    return newRental;
  }
  
  async updateRental(id: number, rentalData: Partial<InsertRental>): Promise<Rental | undefined> {
    const [updatedRental] = await db
      .update(rentals)
      .set(rentalData)
      .where(eq(rentals.id, id))
      .returning();
    return updatedRental || undefined;
  }
  
  // Rental Payment methods
  async getRentalPayments(rentalId: number): Promise<RentalPayment[]> {
    return await db.select().from(rentalPayments).where(eq(rentalPayments.rentalId, rentalId));
  }
  
  async createRentalPayment(payment: InsertRentalPayment): Promise<RentalPayment> {
    const [newPayment] = await db
      .insert(rentalPayments)
      .values(payment)
      .returning();
    return newPayment;
  }
  
  // Sales methods
  async createSale(sale: InsertSale): Promise<Sale> {
    const [newSale] = await db
      .insert(sales)
      .values(sale)
      .returning();
    return newSale;
  }
  
  async getDailySales(merchantId: number, date: Date): Promise<number> {
    const todaySales = await db
      .select()
      .from(sales)
      .where(eq(sales.merchantId, merchantId))
      .where(eq(sales.date, date));
    
    return todaySales.reduce((sum, sale) => sum + Number(sale.amount), 0);
  }
  
  async getTotalSales(merchantId: number, startDate: Date, endDate: Date): Promise<number> {
    const salesInRange = await this.getSalesByDateRange(merchantId, startDate, endDate);
    return salesInRange.reduce((sum, sale) => sum + Number(sale.amount), 0);
  }
  
  async getSalesByDateRange(merchantId: number, startDate: Date, endDate: Date): Promise<Sale[]> {
    return await db
      .select()
      .from(sales)
      .where(eq(sales.merchantId, merchantId))
      .where(
        sql`${sales.date} >= ${startDate} AND ${sales.date} <= ${endDate}`
      );
  }
}

// Use the new DatabaseStorage implementation
export const storage = new DatabaseStorage();
