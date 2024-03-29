const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

/* Users Requests */
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
  // *** Promises approach ***
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
  // *** Async/await approach ***
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (error) {
  //   res.status(400).send(error);
  // }
  // *** Promises approach ***
  // User.find({})
  //   .then((users) => res.send(users))
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send('User is not found!');
    }
  } catch (error) {
    res.status(400).send(error);
  }
  // *** Promises approach ***
  // User.findById(_id)
  //   .then((user) => {
  //     if (user) {
  //       return res.send(user);
  //     } else {
  //       return res.status(404).send('User is not found!');
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update!' });
  }
  try {
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (user) {
      res.send(user);
    } else {
      return res.status(404).send('User is not found!');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.send(user);
    } else {
      return res.status(404).send('User is not found!');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
