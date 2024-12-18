import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const tips = [
  {
    category: 'Text Formatting',
    items: [
      { icon: '📝', text: 'Use bullet points (•) for clear list formatting' },
      { icon: '🔤', text: 'Use **bold** for emphasis on key points' },
      { icon: '📏', text: 'Keep paragraphs short and scannable' },
      { icon: '💭', text: 'Add line breaks between sections for better readability' }
    ]
  },
  {
    category: 'Visual Enhancement',
    items: [
      { icon: '💫', text: 'Use relevant emojis to make content engaging' },
      { icon: '🎯', text: 'Start sections with distinctive icons' },
      { icon: '📌', text: 'Use brackets【】for highlighting technical terms' },
      { icon: '🔍', text: 'Ensure consistent spacing throughout the post' }
    ]
  },
  {
    category: 'Engagement Optimization',
    items: [
      { icon: '#️⃣', text: 'Include 3-5 relevant hashtags at the end' },
      { icon: '💡', text: 'Start with a compelling hook or question' },
      { icon: '🎬', text: 'End with a clear call-to-action' },
      { icon: '🔄', text: 'Break long posts into a series for better engagement' }
    ]
  }
];

interface TipCategoryProps {
  category: string;
  items: { icon: string; text: string; }[];
  isOpen: boolean;
  onToggle: () => void;
}

function TipCategory({ category, items, isOpen, onToggle }: TipCategoryProps) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left font-semibold text-gray-700 hover:text-blue-600 transition-colors"
      >
        {category}
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <ul className="mt-3 space-y-3">
          {items.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-xl">{tip.icon}</span>
              <span className="text-gray-600">{tip.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Tips() {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
    'Text Formatting': true,
    'Visual Enhancement': false,
    'Engagement Optimization': false,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        LinkedIn Post Optimization Guide
      </h3>
      <div className="space-y-3">
        {tips.map((category) => (
          <TipCategory
            key={category.category}
            category={category.category}
            items={category.items}
            isOpen={openCategories[category.category]}
            onToggle={() => toggleCategory(category.category)}
          />
        ))}
      </div>
    </div>
  );
}