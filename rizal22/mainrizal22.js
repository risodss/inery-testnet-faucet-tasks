const { Api, JsonRpc, JsSignatureProvider } = require('ineryjs');
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const accounts = "rizal22";
const PORT = "5174";
const node = "http://178.128.95.30:8888";
const private_key = "5Kb5pF9FqL9FngRZZS7Ld2hy1WYZ6o7H4efTo4ErTnUiiRmRce9";
const json_rpc = new JsonRpc(node);
const signature = new JsSignatureProvider([private_key]);

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = new Api({
  rpc: json_rpc,
  signatureProvider: signature,
});

app.post('/dapp22', async (req, res) => {
  const actioninery = req.body.action;
  const dataIdinery = parseInt(req.body.data);
  const data = req.body.data;
  if (['create', 'read', 'update', 'destroy'].includes(actioninery) && !isNaN(dataIdinery)) {
    try {
      const results = await api.transact({
        actions: [
          {
            account: accounts,
            name: actioninery,
            authorization: [{ actor: accounts, permission: 'active' }],
            data: { id: dataIdinery, user: accounts, data },
          },
        ],
      });
      console.log(results);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  } else {
    res.status(400).json({ message: 'Invalid request' });
  }
});

(async () => {
  const ip = await axios.get('https://api.ipify.org');
  const port = PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://${ip.data}:${port}`);
  });
})();
