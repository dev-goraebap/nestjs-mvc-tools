#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const program = new Command();

program
  .command('init')
  .description('Initialize NestJS MVC Tools in your project')
  .action(() => {
    console.log('Initializing NestJS MVC Tools...');

    const templateDir = path.resolve(__dirname, '../../templates');
    const userProjectRoot = process.cwd();
    const destinationPath = path.join(userProjectRoot, 'resources');

    console.log(`Copying template files from ${templateDir} to ${destinationPath}...`);

    try {
      fs.copySync(templateDir, destinationPath, { overwrite: true });
      console.log('✅ Template files copied successfully!');

      console.log(`Installing dependencies in ${destinationPath}...`);
      execSync('npm install', { cwd: destinationPath, stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully!');

    } catch (err) {
      console.error('❌ Error during initialization:', err);
    }
  });

program.parse(process.argv);
