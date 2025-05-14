import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema,
  insertShopSchema,
  insertRentalPaymentSchema,
} from "@shared/schema";
import jwt from "jsonwebtoken";

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || "kubra_market_jwt_secret";

// Create JWT token for authentication
const createToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Authentication middleware
const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    // Get user from storage
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password (in a real app, we'd use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create token
      const token = createToken(user.id);
      
      // Return user and token (exclude password)
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Create token
      const token = createToken(user.id);
      
      // Return user and token (exclude password)
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Protected routes
  // Me endpoints
  app.get("/api/me", authenticate, async (req: any, res) => {
    // User is already attached to req by authenticate middleware
    const { password: _, ...userWithoutPassword } = req.user;
    return res.status(200).json(userWithoutPassword);
  });
  
  // Update profile endpoint
  app.patch("/api/me", authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Create a schema for profile update (exclude password and id)
      const updateProfileSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters").optional(),
        name: z.string().min(2, "Name must be at least 2 characters").optional(),
        email: z.string().email("Invalid email address").optional(),
        phone: z.string().optional().nullable(),
      });
      
      // Validate input data
      const validatedData = updateProfileSchema.parse(req.body);
      
      // If email is being updated, check if it's already in use
      if (validatedData.email && validatedData.email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email is already in use by another account" });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return updated user without password
      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Product Routes
  app.get("/api/products", authenticate, async (req: any, res) => {
    try {
      const products = await storage.getProducts(req.user.id);
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/products/low-stock", authenticate, async (req: any, res) => {
    try {
      const threshold = Number(req.query.threshold) || 10;
      const products = await storage.getLowStockProducts(req.user.id, threshold);
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/products/:id", authenticate, async (req: any, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure product belongs to authenticated user
      if (product.merchantId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/products", authenticate, async (req: any, res) => {
    try {
      const productData = {
        ...req.body,
        merchantId: req.user.id
      };
      
      const validatedData = insertProductSchema.parse(productData);
      
      const product = await storage.createProduct(validatedData);
      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/products/:id", authenticate, async (req: any, res) => {
    try {
      const productId = Number(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure product belongs to authenticated user
      if (product.merchantId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updatedProduct = await storage.updateProduct(productId, req.body);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/products/:id", authenticate, async (req: any, res) => {
    try {
      const productId = Number(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure product belongs to authenticated user
      if (product.merchantId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteProduct(productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Order Routes
  app.get("/api/orders", authenticate, async (req: any, res) => {
    try {
      const orders = await storage.getOrders(req.user.id);
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/orders/:id", authenticate, async (req: any, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/orders/:id/items", authenticate, async (req: any, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(Number(req.params.id));
      return res.status(200).json(items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/orders/:id/status", authenticate, async (req: any, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.getOrder(Number(req.params.id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(Number(req.params.id), status);
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Shop Routes
  app.get("/api/shop", authenticate, async (req: any, res) => {
    try {
      const shop = await storage.getShop(req.user.id);
      
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      return res.status(200).json(shop);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/shop", authenticate, async (req: any, res) => {
    try {
      // Check if shop already exists
      const existingShop = await storage.getShop(req.user.id);
      
      if (existingShop) {
        return res.status(400).json({ message: "Shop already exists" });
      }
      
      const shopData = {
        ...req.body,
        merchantId: req.user.id
      };
      
      const validatedData = insertShopSchema.parse(shopData);
      
      const shop = await storage.createShop(validatedData);
      return res.status(201).json(shop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/shop", authenticate, async (req: any, res) => {
    try {
      const shop = await storage.getShop(req.user.id);
      
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      const updatedShop = await storage.updateShop(req.user.id, req.body);
      return res.status(200).json(updatedShop);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Rental Routes
  app.get("/api/rental", authenticate, async (req: any, res) => {
    try {
      const rental = await storage.getRental(req.user.id);
      
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      return res.status(200).json(rental);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/rental/payments", authenticate, async (req: any, res) => {
    try {
      const rental = await storage.getRental(req.user.id);
      
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      const payments = await storage.getRentalPayments(rental.id);
      return res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/rental/payment", authenticate, async (req: any, res) => {
    try {
      const rental = await storage.getRental(req.user.id);
      
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      
      const paymentData = {
        ...req.body,
        rentalId: rental.id
      };
      
      const validatedData = insertRentalPaymentSchema.parse(paymentData);
      
      const payment = await storage.createRentalPayment(validatedData);
      
      // Update rental status to paid
      await storage.updateRental(rental.id, { status: 'paid' });
      
      return res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Sales Routes
  app.get("/api/sales/daily", authenticate, async (req: any, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const sales = await storage.getDailySales(req.user.id, date);
      return res.status(200).json({ date, amount: sales });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/sales/total", authenticate, async (req: any, res) => {
    try {
      const now = new Date();
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate) 
        : new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
      
      const endDate = req.query.endDate 
        ? new Date(req.query.endDate) 
        : now;
      
      const sales = await storage.getTotalSales(req.user.id, startDate, endDate);
      return res.status(200).json({ startDate, endDate, amount: sales });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/sales/range", authenticate, async (req: any, res) => {
    try {
      const now = new Date();
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate) 
        : new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
      
      const endDate = req.query.endDate 
        ? new Date(req.query.endDate) 
        : now;
      
      const sales = await storage.getSalesByDateRange(req.user.id, startDate, endDate);
      return res.status(200).json(sales);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
