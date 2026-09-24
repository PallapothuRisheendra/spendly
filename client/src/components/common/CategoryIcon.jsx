import React from 'react';
import * as LucideIcons from 'lucide-react';

export const CategoryIcon = ({ name, size = 20, className = '' }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.Folder;
  return <IconComponent size={size} className={className} />;
};
