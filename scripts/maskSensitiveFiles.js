import { randomBytes } from 'crypto';

// AI - is there any way here to import all packages directly from the root directory? AI!
import { getAllOrders, saveChangesToOrder, updateModHistory } from 'lib/http/ordersDAO.js';


/**
 * Generates a random string to use as masked data
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
function generateRandomString(length = 8) {
  return randomBytes(length).toString('hex').substring(0, length);
}

/**
 * Masks an email address while preserving the domain
 * @param {string} email - The email to mask
 * @returns {string} Masked email
 */
function maskEmail(email) {
  if (!email) return email;
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  return `${generateRandomString(8)}@${parts[1]}`;
}

/**
 * Masks a phone number while preserving format
 * @param {string} phone - The phone number to mask
 * @returns {string} Masked phone number
 */
function maskPhone(phone) {
  if (!phone) return phone;
  
  // Replace digits with random digits but keep other characters
  return phone.replace(/\d/g, () => Math.floor(Math.random() * 10).toString());
}

/**
 * Mask all sensitive information in an order
 * @param {Object} order - The order to mask
 * @returns {Object} The masked order
 */
function maskOrder(order) {
  // Create a deep copy to avoid modifying the original directly
  const maskedOrder = JSON.parse(JSON.stringify(order));
  
  // Mask customer information
  if (maskedOrder.customer) {
    maskedOrder.customer.name = `Customer ${generateRandomString(4)}`;
    maskedOrder.customer.company = maskedOrder.customer.company ? 
      `Company ${generateRandomString(4)}` : undefined;
    
    // Mask all emails
    if (Array.isArray(maskedOrder.customer.email)) {
      maskedOrder.customer.email = maskedOrder.customer.email.map(maskEmail);
    }
    
    // Mask phone numbers
    maskedOrder.customer.phoneOne = maskPhone(maskedOrder.customer.phoneOne);
    maskedOrder.customer.phoneTwo = maskPhone(maskedOrder.customer.phoneTwo);
    
    // Mask address
    maskedOrder.customer.address = maskedOrder.customer.address ? 
      `${Math.floor(Math.random() * 9000) + 1000} ${generateRandomString(8)} St` : undefined;
    maskedOrder.customer.aptSuiteNo = maskedOrder.customer.aptSuiteNo ? 
      `#${Math.floor(Math.random() * 900) + 100}` : undefined;
    
    // Keep city, state, zipCode format but mask content
    if (maskedOrder.customer.zipCode) {
      maskedOrder.customer.zipCode = String(Math.floor(Math.random() * 90000) + 10000);
    }
    
    // Nickname is also identifiable
    maskedOrder.customer.nickname = maskedOrder.customer.nickname ? 
      `Nick ${generateRandomString(4)}` : undefined;
  }
  return maskedOrder;
}

/**
 * Main function to mask all orders in the database
 */
async function maskAllOrders() {
  try {
    console.log('Starting the order masking process...');
    
    // Get all orders
    const orders = await getAllOrders();
    console.log(`Found ${orders.length} orders to process.`);
    
    // Process each order
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      console.log(`Processing order ${order._id} (${i + 1}/${orders.length})`);
      
      // Mask the order
      const maskedOrder = maskOrder(order);
      
      // Create modification history
      const modHistory = updateModHistory('Data masking for privacy');
      
      // Save the masked order back to database
      await saveChangesToOrder(order._id, maskedOrder, modHistory);
      
      console.log(`Successfully masked order ${order._id}`);
    }
    
    console.log('Order masking completed successfully!');
  } catch (error) {
    console.error('Error masking orders:', error);
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  maskAllOrders()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

// Export for testing or importing elsewhere
export default maskAllOrders;

