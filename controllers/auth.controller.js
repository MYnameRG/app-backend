const { Octokit } = require("@octokit/rest");
const { ObjectId } = require('mongodb');
const { accessToDatabase } = require('../db/connection');
const IntegrationService = require('../services/integration.service');
const User = require('../models/user.model')
const {
    fetchOrganization,
    fetchUsers,
    fetchRepositories,
    fetchCommits,
    fetchPulls,
    fetchIssues,
    fetchChangelogs,
    checkCollectionExist } = require('../helpers/integration.helpers');

module.exports = class GithubController {
    IntegrationServiceController;

    constructor() {
        this.IntegrationServiceController = new IntegrationService(
            process.env.GITHUB_CLIENT_ID,
            process.env.GITHUB_CLIENT_SECRET,
            'https://github.com/login/oauth/access_token'
        );
    }

    provideRedirectLink = async (req, res) => {
        try {
            const GITHUB_API_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&scope=${process.env.GITHUB_ACCESS_SCOPE}`;
            return res.status(200).json({ data: GITHUB_API_URL, isSuccess: true }); // Redirect the user to GitHub
        } catch (err) {
            console.log(err);
            return res.status(500).json({ data: { err: err, msg: "Problem occurs in proving link" }, isSuccess: false });
        }
    }

    saveAuthenticatedUser = async (req, res) => {
        try {
            const db = await accessToDatabase('USER');
            const auth_code = req.query.code;

            const access_token = await this.IntegrationServiceController.fetchToken(auth_code);
            if (access_token == null) throw new Error('No token provided!');

            // Use access token to get user details
            const authenticated_user = await this.IntegrationServiceController.fetchResponseFromAPI('https://api.github.com/user');
            if (authenticated_user == null) throw new Error('No User Found!');

            // User saved in database
            await db.collection('github-integration').deleteMany();

            const user = await db.collection('github-integration').insertOne(
                {
                    username: authenticated_user.login,
                    access_token: access_token,
                    type: 'Github'
                }
            );

            if (user == null) {
                throw new Error('Not able to fetch id of user');
            }

            // Attach cookie
            res.cookie('user_id', user.insertedId, { httpOnly: false });

            return res.status(301).redirect(process.env.CLIENT_URL);
        } catch (err) {
            console.log(err);
            return res.status(500).send({ data: { err: err }, isSuccess: false });
        }
    }

    createGithubIntegrationDB = async (req, res) => {
        try {
            let db = await accessToDatabase('USER');
            const user_id = (req.query.uid != '' && req.query.uid != 'null' && req.query.uid != 'undefined') ? new ObjectId(req.query.uid) : null;

            const user = await db.collection('github-integration').findOne({ _id: user_id });
            if (user == null) return res.status(400).json({ data: { msg: 'User not found' }, isSuccess: false });

            const octokit = new Octokit({
                auth: user.access_token,
            });

            db = await accessToDatabase('GITHUB');
            if (!(await checkCollectionExist(db, 'organizations'))) {
                const data = await fetchOrganization(db, octokit);
                await db.collection('organizations').insertMany([
                    ...data
                ]);
            }

            if (!(await checkCollectionExist(db, 'repositories'))) {
                const data = await fetchRepositories(db, octokit);
                await db.collection('repositories').insertMany([
                    ...data
                ]);
            }

            if (!(await checkCollectionExist(db, 'users'))) {
                const data = await fetchUsers(db, octokit);
                await db.collection('users').insertMany([
                    ...data
                ]);
            }

            if (!(await checkCollectionExist(db, 'commits'))) {
                const data = await fetchCommits(db, octokit);
                await db.collection('commits').insertMany([
                    ...data
                ]);
            }

            if (!(await checkCollectionExist(db, 'pulls'))) {
                const data = await fetchPulls(db, octokit);
                await db.collection('pulls').insertMany([
                    ...data
                ]);
            }

            if (!(await checkCollectionExist(db, 'issues'))) {
                const data = await fetchIssues(db, octokit);
                await db.collection('issues').insertMany([
                    ...data
                ]);
            }

            if (!(await checkCollectionExist(db, 'changelogs'))) {
                const data = await fetchChangelogs(db, octokit);
                await db.collection('changelogs').insertMany([
                    ...data
                ]);
            }

            return res.status(200).json({ data: null, isSuccess: true });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ data: { err: err, msg: err.message }, isSuccess: false });
        }
    }

    removeIntegrationDatabase = async (req, res) => {
        try {
            const db = await accessToDatabase('USER');
            const user_id = (req.query.uid != '' && req.query.uid != 'null' && req.query.uid != 'undefined') ? new ObjectId(req.query.uid) : null;

            const user = await db.collection('github-integration').findOne({ _id: new ObjectId(user_id) });
            if (user == null) return res.status(400).json({ data: { msg: 'User Not found' }, isSuccess: false });

            const integration_id = user.type.toLowerCase();
            const db_integration = await accessToDatabase(integration_id);

            db_integration.dropDatabase();

            return res.status(200).json({ data: null, isSuccess: true });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ data: { err: err, msg: err.message }, isSuccess: false });
        }
    }
}