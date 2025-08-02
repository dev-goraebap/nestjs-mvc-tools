#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const program = new Command();

// 템플릿 정보 정의
interface TemplateInfo {
  name: string;
  description: string;
  technologies: string[];
  useCase: string;
}

const templates: Record<string, TemplateInfo> = {
  minimal: {
    name: 'Minimal',
    description: 'Basic setup with only Vite configuration',
    technologies: ['Vite'],
    useCase: 'Simple projects or custom setups'
  },
  tailwind: {
    name: 'Tailwind CSS',
    description: 'Includes Tailwind CSS for utility-first styling',
    technologies: ['Vite', 'Tailwind CSS'],
    useCase: 'Projects focusing on modern CSS styling'
  },
  hotwired: {
    name: 'Hotwired',
    description: 'Stimulus and Turbo for modern HTML-over-the-wire',
    technologies: ['Vite', 'Stimulus', 'Turbo'],
    useCase: 'Traditional server-side rendering with progressive enhancement'
  },
  'hotwired-tailwind': {
    name: 'Hotwired + Tailwind',
    description: 'Full-featured setup with Hotwired and Tailwind CSS',
    technologies: ['Vite', 'Stimulus', 'Turbo', 'Tailwind CSS'],
    useCase: 'Complete modern web development setup'
  }
};

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
  .option('-t, --template <type>', `template to use (run 'list-templates' for details)
    • minimal: Basic Vite setup (default)
    • tailwind: Vite + Tailwind CSS  
    • hotwired: Vite + Stimulus + Turbo
    • hotwired-tailwind: Full setup`, 'minimal')
  .action((options) => {
    log.title('NestJS MVC Tools Initializer');
    
    // 템플릿 유효성 검사
    const validTemplates = Object.keys(templates);
    const selectedTemplate = options.template;
    
    if (!validTemplates.includes(selectedTemplate)) {
      log.error(`Invalid template: ${colors.bright}${selectedTemplate}${colors.reset}`);
      console.log('');
      log.info('Available templates:');
      
      Object.entries(templates).forEach(([key, template]) => {
        const isDefault = key === 'minimal' ? ' (default)' : '';
        console.log(`  ${colors.cyan}${key}${colors.reset}${colors.dim}${isDefault}${colors.reset}`);
        console.log(`    ${colors.dim}${template.description}${colors.reset}`);
      });
      
      console.log('');
      log.info(`Run ${colors.bright}nestjs-mvc-tools list-templates${colors.reset} for detailed information`);
      process.exit(1);
    }
    
    const templateDir = path.resolve(__dirname, `./templates/${selectedTemplate}`);
    const userProjectRoot = process.cwd();
    const destinationPath = path.join(userProjectRoot, 'resources');

    log.info(`Using template: ${colors.bright}${templates[selectedTemplate].name}${colors.reset}`);
    console.log(`${colors.dim}${templates[selectedTemplate].description}${colors.reset}\n`);

    // resources 폴더가 이미 존재하는지 확인
    if (fs.existsSync(destinationPath)) {
      log.warning('Resources directory already exists!');
      log.info('Skipping template file copying to prevent overwriting existing files.');
      log.info('If you want to reinitialize, please delete the resources directory first.');
      console.log(`\n${colors.bright}${colors.yellow}⚠️  Setup Skipped${colors.reset}`);
      console.log(`${colors.dim}Resources directory already exists at: ${destinationPath}${colors.reset}\n`);
      return;
    }

    log.step(`Copying template files to ${colors.dim}${destinationPath}${colors.reset}...`);

    try {
      fs.copySync(templateDir, destinationPath);
      log.success('Template files copied successfully!');

      // Create .gitignore file
      const gitignoreContent = `node_modules
public/builds`;
      const gitignorePath = path.join(destinationPath, '.gitignore');
      fs.writeFileSync(gitignorePath, gitignoreContent, 'utf8');
      log.step('.gitignore file created successfully');

      log.step(`Installing dependencies in resources directory...`);
      execSync('npm install', { cwd: destinationPath, stdio: 'inherit' });
      log.success('Dependencies installed successfully!');
      
      console.log(`\n${colors.bright}${colors.green}🎉 Setup Complete!${colors.reset}`);
      console.log(`${colors.dim}You can now start building with ${templates[selectedTemplate].name}.${colors.reset}\n`);
      
      // 템플릿별 맞춤 가이드
      log.info('Template-specific information:');
      console.log(`   ${colors.green}Technologies:${colors.reset} ${templates[selectedTemplate].technologies.join(', ')}`);
      console.log(`   ${colors.blue}Description:${colors.reset} ${templates[selectedTemplate].description}`);
      console.log(`   ${colors.magenta}Use Case:${colors.reset} ${templates[selectedTemplate].useCase}\n`);
      
      log.info('Next steps:');
      console.log(`   ${colors.cyan}1.${colors.reset} Start the development server: ${colors.bright}cd resources && npm run dev${colors.reset}`);
      console.log(`   ${colors.cyan}2.${colors.reset} Visit the documentation: ${colors.bright}https://github.com/dev-goraebap/nestjs-mvc-tools${colors.reset}`);
      
      // 템플릿별 추가 팁
      if (selectedTemplate.includes('hotwired')) {
        console.log(`   ${colors.yellow}💡 Hotwired Tip:${colors.reset} Learn more at https://hotwired.dev/`);
      }
      if (selectedTemplate.includes('tailwind')) {
        console.log(`   ${colors.yellow}💡 Tailwind Tip:${colors.reset} Browse components at https://tailwindui.com/`);
      }
      console.log('');

    } catch (err) {
      log.error('Error during initialization:');
      console.error(err);
      process.exit(1);
    }
  });

// list-templates 명령어 추가
program
  .command('list-templates')
  .alias('list')
  .description('List all available templates with descriptions')
  .action(() => {
    log.title('Available Templates');
    
    Object.entries(templates).forEach(([key, template]) => {
      console.log(`${colors.bright}${colors.cyan}${key}${colors.reset}`);
      console.log(`  ${colors.green}Name:${colors.reset} ${template.name}`);
      console.log(`  ${colors.blue}Description:${colors.reset} ${template.description}`);
      console.log(`  ${colors.yellow}Technologies:${colors.reset} ${template.technologies.join(', ')}`);
      console.log(`  ${colors.magenta}Use Case:${colors.reset} ${template.useCase}`);
      console.log('');
    });
    
    console.log(`${colors.dim}Use: ${colors.bright}nestjs-mvc-tools init -t <template-name>${colors.reset}`);
  });

program.parse(process.argv);
