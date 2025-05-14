import { db } from "../server/db";
import { 
  users, 
  shops, 
  products, 
  orders, 
  orderItems, 
  rentals, 
  rentalPayments,
  sales
} from "../shared/schema";

async function main() {
  console.log("Seeding database...");

  try {
    // Create a demo merchant
    const [merchant] = await db.insert(users).values({
      username: 'merchant',
      email: 'merchant@kubra.com',
      password: 'Kubra123',
      name: 'Sarah',
      phone: '+1 (555) 123-4567'
    }).returning();

    console.log("Created merchant:", merchant.name);

    // Create a shop for the merchant
    const [shop] = await db.insert(shops).values({
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
    }).returning();

    console.log("Created shop:", shop.name);

    // Create products
    const productData = [
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
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        status: 'active',
        merchantId: merchant.id
      },
      {
        name: 'Organic Honey',
        description: 'Local wildflower, 350g',
        price: 8.49,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        status: 'active',
        merchantId: merchant.id
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`Created ${insertedProducts.length} products`);

    // Create orders
    const order1 = await db.insert(orders).values({
      orderNumber: 'ORD-2023-1854',
      customerId: 1,
      customerName: 'Emma Wilson',
      total: 125.40,
      status: 'completed',
    }).returning();

    const order2 = await db.insert(orders).values({
      orderNumber: 'ORD-2023-1853',
      customerId: 2,
      customerName: 'James Brown',
      total: 78.25,
      status: 'processing',
    }).returning();

    const order3 = await db.insert(orders).values({
      orderNumber: 'ORD-2023-1852',
      customerId: 3,
      customerName: 'Alex Johnson',
      total: 42.99,
      status: 'pending',
    }).returning();

    console.log(`Created 3 orders`);

    // Create order items
    await db.insert(orderItems).values([
      {
        orderId: order1[0].id,
        productId: insertedProducts[0].id,
        name: 'Artisan Whole Wheat Bread',
        price: 4.99,
        quantity: 2,
        subtotal: 9.98
      },
      {
        orderId: order1[0].id,
        productId: insertedProducts[2].id,
        name: 'Organic Milk',
        price: 3.49,
        quantity: 3,
        subtotal: 10.47
      },
      {
        orderId: order2[0].id,
        productId: insertedProducts[3].id,
        name: 'Premium Coffee Beans',
        price: 12.99,
        quantity: 2,
        subtotal: 25.98
      },
      {
        orderId: order2[0].id,
        productId: insertedProducts[5].id,
        name: 'Organic Honey',
        price: 8.49,
        quantity: 3,
        subtotal: 25.47
      },
      {
        orderId: order3[0].id,
        productId: insertedProducts[1].id,
        name: 'Organic Apples',
        price: 2.99,
        quantity: 5,
        subtotal: 14.95
      },
      {
        orderId: order3[0].id,
        productId: insertedProducts[4].id,
        name: 'Vegetable Mix',
        price: 9.99,
        quantity: 2,
        subtotal: 19.98
      }
    ]);

    console.log("Created order items");

    // Create rental
    const [rental] = await db.insert(rentals).values({
      merchantId: merchant.id,
      amount: 1250,
      dueDate: new Date('2023-05-31'),
      status: 'pending',
      leaseStartDate: new Date('2023-01-01'),
      leaseEndDate: new Date('2023-12-31'),
      securityDeposit: 2500
    }).returning();

    console.log("Created rental");

    // Create rental payments
    await db.insert(rentalPayments).values([
      {
        rentalId: rental.id,
        paymentId: 'PMT-2023-0045',
        amount: 1250,
        method: 'Credit Card',
        status: 'paid',
        date: new Date('2023-04-01')
      },
      {
        rentalId: rental.id,
        paymentId: 'PMT-2023-0032',
        amount: 1250,
        method: 'Bank Transfer',
        status: 'paid',
        date: new Date('2023-03-01')
      },
      {
        rentalId: rental.id,
        paymentId: 'PMT-2023-0018',
        amount: 1250,
        method: 'Credit Card',
        status: 'paid',
        date: new Date('2023-02-01')
      },
      {
        rentalId: rental.id,
        paymentId: 'PMT-2023-0005',
        amount: 1200,
        method: 'Bank Transfer',
        status: 'paid',
        date: new Date('2023-01-01')
      }
    ]);

    console.log("Created rental payments");

    // Create sales data for the past 30 days
    const today = new Date();
    let salesTotal = 0;
    const salesData = [];

    for(let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Generate random daily sales amount between 800 and 2000
      const amount = Math.random() * (2000 - 800) + 800;
      salesTotal += amount;
      
      salesData.push({
        merchantId: merchant.id,
        date,
        amount
      });
    }

    await db.insert(sales).values(salesData);
    console.log(`Created ${salesData.length} sales records`);

    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });