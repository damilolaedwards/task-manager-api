const fetch = require('node-fetch');
const cloudinary = require('../../src/utils/cloudinary')
const User = require('../../src/models/user')



async function getAvatar(user) {
  const response = await fetch(user.avatar);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const resp = await cloudinary.uploader.destroy(user.cloudinary_id)


  if(resp.result != 'ok'){
    throw new Error(resp.statusText);
  }


  return response.status;
}



module.exports = {
  getAvatar
};