var ServerURL = 'https://rapidhealth.thakurjitourstravels.com/api';
var axios = require('axios');

const getData = async url => {
  try {
    const response = await fetch(`${ServerURL}/${url}`);
    const result = response.json();
    return result;
  } catch (e) {
    // console.log("error",e);
    return null;
  }
};

const postData = async (url, body) => {
  try {
    const response = await fetch(`${ServerURL}/${url}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result;
  } catch (e) {
    // console.log(">>>>>>",e)
    return e;
  }
};

const postFormData = async (url, body) => {
  try {
    const response = await fetch(`${ServerURL}/${url}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json;'},
      body: body,
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log(">>>>>>",e)
    return null;
  }
};

const postDataAndImage = async (url, formData) => {
  var config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const response = await axios.post(`${ServerURL}/${url}`, formData, config);
    const result = await response.data;
    return result;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};

//api call
const apiCall = async (route, method, data) => {
  // eslint-disable-next-line no-undef
  const url = `${ServerURL}/${route}`;
  let options = {
    method,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: JSON.stringify(data),
  };
  return await fetch(url, options);
};

export {ServerURL, getData, postDataAndImage, postData, apiCall, postFormData};
