const fetch = require('node-fetch')

const ORGANISATION = 'whichdigital'
const { GITHUB_USERNAME, GITHUB_ACCESS_TOKEN } = process.env
const BASE_URL = `https://${GITHUB_USERNAME}:${GITHUB_ACCESS_TOKEN}@api.github.com/`

const createRepo = name => {
  if (!name) {
    throw new Error('Repo name required to create a repo')
  }

  const url = `${BASE_URL}orgs/${ORGANISATION}/repos`
  const options = {
    name,
    auto_init: true,
    private: true,
    has_issues: true,
    has_projects: true,
    has_wiki: true
  }
  const body = JSON.stringify(options)

  return fetch(url, {
    method: 'POST',
    body
  })
  .then(response => response.json())
}

const createBranchFromMaster = (repo, branch) => {
  if (!repo || !branch) {
    throw new Error('Repo name and branch name required to create a branch')
  }

  const url = `${BASE_URL}repos/${ORGANISATION}/${repo}/git/refs`
  return getRepoMasterRef(repo)
    .then(response => response.json())
    .then(data => fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: data.object.sha
      })
    }))
    .then(response => response.json())
}

const getRepoMasterRef = repo => {
  const url = `${BASE_URL}repos/${ORGANISATION}/${repo}/git/refs/heads/master`
  return fetch(url)
}

const setDefaultBranch = (repo, branch = 'develop') => {
  if (!repo) {
    throw new Error('Repo name required to set the default branch')
  }
  
  const url = `${BASE_URL}repos/${ORGANISATION}/${repo}`
  return fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({
      name: repo,
      default_branch: branch,
    })
  })
  .then(response => response.json())
}

const addAdminTeams = (repo, teams = ['Engineering']) => {
  return Promise.all(teams.map(team => getTeamID(team)))
    .then(teamIDs => Promise.all(teamIDs.map(teamID => {
      const url = `${BASE_URL}teams/${teamID}/repos/${ORGANISATION}/${repo}`
      return fetch(url, { 
        method: 'PUT',
        body: JSON.stringify({
          permission: 'admin'
        })
      })
      .then(response => response.ok)
    })))
}

const getTeamID = teamName => {
  const url = `${BASE_URL}orgs/${ORGANISATION}/teams`
  return fetch(url)
    .then(response => response.json())
    .then(teams => teams.filter(team => team.name === teamName))
    .then(teams => teams[0].id)
}

const protectBranch = (repo, branch) => {
  if (!branch) {
    throw new Error('branch name required to protect a branch')
  }
  
  const url = `${BASE_URL}repos/${ORGANISATION}/${repo}/branches/${branch}/protection`
  return fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.luke-cage-preview+json'
    },
    body: JSON.stringify({
      required_status_checks: null,
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
      },
      restrictions: {
        users: [],
        teams: ['qa']
      }
    })
  })
  .then(response => response.json())
}

const newWhichRepo = repo => {
  return createRepo(repo)
    .then(() => addAdminTeams(repo))
    .then(() => createBranchFromMaster(repo, 'develop'))
    .then(() => setDefaultBranch(repo, 'develop'))
    .then(() => protectBranch(repo, 'master'))
    .then(() => protectBranch(repo, 'develop'))
    .then(() => Promise.resolve(`Repository '${repo}' successfully created`))
}

module.exports = {
  createRepo,
  addAdminTeams,
  createBranchFromMaster,
  setDefaultBranch,
  protectBranch,
  newWhichRepo,
}