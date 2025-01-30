const express = require('express');
const GithubController = require('../controllers/auth.controller');

const router = express.Router();
const GithubServiceController = new GithubController();

router.get('/integrate', GithubServiceController.provideRedirectLink);

router.get('/webhook', GithubServiceController.saveAuthenticatedUser);

router.get('/data', GithubServiceController.createGithubIntegrationDB);

router.get('/remove', GithubServiceController.removeIntegrationDatabase);

module.exports = router;