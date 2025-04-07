// AI - write a script here that takes all the orders returned from getAllOrders and masks any identifying information from the order. Once you mask the identifying information, save the
// order back into the database using saveChangesToOrder. The data structure for any order can be found in lib/models/order.js. AI!

import { getAllOrders, saveChangesToOrder } from 'lib/http/ordersDAO.js';

