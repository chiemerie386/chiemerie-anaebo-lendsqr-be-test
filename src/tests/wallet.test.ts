import request from 'supertest';
import App from '../app';
import { NewUserRegistrationDto, UserLoginDto } from '../dtos/users.dto'; // Refactored DTO imports
import AuthRoute from '../routes/auth.route';
import WalletRoute from '../routes/wallet.route';
import { getUserRecord } from './fixtures/user';
import { UserModel } from '../models/users.model'; // Refactored model imports
import { UserWalletModel } from '../models/wallets.model';
import { UserTransactionModel } from '../models/transactions.model';
import knex from '../databases';
import { Model } from 'objection';

const record = getUserRecord();
const recipient = getUserRecord();
Model.knex(knex);

const clearDb = async () => {
  const user = await UserModel.query().findOne({ email: record.email }); // Updated to use refactored model name
  if (user) {
    await UserModel.query().patch({ deleted: true }).where({ id: user.id }); // Updated to use refactored model name
    await UserWalletModel.query().patch({ deleted: true }).where({ userId: user.id }); // Updated to use refactored model name
    await UserTransactionModel.query().patch({ deleted: true }).where({ userId: user.id }); // Updated to use refactored model name
  }

  const transferRecipient = await UserModel.query().findOne({ email: recipient.email }); // Updated to use refactored model name
  if (transferRecipient) {
    await UserModel.query().patch({ deleted: true }).where({ id: transferRecipient.id }); // Updated to use refactored model name
    await UserWalletModel.query().patch({ deleted: true }).where({ userId: transferRecipient.id }); // Updated to use refactored model name
    await UserTransactionModel.query().patch({ deleted: true }).where({ userId: transferRecipient.id }); // Updated to use refactored model name
  }
};

beforeAll(clearDb);
afterAll(clearDb);

describe('Wallet', () => {
  let token: string | null = null;

  beforeAll(function (done) {
    const userData: NewUserRegistrationDto = recipient; // Updated to use refactored DTO
    const authRoute = new AuthRoute();
    const app = new App([authRoute]);
    request(app.getExpressApp())
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(201)
      .end(function (err) {
        if (err) {
          throw err;
        }
        done();
      });
  });

  beforeAll(function (done) {
    const userData: NewUserRegistrationDto = record; // Updated to use refactored DTO
    const authRoute = new AuthRoute();
    const app = new App([authRoute]);
    request(app.getExpressApp())
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(201)
      .end(function (err) {
        if (err) {
          throw err;
        }
        done();
      });
  });

  beforeAll(function (done) {
    const userData: UserLoginDto = record; // Updated to use refactored DTO
    const authRoute = new AuthRoute();
    const app = new App([authRoute]);
    request(app.getExpressApp())
      .post('/auth/login')
      .send(userData)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.data.token.token).toBeDefined();
        token = res.body.data.token.token;
        if (err) {
          throw err;
        }
        done();
      });
  });

  describe('[GET] /wallet', () => {
    it(`should fetch user's wallet`, async () => {
      const walletRoute = new WalletRoute();
      const app = new App([walletRoute]);
      const {
        body: { data },
      } = await request(app.getExpressApp()).get('/wallet').set('Authorization', `Bearer ${token}`).expect(200);
      expect(data.balance).toBeDefined();
    });
  });

  let amount = Number((5000).toFixed(2));

  describe('[POST] /wallet/fund', () => {
    it(`should fund user's wallet`, async () => {
      const walletRoute = new WalletRoute();
      const app = new App([walletRoute]);
      const {
        body: { data },
      } = await request(app.getExpressApp()).post('/wallet/fund').send({ amount }).set('Authorization', `Bearer ${token}`).expect(200);
      expect(data.balance).toBe(`${amount}.00`);
    });
  });

  describe('[POST] /wallet/withdraw', () => {
    it(`should withdraw from user's wallet`, async () => {
      const withdrawAmount = 500;
      amount = amount - withdrawAmount;
      const walletRoute = new WalletRoute();
      const app = new App([walletRoute]);
      const {
        body: { data },
      } = await request(app.getExpressApp()).post('/wallet/withdraw').send({ amount: withdrawAmount }).set('Authorization', `Bearer ${token}`).expect(200);
      expect(data.balance).toBe(`${amount}.00`);
    });
  });

  describe('[POST] /wallet/transfer', () => {
    it(`should transfer from user's wallet to recipient`, async () => {
      const transferAmount = 500;
      amount = amount - transferAmount;
      const walletRoute = new WalletRoute();
      const app = new App([walletRoute]);
      const {
        body: { data },
      } = await request(app.getExpressApp())
        .post('/wallet/transfer')
        .send({ amount: transferAmount, email: recipient.email })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(data.balance).toBe(`${amount}.00`);
    });
  });

  describe('[POST] /wallet/transactions', () => {
    it(`should fetch user's wallet transactions`, async () => {
      const walletRoute = new WalletRoute();
      const app = new App([walletRoute]);
      const {
        body: { data },
      } = await request(app.getExpressApp()).get('/wallet/transactions').set('Authorization', `Bearer ${token}`).expect(200);
      expect(data.length > 0);
    });
  });
});
