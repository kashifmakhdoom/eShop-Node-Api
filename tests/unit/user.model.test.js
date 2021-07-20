const mongoose = require('mongoose');

const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../../startup/config');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: false
    };

    const user = new User(payload);
    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, secretKey);

    //expect(decoded.id).toEqual(payload._id);
    expect(decoded).toMatchObject(expect.objectContaining({
      id: payload._id,
      isAdmin: payload.isAdmin
    }));
  });
});