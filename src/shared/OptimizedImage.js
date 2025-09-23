import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * A reusable optimized image component that implements lazy loading and blur effect
 * @param {Object} props
 * @param {string} props.src - Source URL of the image
 * @param {string} props.alt - Alt text for the image
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.width] - Width of the image
 * @param {Object} [props.style] - Additional inline styles
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width = '100%',
  style = {},
}) => {
  // Base64 encoded 3:4 aspect ratio SVG placeholder
  const placeholderSrc =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDQiPjwvc3ZnPg==';

  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="blur"
      className={className}
      width={width}
      style={style}
      placeholderSrc={placeholderSrc}
      wrapperProps={{
        style: {
          display: 'block', // Prevents unwanted spacing
        },
      }}
    />
  );
};

export default OptimizedImage;
