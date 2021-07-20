const mongoose = require('mongoose');
const request = require('supertest');
const {Product} = require('../../models/product');
const {User} = require('../../models/user');

let server;

describe('/api/v1/products', () => {
  beforeEach(() => {
    server = require('../../app');
  });
  afterEach(() => {
    server.close();
  });
  describe('GET: /', () => {
    it('should return all products', async () => {
      //await Product.collection.insertMany([]);
      
      const response = await request(server).get('/api/v1/products');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
  describe('GET: /:id', () => {
    it('should return a product by id', async () => {
      let response = await request(server).get('/api/v1/products');
      const product = response.body[0];

      response = await request(server).get(`/api/v1/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(product);
      expect(response.body).toHaveProperty('name', product.name);
    });
  });
  describe('GET: /:invalid-id', () => {
    it('should return 404 on invalid id', async () => {
      const response = await request(server).get(`/api/v1/products/50`);
      expect(response.status).toBe(404);
    });
  });
  describe('POST: /', () => {
    it('should return 401 - Unauthorized while posting a product anonymously', async () => {
      const token = 'Bearer '; //invalid token
      const response = await request(server)
        .post('/api/v1/products')
        .set('authorization', token)
        .send({
          name: 'dummy product',
          textDescription: 'dummy description',
          brand: 'dummy brand',
          price: 15,
          category: '60d4423daf565834d0594a7a',
          rating: 3.5,
          stock: 15
        });
      expect(response.status).toBe(401);
    });
    it('should return 400 - Bad Request while posting an invalid product category', async () => {
      const payload = {
        _id: '60e5b38f855930a67078844d', 
        isAdmin: true
      };
      const user = new User(payload);
      const token = `Bearer ${user.generateAuthToken()}`;

      const response = await request(server)
        .post('/api/v1/products')
        .set('Authorization', token)
        .send({
          name: 'dummy product',
          textDescription: 'dummy description',
          brand: 'dummy brand',
          price: 15,
          category: '60d4423daf5658', //invalid id
          rating: 3.5,
          stock: 15
        });
      expect(response.status).toBe(400);
    });
  });
  
});