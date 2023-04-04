const { Api, JsonRpc, JsSignatureProvider } = require('ineryjs');
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const account = "<isi dengan akun Anda>";
const PORT = "<isi dengan port yang ingin digunakan>";
const node = "<isi dengan URL dari node Anda>";
const private_key = "<isi dengan private key Anda>";
const json_rpc = new JsonRpc(node);
const signature = new JsSignatureProvider([private_key]);

const app = express();

app.use(express.static('dapp22'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = new Api({
  rpc: json_rpc,
  signatureProvider: signature,
});

app.post('/dapp22', async (req, res) => {
  const action = req.body.action;
  const dataId = parseInt(req.body.data);
  const data = req.body.data;
  if (['create', 'read', 'update', 'destroy'].includes(action) && !isNaN(dataId)) {
    try {
      const results = await api.transact({
        actions: [
          {
            account: account,
            name: action,
            authorization: [{ actor: account, permission: 'active' }],
            data: { id: dataId, user: account, data },
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
