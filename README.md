# LinkedIn Post Formatter 📝

<div align="center">

![LinkedIn Post Formatter](https://raw.githubusercontent.com/firmwarezhu/linkedinformat/main/public/demo.gif)

[![GitHub Stars](https://img.shields.io/github/stars/firmwarezhu/linkedinformat?style=social)](https://github.com/firmwarezhu/linkedinformat/stargazers)
[![GitHub License](https://img.shields.io/github/license/firmwarezhu/linkedinformat)](https://github.com/firmwarezhu/linkedinformat/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/firmwarezhu/linkedinformat)](https://github.com/firmwarezhu/linkedinformat/issues)
[![Deploy Status](https://github.com/firmwarezhu/linkedinformat/actions/workflows/deploy.yml/badge.svg)](https://github.com/firmwarezhu/linkedinformat/actions)

*Transform your technical content into engaging LinkedIn posts with beautiful formatting and smart hashtags.*

[Demo](https://firmwarezhu.github.io/linkedinformat/) · [Report Bug](https://github.com/firmwarezhu/linkedinformat/issues) · [Request Feature](https://github.com/firmwarezhu/linkedinformat/issues)

</div>

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys to `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_XAI_API_KEY=your_xai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Features

- 💫 Real-time content formatting
- 📝 Technical content optimization
- 🔷 Smart heading formatting with emojis
- 🔄 Undo functionality
- 💾 Auto-save support
- 📊 Character and word count
- 📱 Responsive design

## Live Demo

Try it out: [LinkedIn Post Formatter](https://firmwarezhu.github.io/linkedinformat/)

## Tutorial: Building Your Own LinkedIn Post Formatter

### Step 1: Project Setup

1. Create a new Vite project with React and TypeScript:
```bash
npm create vite@latest linkedinformat -- --template react-ts
cd linkedinformat
npm install
```

2. Install required dependencies:
```bash
npm install @tailwindcss/typography lucide-react @radix-ui/react-slot clsx tailwind-merge
```

3. Set up Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Project Structure

Create the following directory structure:
```
src/
├── components/
│   ├── ContentFormatter.tsx    # Main formatter component
│   └── ui/                     # Reusable UI components
├── utils/
│   └── contentOptimizer.ts     # Formatting logic
├── main.tsx
└── App.tsx
```

### Step 3: Implementing Core Features

1. Content Formatting (contentOptimizer.ts):
```typescript
// Format headings with emojis
const formatHeadings = (text: string): string => {
  const lines = text.split('\n');
  let isFirstHeading = true;
  
  const formattedLines = lines.map(line => {
    if (line.trim().toLowerCase().endsWith(':')) {
      const title = line.trim().slice(0, -1);
      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      const marker = isFirstHeading ? '💡' : '🔷';
      isFirstHeading = false;
      return `\n${marker} ${formattedTitle}\n`;
    }
    return line;
  });
  return formattedLines.join('\n');
};
```

2. Main Component Structure (ContentFormatter.tsx):
```typescript
const ContentFormatter = () => {
  const [input, setInput] = useState('');
  const [formattedContent, setFormattedContent] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setFormattedContent(formatContent(newInput));
  };

  return (
    <div className="flex gap-4">
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Paste your content here..."
      />
      <div className="formatted-output">
        {formattedContent}
      </div>
    </div>
  );
};
```

### Step 4: Deployment to GitHub Pages

1. Create a GitHub repository and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. Configure Vite for GitHub Pages (vite.config.ts):
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
});
```

3. Create GitHub Actions workflow (.github/workflows/deploy.yml):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm install
      - run: npm run build
      - uses: actions/configure-pages@v3
      - uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v2
```

4. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Set source to "GitHub Actions"

### Step 5: Customization

1. Formatting Rules:
   - Main titles use 💡
   - Subtopics use 🔷
   - Bullet points use •
   - Add relevant hashtags at the bottom

2. Styling:
   - Use Tailwind CSS for responsive design
   - Add dark/light mode support
   - Implement copy-to-clipboard functionality

## Security

- API keys are stored in environment variables
- Environment files (`.env`) are not committed to the repository
- Use `.env.example` as a template for required environment variables

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd linkedinformat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
