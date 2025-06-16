// netlify/functions/get-submissions.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const FORM_ID = 'activity'; // matches name="activity" in your form
  const API_KEY = process.env.NETLIFY_API_KEY;

  if (!API_KEY) {
    return { statusCode: 500, body: "Missing API key" };
  }

  const response = await fetch(`https://api.netlify.com/api/v1/forms`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    }
  });

  const forms = await response.json();
  const form = forms.find(f => f.name === FORM_ID);

  if (!form) {
    return { statusCode: 404, body: "Form not found" };
  }

  const submissionsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    }
  });

  const submissions = await submissionsRes.json();

  return {
    statusCode: 200,
    body: JSON.stringify(submissions)
  };
};
