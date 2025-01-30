const checkCollectionExist = async (db, colName) => {
    try {
        const total_docs = await db.collection(colName).estimatedDocumentCount();
        if (total_docs == 0) {
            return false;
        }

        return true;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchOrganization = async (db, octokit) => {
    try {
        const total_organizations = await db.collection('organizations').estimatedDocumentCount();
        if (total_organizations != 0) return [];

        const response = await octokit.request('GET /user/orgs', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return response.data;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchUsers = async (db, octokit) => {
    try {
        const total_users = await db.collection('users').estimatedDocumentCount();
        if (total_users != 0) return [];

        let members = [];
        const organizations = await db.collection('organizations').find({}).toArray();
        for (let i = 0; i < organizations.length; i++) {
            const response = await octokit.request(`GET /orgs/${organizations[i].login}/members`, {
                org: organizations[i].login,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            members = [...members, ...response.data];
        }

        return members;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchRepositories = async (db, octokit) => {
    try {
        const total_repositories = await db.collection('repositories').estimatedDocumentCount();
        if (total_repositories != 0) return [];

        let repositories = [];
        const organizations = await db.collection('organizations').find({}).toArray();
        for (let i = 0; i < organizations.length; i++) {
            const response = await octokit.request(`GET /orgs/${organizations[i].login}/repos`, {
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            repositories = [...repositories, ...response.data];
        }

        return repositories;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchCommits = async (db, octokit) => {
    try {
        const total_commits = await db.collection('commits').estimatedDocumentCount();
        if (total_commits != 0) return [];

        let commits = [];
        const repositories = await db.collection('repositories').find({}).toArray();
        for (let i = 0; i < repositories.length; i++) {
            const response = await octokit.request(`GET /repos/${repositories[i].owner.login}/${repositories[i].name}/commits`, {
                owner: repositories[i].owner.login,
                repo: repositories[i].name,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            commits = [...commits, ...response.data];
        }

        return commits;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchPulls = async (db, octokit) => {
    try {
        const total_pulls = await db.collection('pulls').estimatedDocumentCount();
        if (total_pulls != 0) return [];

        let pulls = [];
        const repositories = await db.collection('repositories').find({}).toArray();
        for (let i = 0; i < repositories.length; i++) {
            const response = await octokit.request(`GET /repos/${repositories[i].owner.login}/${repositories[i].name}/pulls`, {
                owner: repositories[i].owner.login,
                repo: repositories[i].name,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            pulls = [...pulls, ...response.data];
        }

        return pulls;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchIssues = async (db, octokit) => {
    try {
        const total_issues = await db.collection('issues').estimatedDocumentCount();
        if (total_issues != 0) return [];

        let issues = [];
        const repositories = await db.collection('repositories').find({}).toArray();
        for (let i = 0; i < repositories.length; i++) {
            const response = await octokit.request(`GET /repos/${repositories[i].owner.login}/${repositories[i].name}/issues`, {
                owner: repositories[i].owner.login,
                repo: repositories[i].name,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            issues = [...issues, ...response.data];
        }

        return issues;
    } catch (err) {
        throw new Error(err);
    }
}

const fetchChangelogs = async (db, octokit) => {
    try {
        const total_changelogs = await db.collection('changelogs').estimatedDocumentCount();
        if (total_changelogs != 0) return [];

        let changelogs = [];
        const issues = await db.collection('issues').find({}).toArray();
        for (let i = 0; i < issues.length; i++) {
            const issue_url = issues[i].url.replace('https://api.github.com', '');
            const [_x, _y, organization_name, repos_name, _z, issue_number] = issue_url.split('/');
            const response = await octokit.request(`GET ${issue_url}/timeline`, {
                owner: organization_name,
                repo: repos_name,
                issue_number: issue_number,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            changelogs = [...changelogs, ...response.data];
        }

        return changelogs;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    checkCollectionExist,
    fetchOrganization,
    fetchUsers,
    fetchRepositories,
    fetchCommits,
    fetchPulls,
    fetchIssues,
    fetchChangelogs
};