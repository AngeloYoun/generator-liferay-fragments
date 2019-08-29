const fs = require('fs');
const { prompt } = require('enquirer');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');
const execa = require('execa');
const listr = require('listr');
const logSymbols = require('log-symbols');
const { getPkg } = require('../utils/get-pkg');

/**
 * @param {string} projectName
 */
const getPkgTemplate = projectName => `
{
  "name": "${projectName}",
  "description": "Liferay Fragments project",
  "version": "1.0.0",

  "engines": {
    "node": ">=8",
    "npm": ">=6"
  },

  "keywords": [
    "liferay",
    "liferay-fragments"
  ]
}
`;

/**
 * @param {string} projectName
 */
const newProject = async projectName => {
  if (fs.existsSync(projectName)) {
    const { overwrite } = await prompt({
      type: 'confirm',
      name: 'overwrite',
      message: 'Directory already exists, overwrite?'
    });

    if (overwrite) {
      rimraf.sync(projectName);
    } else {
      return -1;
    }
  }

  await new listr([
    {
      title: 'Creating project directory',
      task: () => {
        mkdirp.sync(projectName);
        mkdirp.sync(path.join(projectName, 'src'));
      }
    },
    {
      title: 'Adding package.json',
      task: () => {
        fs.writeFileSync(
          path.join(projectName, 'package.json'),
          getPkgTemplate(projectName),
          'utf-8'
        );
      }
    },
    {
      title: 'Installing dependencies',
      task: () => {
        const pkg = getPkg();
        return execa(
          'npm',
          ['install', '--save-dev', `${pkg.name}@${pkg.version}`],
          {
            cwd: projectName
          }
        );
      }
    }
  ]).run();

  console.log(logSymbols.success, 'Project created');
};

/**
 * @param {import('commander')} commander
 */
module.exports = commander => {
  commander
    .command('new <project-name>')
    .description('creates a new fragment project')
    .action(newProject);
};
