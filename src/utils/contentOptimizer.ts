const formatBulletPoints = (text: string): string => {
  return text
    .replace(/^\s*[-*]\s+/gm, '• ') // Convert both - and * to •
    .replace(/^\s*(\d+\.)\s+/gm, '$1 '); // Preserve numbered lists
};

const formatHeadings = (text: string): string => {
  const lines = text.split('\n');
  let isFirstHeading = true;
  
  const formattedLines = lines.map(line => {
    if (line.trim().toLowerCase().endsWith(':')) {
      const title = line.trim().slice(0, -1);
      // Just capitalize first letter, keep rest as is
      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      
      // Use for main title, for subtopics
      const marker = isFirstHeading ? '' : '';
      isFirstHeading = false;
      
      return `\n${marker} ${formattedTitle}\n`;
    }
    return line;
  });
  return formattedLines.join('\n');
};

const addEmphasis = (text: string): string => {
  return text
    .replace(/`([^`]+)`/g, '「$1」') // Code snippets
    .replace(/\*\*([^*]+)\*\*/g, (_match, p1) => {
      return convertToBold(p1);
    }) // Convert text between ** to Unicode bold characters
    .replace(/_([^_]+)_/g, '$1') // Remove italic markers
    .replace(/\*\*|__/g, '') // Remove any remaining bold/italic markers
    .replace(/\*\*/g, ''); // Additional pass to remove any lingering ** markers
};

const convertToBold = (text: string): string => {
  return text
    .split('')
    .map(char => {
      // Check if the character is a letter
      if (/[a-zA-Z]/.test(char)) {
        // Unicode bold mapping for letters
        const boldMap: {[key: string]: string} = {
          'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 
          'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 
          'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 
          'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 
          'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 
          'z': '𝐳',
          'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 
          'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 
          'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 
          'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 
          'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 
          'Z': '𝐙'
        };
        return boldMap[char] || char;
      }
      return char;
    })
    .join('');
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
  const contentWords = text.toLowerCase().split(/\W+/);
  const specificHashtags = new Set<string>();

  // Check if content is technical
  const isTechnicalContent = contentWords.some(word => 
    ['kernel', 'linux', 'driver', 'memory', 'allocation', 'heap', 
     'performance', 'optimization', 'security', 'vulnerability', 
     'programming', 'code', 'algorithm', 'system', 'tech'].includes(word)
  );

  // Only add hashtags if content is technical
  if (isTechnicalContent) {
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

    const allHashtags = [...specificHashtags].slice(0, 3); // Limit to 3 focused hashtags
    return allHashtags.length > 0 ? `${text}\n\n${allHashtags.join(' ')}` : text;
  }

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
  
  return optimized;
};