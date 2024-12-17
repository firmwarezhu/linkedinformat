const formatBulletPoints = (text: string): string => {
  return text
    .replace(/^\s*[-*]\s+/gm, '• ') // Convert both - and * to •
    .replace(/^\s*(\d+\.)\s+/gm, '$1 '); // Preserve numbered lists
};

const formatHeadings = (text: string): string => {
  const lines = text.split('\n');
  const formattedLines = lines.map(line => {
    if (line.trim().toLowerCase().endsWith(':')) {
      const title = line.trim().slice(0, -1);
      const titleCase = title
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // For technical posts, use a simple diamond marker
      return `\n💠 ${titleCase}\n`;
    }
    return line;
  });
  return formattedLines.join('\n');
};

const addEmphasis = (text: string): string => {
  return text
    .replace(/`([^`]+)`/g, '「$1」') // Code snippets
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers
    .replace(/_([^_]+)_/g, '$1'); // Remove italic markers
};

const addSpacing = (text: string): string => {
  return text
    .split('\n')
    .map(line => {
      if (line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
        return `\n${line.trim()}`; // Add space before lists, keep them aligned
      }
      return line.trim(); // Remove extra spaces
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') // Max 2 line breaks
    .trim();
};

const addHashtags = (text: string): string => {
  // Technical-focused hashtags
  const techHashtags = [
    '#Linux',
    '#KernelDev',
    '#SystemProgramming',
    '#TechDetails'
  ];

  const contentWords = text.toLowerCase().split(/\W+/);
  const specificHashtags = new Set<string>();

  // Add specific technical hashtags based on content
  if (contentWords.some(word => ['kernel', 'linux', 'driver'].includes(word))) {
    specificHashtags.add('#LinuxKernel');
  }
  if (contentWords.some(word => ['memory', 'allocation', 'heap'].includes(word))) {
    specificHashtags.add('#SystemDesign');
  }
  if (contentWords.some(word => ['performance', 'optimization'].includes(word))) {
    specificHashtags.add('#Performance');
  }
  if (contentWords.some(word => ['security', 'vulnerability'].includes(word))) {
    specificHashtags.add('#Security');
  }

  const allHashtags = [...techHashtags, ...specificHashtags].slice(0, 3); // Limit to 3 focused hashtags
  return `${text}\n\n${allHashtags.join(' ')}`;
};

const addIntro = (text: string): string => {
  // For technical posts, no fancy intros needed
  return text;
};

export const optimizeContent = (content: string): string => {
  if (!content) return '';
  
  let optimized = content;
  optimized = formatBulletPoints(optimized);
  optimized = formatHeadings(optimized);
  optimized = addEmphasis(optimized);
  optimized = addSpacing(optimized);
  optimized = addHashtags(optimized);
  // Skip intro for technical posts
  
  return optimized;
};