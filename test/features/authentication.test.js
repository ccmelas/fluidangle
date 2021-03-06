process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../index');
const { User, BlacklistedToken } = require('../../database/models');

chai.use(chaiHttp);
chai.should();

const user = {
  username: 'melas',
  email: 'chiemelachinedum@gmail.com',
  password: '12345'
};

describe('Authentication', () => {
  beforeEach(async () => {
    // Before each test we empty the users table
    await User.destroy({ truncate: { cascade: true } });
    await BlacklistedToken.destroy({ truncate: { cascade: true } });
  });

  /** test user registration */
  describe('POST /api/register', () => {
    it('should successfully register a new user', (done) => {
      chai.request(app)
        .post('/api/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('user');
          res.body.user.should.have.property('username').equal('melas');
          done();
        });
    });

    it('should not register an existing user user', (done) => {
      User.create(user).then(() => {
        chai.request(app)
          .post('/api/register')
          .send(user)
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });
  });

  /** test user login */
  describe('POST /api/login', () => {
    it('should login a user with the correct credentials', (done) => {
      User.create(user).then(() => {
        chai.request(app)
          .post('/api/login')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.should.have.property('user');
            done();
          });
      });
    });

    it('should not login a user with an incorrect username', (done) => {
      User.create(user).then(() => {
        chai.request(app)
          .post('/api/login')
          .send({ username: 'invalid', password: user.password })
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    it('should not login a user with an incorrect password', (done) => {
      User.create(user).then(() => {
        chai.request(app)
          .post('/api/login')
          .send({ username: user.email, password: 'invalid' })
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });
  });

  /** test protected profile route access */
  describe('POST /api/me', () => {
    it('should allow a logged in user access to profile', (done) => {
      User.create(user).then((newUser) => {
        const token = newUser.generateJWT();

        chai.request(app)
          .get('/api/me')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('user');
            res.body.user.should.have.property('username').equal(user.username);
            done();
          });
      });
    });

    it('should not allow an invalid token access to protected route', (done) => {
      User.create(user).then(() => {
        const token = 'invalid-token';

        chai.request(app)
          .get('/api/me')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('GET /api/logout', () => {
    it('should logout a user', (done) => {
      User.create(user).then((newUser) => {
        const token = newUser.generateJWT();

        const requester = chai.request(app).keepOpen();

        const logoutRequest = requester.get('/api/logout')
          .set('Authorization', `Bearer ${token}`);

        const authRouteRequest = requester.get('/api/me')
          .set('Authorization', `Bearer ${token}`);

        logoutRequest.then((logoutResponse) => {
          logoutResponse.should.have.status(200);
          return authRouteRequest;
        }).then((authResponse) => {
          authResponse.should.have.status(401);
        }).then(() => {
          requester.close();
          done();
        });
      });
    });
  });
});
