import React from 'react';
import { t } from '../translations/helper';

interface RichTextToolbarProps {
  onFormat: (format: string) => void;
  disabled?: boolean;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ onFormat, disabled = false }) => {
  const formatButtons = [
    { format: 'bold', label: 'B', title: t('Bold (Ctrl+B)'), style: { fontWeight: 'bold' } },
    { format: 'italic', label: 'I', title: t('Italic (Ctrl+I)'), style: { fontStyle: 'italic' } },
    { format: 'strikethrough', label: 'S', title: t('Strikethrough'), style: { textDecoration: 'line-through' } },
    { format: 'code', label: '</>', title: t('Inline Code'), style: { fontFamily: 'monospace' } },
    { format: 'link', label: '🔗', title: t('Insert Link'), style: {} },
    { format: 'heading1', label: 'H1', title: t('Heading 1'), style: { fontSize: '1.2em', fontWeight: 'bold' } },
    { format: 'heading2', label: 'H2', title: t('Heading 2'), style: { fontSize: '1.1em', fontWeight: 'bold' } },
    { format: 'heading3', label: 'H3', title: t('Heading 3'), style: { fontSize: '1em', fontWeight: 'bold' } },
    { format: 'bulletList', label: '•', title: t('Bullet List'), style: { fontSize: '1.5em' } },
    { format: 'numberList', label: '1.', title: t('Numbered List'), style: {} },
    { format: 'quote', label: '"', title: t('Block Quote'), style: { fontSize: '1.3em' } },
    { format: 'codeBlock', label: '{}', title: t('Code Block'), style: { fontFamily: 'monospace' } },
  ];

  const handleButtonClick = (format: string) => {
    if (!disabled) {
      onFormat(format);
    }
  };

  return (
    <div className="rich-text-toolbar">
      {formatButtons.map((button) => (
        <button
          key={button.format}
          className="toolbar-btn"
          onClick={() => handleButtonClick(button.format)}
          title={button.title}
          disabled={disabled}
          style={button.style}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default RichTextToolbar;
