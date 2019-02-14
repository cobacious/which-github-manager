# Which? Github Manager

A small Node app for automating common tasks for managing Which?'s Github repos.

## Setup

* Clone the repo and run `yarn`.
* Create a .env file containing your Github username and access token. Access tokens can be generated [here](https://github.com/settings/tokens). *NB*: User must have permissions to create repos within the [whichdigital](https://github.com/whichdigital) Github org.

## Usage 

* Run `node index.js` passing in the command and arguments as detailed below.

### Commands

#### newWhichRepo

Creates a new repository with the given name. Creates a master and develop branch. Sets develop as the default branch. Adds protection to both master and develop branches.

| Argument     | Required    | Default |
| ------------ | ----------- |---------|
| Repo name    | Y           | n/a     |

#### createRepo

Creates a new repository with the given name.

| Argument     | Required    | Default |
| ------------ | ----------- |---------|
| Repo name    | Y           | n/a     |

#### createBranchFromMaster

Creates a new branch off the master branch.

| Argument     | Required    | Default |
| ------------ | ----------- |---------|
| Repo name    | Y           | n/a     |
| Branch name  | Y           | n/a     |

#### setDefaultBranch

Sets the default branch to the specified branch.

| Argument             | Required    | Default |
| -------------------- | ----------- |---------|
| Repo name            | Y           | n/a     |
| Default Branch name  | N           | develop |

#### protectBranch

Adds branch protection to the specified branch.

| Argument     | Required    | Default |
| ------------ | ----------- |---------|
| Repo name    | Y           | n/a     |
| Branch name  | Y           | n/a     |