import { pgTable, text, serial, integer, boolean, date, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User/Merchant Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  phone: true,
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  stock: integer("stock").notNull().default(0),
  image: text("image"),
  status: text("status").notNull().default("active"),
  merchantId: integer("merchant_id").notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  stock: true,
  image: true,
  status: true,
  merchantId: true,
});

// Order Schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  total: numeric("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderNumber: true,
  customerId: true,
  customerName: true,
  total: true,
  status: true,
});

// Order Items Schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: numeric("subtotal").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  name: true,
  price: true,
  quantity: true,
  subtotal: true,
});

// Shop Schema
export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  description: text("description"),
  banner: text("banner"),
  businessHours: jsonb("business_hours"),
});

export const insertShopSchema = createInsertSchema(shops).pick({
  merchantId: true,
  name: true,
  phone: true,
  email: true,
  address: true,
  description: true,
  banner: true,
  businessHours: true,
});

// Rental Schema
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull(),
  amount: numeric("amount").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  leaseStartDate: date("lease_start_date"),
  leaseEndDate: date("lease_end_date"),
  securityDeposit: numeric("security_deposit"),
});

export const insertRentalSchema = createInsertSchema(rentals).pick({
  merchantId: true,
  amount: true,
  dueDate: true,
  status: true,
  leaseStartDate: true,
  leaseEndDate: true,
  securityDeposit: true,
});

// Rental Payment Schema
export const rentalPayments = pgTable("rental_payments", {
  id: serial("id").primaryKey(),
  rentalId: integer("rental_id").notNull(),
  paymentId: text("payment_id").notNull().unique(),
  amount: numeric("amount").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull().default("pending"),
  date: timestamp("date").defaultNow(),
});

export const insertRentalPaymentSchema = createInsertSchema(rentalPayments).pick({
  rentalId: true,
  paymentId: true,
  amount: true,
  method: true,
  status: true,
});

// Sales Schema
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull(),
  date: date("date").notNull(),
  amount: numeric("amount").notNull(),
});

export const insertSalesSchema = createInsertSchema(sales).pick({
  merchantId: true,
  date: true,
  amount: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Shop = typeof shops.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;

export type Rental = typeof rentals.$inferSelect;
export type InsertRental = z.infer<typeof insertRentalSchema>;

export type RentalPayment = typeof rentalPayments.$inferSelect;
export type InsertRentalPayment = z.infer<typeof insertRentalPaymentSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSalesSchema>;
