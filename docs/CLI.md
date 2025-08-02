# CLI Commands Guide

## `nestjs-mvc-tools init`

Creates MVC templates and resource structure in your project. You can select only the libraries you need through template options.

```bash
# Basic usage (minimal template - Vite only)
nestjs-mvc-tools init

# Template selection
nestjs-mvc-tools init --template=minimal           # Vite only (default)
nestjs-mvc-tools init --template=tailwind          # TailwindCSS only  
nestjs-mvc-tools init --template=hotwired          # Hotwired only
nestjs-mvc-tools init --template=hotwired-tailwind # Hotwired + TailwindCSS

# Using short options
nestjs-mvc-tools init -t minimal
```

## Available Templates

- `minimal`: Basic configuration with Vite only (default)
- `tailwind`: TailwindCSS + Vite configuration  
- `hotwired`: Hotwired (Turbo + Stimulus) + Vite configuration
- `hotwired-tailwind`: Complete configuration with TailwindCSS + Hotwired + Vite

## Generated Structure

Different structures are generated based on the selected template.

```
resources/
├── package.json        # Template-specific dependencies
├── vite.config.js      # Vite configuration (template-specific plugins)
├── src/
│   ├── app.js         # Frontend entry (template-specific imports)
│   ├── style.css      # Styles (minimal, hotwired)
│   └── controllers/   # Stimulus controllers (hotwired, hotwired-tailwind only)
├── views/
│   ├── components/    # Reusable components
│   └── pages/         # Page templates
└── public/
    └── builds/        # Built assets
```

## Template Differences

### minimal
- Basic CSS, Vite only
- Simplest setup to start a project
- Pure HTML/CSS/JS development without additional libraries

### tailwind
- TailwindCSS import, Tailwind plugin included
- Utility-first CSS framework
- Fast styling with consistent design system

### hotwired
- Hotwired import, Stimulus controller folder included
- HTML-over-the-wire approach
- SPA-like user experience with server-side rendering

### hotwired-tailwind
- All features including TailwindCSS + Hotwired
- Complete modern web development environment
- Both design system and interactive features

## Template Package Dependencies

### minimal
```json
{
  "dependencies": {},
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

### tailwind
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.10",
    "tailwindcss": "^4.1.10"
  },
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

### hotwired
```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "@hotwired/turbo": "^8.0.13"
  },
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

### hotwired-tailwind
```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "@hotwired/turbo": "^8.0.13",
    "@tailwindcss/vite": "^4.1.10",
    "tailwindcss": "^4.1.10"
  },
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

## Additional CLI Commands

### `nestjs-mvc-tools list-templates`

View all available templates with detailed information.

```bash
# List templates
nestjs-mvc-tools list-templates

# Or use short command
nestjs-mvc-tools list
```

This command displays each template's name, description, included technologies, and use cases in a colorful format.

## Notes

- Creates a resources directory in the project root and downloads necessary dependencies based on the selected template
- Won't overwrite existing files if resources folder already exists
- Delete the resources directory first if you want to reinitialize
- A `.gitignore` file is automatically created after template initialization to exclude `node_modules` and `public/builds` directories