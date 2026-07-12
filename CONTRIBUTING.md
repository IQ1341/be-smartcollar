# Contributing Guide

Thank you for your interest in contributing to Smart Collar Backend.

## Branch Strategy

* `main` → Production
* `develop` → Integration branch
* `feature/*` → New features
* `hotfix/*` → Urgent fixes

## Commit Convention

Examples:

```
feat: implement assignment module
fix: resolve authentication issue
refactor: simplify monitoring service
docs: update README
style: format source code
test: add unit tests
chore: update dependencies
```

## Pull Request

* Create a feature branch from `develop`
* Keep pull requests focused on a single feature
* Ensure the application builds successfully
* Update documentation when necessary

## Coding Standards

* Use ES Modules
* Use async/await
* Keep controllers thin
* Business logic belongs in services
* Database access belongs in repositories
* Follow existing project structure
