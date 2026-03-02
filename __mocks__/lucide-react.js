// Mock all lucide-react icons as simple SVG components for Jest
const React = require('react');

const createIcon = (name) => {
  const Icon = ({ size = 24, className, strokeWidth, ...props }) =>
    React.createElement('svg', {
      'data-testid': `icon-${name.toLowerCase()}`,
      width: size,
      height: size,
      className,
      strokeWidth,
      ...props,
    });
  Icon.displayName = name;
  return Icon;
};

// Export all commonly-used icons used in the project
module.exports = {
  ArrowRight: createIcon('ArrowRight'),
  ArrowLeft: createIcon('ArrowLeft'),
  BedDouble: createIcon('BedDouble'),
  Calendar: createIcon('Calendar'),
  Car: createIcon('Car'),
  Check: createIcon('Check'),
  ChevronDown: createIcon('ChevronDown'),
  ChevronLeft: createIcon('ChevronLeft'),
  ChevronRight: createIcon('ChevronRight'),
  Clock: createIcon('Clock'),
  CreditCard: createIcon('CreditCard'),
  Dumbbell: createIcon('Dumbbell'),
  Eye: createIcon('Eye'),
  Facebook: createIcon('Facebook'),
  Home: createIcon('Home'),
  Info: createIcon('Info'),
  Instagram: createIcon('Instagram'),
  Lock: createIcon('Lock'),
  Mail: createIcon('Mail'),
  MapPin: createIcon('MapPin'),
  Maximize2: createIcon('Maximize2'),
  Menu: createIcon('Menu'),
  Phone: createIcon('Phone'),
  Printer: createIcon('Printer'),
  Quote: createIcon('Quote'),
  Send: createIcon('Send'),
  SlidersHorizontal: createIcon('SlidersHorizontal'),
  Sparkles: createIcon('Sparkles'),
  Star: createIcon('Star'),
  TreePine: createIcon('TreePine'),
  Twitter: createIcon('Twitter'),
  Users: createIcon('Users'),
  UtensilsCrossed: createIcon('UtensilsCrossed'),
  Waves: createIcon('Waves'),
  Wifi: createIcon('Wifi'),
  Wine: createIcon('Wine'),
  X: createIcon('X'),
};
