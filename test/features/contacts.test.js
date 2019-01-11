process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../index');
const { User, Contact } = require('../../database/models');

chai.use(chaiHttp);
const should = chai.should();

let userData, contactData, user, token, otherUserData, otherUser;

const createContact = async (userId, starred) => {
  const data = {
    user_id: userId,
    name: 'Sample Contact',
    email: 'sample@gmail.com',
    phone: '080300000000',
    starred: !!starred
  };
  const contact = await Contact.create(data);
  return contact;
};

describe('Contact Management', () => {
  beforeEach(async () => {
    // Before each test we empty the contacts table
    userData = {
      username: 'melas',
      email: 'chiemelachinedum@gmail.com',
      password: '12345'
    };

    otherUserData = {
      username: 'otheruser',
      email: 'otheruser@gmail.com',
      password: '12345'
    };

    contactData = {
      name: 'Chiemela Chinedum',
      email: 'melas@gmail.com',
      phone: '080300000000'
    };
    await Contact.destroy({ truncate: { cascade: true } });
    await User.destroy({ truncate: { cascade: true } });
    user = await User.create(userData);
    otherUser = await User.create(otherUserData);
    token = user.generateJWT();
  });

  describe('POST /api/contacts', () => {
    it('should successfully create a new contact', (done) => {
      chai.request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(contactData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('contact');
          res.body.contact.should.have.property('name').equal(contactData.name);
          done();
        });
    });

    it('should not create a new contact with invalid email supplied', (done) => {
      contactData.email = 'inavlid-email';
      chai.request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(contactData)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe('GET /api/contacts', () => {
    it('should return a users contacts', (done) => {
      contactData.user_id = user.id;
      Contact.create(contactData).then((contact) => {
        chai.request(app)
          .get('/api/contacts')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('contacts');
            res.body.contacts.length.should.be.equal(1);
            res.body.contacts[0].name.should.be.equal(contact.name);
            done();
          });
      });
    });

    it('should return only a users contacts', (done) => {
      contactData.user_id = otherUser.id;
      Contact.create(contactData).then(() => {
        chai.request(app)
          .get('/api/contacts')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('contacts');
            res.body.contacts.length.should.be.equal(0);
            done();
          });
      });
    });
  });

  describe('GET /api/contacts/:contact_id', () => {
    it('should return a user\'s single contact', (done) => {
      contactData.user_id = user.id;
      Contact.create(contactData).then((contact) => {
        chai.request(app)
          .get(`/api/contacts/${contact.id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('contact');
            res.body.contact.name.should.be.equal(contact.name);
            done();
          });
      });
    });

    it('should return only a user\'s single contact', (done) => {
      contactData.user_id = otherUser.id;
      Contact.create(contactData).then((contact) => {
        chai.request(app)
          .get(`/api/contacts/${contact.id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(404);
            should.equal(res.body.contact, null);
            done();
          });
      });
    });
  });

  describe('PATCH /api/contacts/:contact_id', () => {
    it('should update a user\'s single contact', (done) => {
      const update = { name: 'Updated Name' };
      createContact(user.id).then((contact) => {
        chai.request(app)
          .patch(`/api/contacts/${contact.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(update)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.contact.name.should.be.equal(update.name);
            done();
          });
      });
    });

    it('should not update another user\'s single contact', (done) => {
      const update = { name: 'Updated Name' };
      createContact(otherUser.id).then((contact) => {
        chai.request(app)
          .patch(`/api/contacts/${contact.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(update)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  describe('PATCH /api/contacts/:contact_id/star', () => {
    it('should star a user\'s single contact', (done) => {
      createContact(user.id).then((contact) => {
        chai.request(app)
          .patch(`/api/contacts/${contact.id}/star`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.contact.starred.should.be.equal(true);
            done();
          });
      });
    });

    it('should not star another user\'s single contact', (done) => {
      createContact(otherUser.id).then((contact) => {
        chai.request(app)
          .patch(`/api/contacts/${contact.id}/star`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  describe('PATCH /api/contacts/:contact_id/unstar', () => {
    it('should unstar a user\'s single contact', (done) => {
      createContact(user.id, true).then((contact) => {
        chai.request(app)
          .patch(`/api/contacts/${contact.id}/unstar`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.contact.starred.should.be.equal(false);
            done();
          });
      });
    });

    it('should not unstar another user\'s single contact', (done) => {
      createContact(otherUser.id, true).then((contact) => {
        chai.request(app)
          .patch(`/api/contacts/${contact.id}/unstar`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  describe('GET /api/contacts/starred', () => {
    it('should return a users starred contacts ', (done) => {
      const userStarredContactPromise = createContact(user.id, true);
      const userUnstarredContactPromise = createContact(user.id);

      Promise.all([userStarredContactPromise, userUnstarredContactPromise])
        .then(([starredContact, unstarredContact]) => {
          chai.request(app)
            .get('/api/contacts/starred')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.contacts.length.should.be.equal(1);
              res.body.contacts[0].id.should.be.equal(starredContact.id);
              res.body.contacts[0].id.should.not.be.equal(unstarredContact.id);
              done();
            });
        });
    });
  });

  describe('DELETE /api/contacts/:contact_id', () => {
    it('should delete a user\'s single contact', (done) => {
      createContact(user.id, true).then((contact) => {
        chai.request(app)
          .delete(`/api/contacts/${contact.id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should not delete another user\'s single contact', (done) => {
      createContact(otherUser.id, true).then((contact) => {
        chai.request(app)
          .delete(`/api/contacts/${contact.id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
});
