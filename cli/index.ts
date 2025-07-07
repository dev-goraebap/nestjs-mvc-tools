#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const program = new Command();

// 색상 및 스타일 유틸리티
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const log = {
  info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${colors.green}${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${colors.red}${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${colors.yellow}${msg}${colors.reset}`),
  title: (msg: string) => console.log(`\n${colors.bright}${colors.magenta}🚀 ${msg}${colors.reset}\n`),
  step: (msg: string) => console.log(`${colors.blue}📦${colors.reset} ${msg}`),
};

program
  .name('nestjs-mvc-tools')
  .description('🎨 NestJS MVC Tools - Modern web development with Edge.js templates')
  .version('0.7.0');

program
  .command('init')
  .description('Initialize NestJS MVC Tools in your project')
  .action(() => {
    log.title('NestJS MVC Tools Initializer');
    
    const templateDir = path.resolve(__dirname, '../../templates');
    const userProjectRoot = process.cwd();
    const destinationPath = path.join(userProjectRoot, 'resources');

    log.step(`Copying template files to ${colors.dim}${destinationPath}${colors.reset}...`);

    try {
      fs.copySync(templateDir, destinationPath, { overwrite: true });
      log.success('Template files copied successfully!');

      log.step(`Installing dependencies in resources directory...`);
      execSync('npm install', { cwd: destinationPath, stdio: 'inherit' });
      log.success('Dependencies installed successfully!');
      
      console.log(`\n${colors.bright}${colors.green}🎉 Setup Complete!${colors.reset}`);
      console.log(`${colors.dim}You can now start building with NestJS MVC Tools.${colors.reset}\n`);
      
      log.info('Next steps:');
      console.log(`   ${colors.cyan}1.${colors.reset} Please visit the link below to continue with the setup.`);
      console.log(`   ${colors.bright}https://github.com/dev-goraebap/nestjs-mvc-tools?tab=readme-ov-file#quick-start${colors.reset}\n`);

    } catch (err) {
      log.error('Error during initialization:');
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
