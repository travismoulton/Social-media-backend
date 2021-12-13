const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  console.log('**********************************');
  console.log(req.body);
  // const newUser = await User.create(
  //   JSON.parse(
  //     JSON.stringify({
  //       name: 'travis',
  //       email: 'travis@travis.com',
  //       password: 'pass1234',
  //     })
  //   )
  // );

  const newUser = await User.create(req.body);

  try {
    res.status(201).json({
      status: 'succcess',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
    });
  }
};
