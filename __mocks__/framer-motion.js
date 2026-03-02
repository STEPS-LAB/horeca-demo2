// Global framer-motion mock for Jest
const React = require('react');

const createMotionComponent = (tag) => {
  const MotionComponent = React.forwardRef(
    (
      {
        children,
        animate,
        initial,
        exit,
        variants,
        whileHover,
        whileTap,
        whileInView,
        viewport,
        transition,
        layout,
        layoutId,
        onHoverStart,
        onHoverEnd,
        onAnimationComplete,
        style,
        custom,
        ...props
      },
      ref
    ) =>
      React.createElement(tag, { ref, style, ...props }, children)
  );
  MotionComponent.displayName = `motion.${tag}`;
  return MotionComponent;
};

const tags = [
  'a', 'article', 'aside', 'blockquote', 'button', 'div', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'img', 'input', 'label',
  'li', 'main', 'nav', 'ol', 'p', 'section', 'span', 'svg', 'ul',
];

const motion = tags.reduce((acc, tag) => {
  acc[tag] = createMotionComponent(tag);
  return acc;
}, {});

const AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children);
AnimatePresence.displayName = 'AnimatePresence';

const useScroll = () => ({
  scrollY: { get: () => 0, onChange: () => () => {} },
  scrollYProgress: { get: () => 0, onChange: () => () => {} },
});

const useTransform = (value, inputRange, outputRange) => ({
  get: () => outputRange[0],
  onChange: () => () => {},
});

const useMotionValue = (initial) => ({
  get: () => initial,
  set: () => {},
  onChange: () => () => {},
});

const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {},
});

const useInView = () => [React.createRef(), false];

module.exports = {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimation,
  useInView,
};
