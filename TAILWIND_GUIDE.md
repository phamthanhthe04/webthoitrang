# Hướng dẫn sử dụng Tailwind CSS cho Fashion Store

## 📖 Tổng quan

Dự án đã được chuyển đổi hoàn toàn sang **Tailwind CSS** - một utility-first CSS framework giúp phát triển giao diện nhanh chóng và nhất quán.

## 🎨 Design System

### Màu sắc chính

```javascript
// Primary Colors (Blue)
bg - primary - 50; // #eff6ff - Very light blue
bg - primary - 500; // #3b82f6 - Main brand color
bg - primary - 600; // #2563eb - Hover state
bg - primary - 700; // #1d4ed8 - Active state

// Secondary Colors (Gray)
bg - secondary - 500; // #6b7280 - Medium gray
text - gray - 600; // #4b5563 - Text color
text - gray - 900; // #111827 - Dark text

// Fashion Colors
bg - fashion - pink; // #ff6b9d - Pink accent
bg - fashion - gold; // #f59e0b - Gold accent
```

### Typography

```html
<!-- Headings -->
<h1 class="text-3xl font-bold">Main Title</h1>
<h2 class="text-2xl font-semibold">Section Title</h2>
<h3 class="text-xl font-medium">Subsection</h3>

<!-- Body Text -->
<p class="text-base leading-relaxed">Normal text</p>
<p class="text-sm text-gray-600">Caption text</p>
```

## 🧩 Custom Components

### Button Components

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Outline Button -->
<button class="btn btn-outline">Outline Button</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">Ghost Button</button>

<!-- Size Variations -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Card Components

```html
<!-- Product Card -->
<div class="product-card">
  <img src="..." class="product-card-image" />
  <div class="product-card-body">
    <h3 class="product-card-title">Product Name</h3>
    <div class="product-card-price">299,000 đ</div>
  </div>
</div>

<!-- General Card -->
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Form Components

```html
<!-- Form Group -->
<div class="form-group">
  <label class="form-label">Label Text</label>
  <input type="text" class="form-input" placeholder="Enter text" />
  <div class="form-error">Error message</div>
</div>

<!-- Select -->
<select class="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea class="form-textarea" rows="4"></textarea>
```

### Container Components

```html
<!-- Main Container -->
<div class="container">Content</div>

<!-- Small Container -->
<div class="container-sm">Content</div>

<!-- Extra Small Container -->
<div class="container-xs">Content</div>
```

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Responsive Examples

```html
<!-- Responsive Grid -->
<div
  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
>
  <!-- Items -->
</div>

<!-- Responsive Text -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">Responsive Title</h1>

<!-- Responsive Padding -->
<div class="p-4 md:p-6 lg:p-8">Content</div>

<!-- Hide/Show on Different Screens -->
<div class="hidden md:block">Visible on medium+ screens</div>
<div class="block md:hidden">Visible on small screens only</div>
```

## 🎯 Common Patterns

### Loading States

```html
<!-- Spinner -->
<div class="flex items-center justify-center">
  <div class="loading-spinner"></div>
  <span class="ml-2">Loading...</span>
</div>

<!-- Skeleton -->
<div class="skeleton h-4 w-full mb-2"></div>
<div class="skeleton h-4 w-3/4 mb-2"></div>
<div class="skeleton h-4 w-1/2"></div>
```

### Error States

```html
<div class="text-center py-8">
  <div class="text-red-500 text-6xl mb-4">❌</div>
  <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Title</h3>
  <p class="text-gray-600 mb-4">Error message</p>
  <button class="btn btn-primary">Try Again</button>
</div>
```

### Empty States

```html
<div class="text-center py-12">
  <div class="text-gray-300 text-8xl mb-6">
    <i class="fas fa-shopping-cart"></i>
  </div>
  <h3 class="text-2xl font-bold text-gray-900 mb-4">No Items Found</h3>
  <p class="text-gray-600 mb-8">Description</p>
  <button class="btn btn-primary">Call to Action</button>
</div>
```

## 🔧 Utility Classes

### Custom Utilities

```html
<!-- Text Utilities -->
<p class="text-balance">Balanced text wrapping</p>
<p class="truncate-2">Text truncated to 2 lines</p>
<p class="truncate-3">Text truncated to 3 lines</p>
<p class="line-clamp-2">Line clamped to 2 lines</p>

<!-- Background Effects -->
<div class="glass">Glass morphism effect</div>
<div class="gradient-bg">Gradient background</div>
<p class="gradient-text">Gradient text</p>

<!-- Animations -->
<div class="skeleton">Skeleton loading animation</div>
```

### Spacing Scale

```html
<!-- Padding/Margin Scale -->
p-1 = 4px p-4 = 16px p-8 = 32px p-2 = 8px p-5 = 20px p-10 = 40px p-3 = 12px p-6
= 24px p-12 = 48px
```

## 🚀 Best Practices

### 1. Component Structure

```html
<!-- Good: Organized classes -->
<div
  class="
  flex items-center justify-between
  bg-white rounded-lg shadow-lg
  p-6 mb-4
  hover:shadow-xl transition-shadow
"
>
  Content
</div>

<!-- Avoid: Too many classes inline -->
<div
  class="flex items-center justify-between bg-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow border border-gray-200 max-w-md mx-auto"
></div>
```

### 2. Use Custom Components

```html
<!-- Good: Use custom component classes -->
<button class="btn btn-primary">Click me</button>

<!-- Avoid: Repeating utility classes -->
<button
  class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500"
></button>
```

### 3. Responsive First

```html
<!-- Good: Mobile first approach -->
<div class="text-sm md:text-base lg:text-lg">Responsive text</div>

<!-- Good: Progressive enhancement -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">Grid items</div>
```

### 4. Semantic Color Usage

```html
<!-- Good: Semantic colors -->
<div class="text-red-600">Error message</div>
<div class="text-green-600">Success message</div>
<div class="text-blue-600">Info message</div>
<div class="text-yellow-600">Warning message</div>
```

## 📂 File Organization

### Component Files

```javascript
// Good: Clean component without CSS imports
import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium' }) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`}>{children}</button>
  );
};
```

### CSS Structure

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  /* ... */
}

/* Custom components */
@layer components {
  /* ... */
}

/* Custom utilities */
@layer utilities {
  /* ... */
}
```

## 🛠️ Development Tools

### VS Code Extensions

- **Tailwind CSS IntelliSense**: Auto-completion and syntax highlighting
- **Headwind**: Automatic class sorting
- **Tailwind Docs**: Quick access to documentation

### Class Sorting

```html
<!-- Recommended order -->
<div
  class="
  flex items-center          <!-- Layout -->
  w-full h-32               <!-- Sizing -->
  bg-white border-gray-200  <!-- Colors -->
  rounded-lg shadow-lg      <!-- Effects -->
  p-4 m-2                   <!-- Spacing -->
  hover:shadow-xl           <!-- Interactions -->
  transition-shadow         <!-- Animations -->
"
></div>
```

## 🔍 Debugging Tips

### 1. Visual Debugging

```html
<!-- Add colored borders to see layout -->
<div class="border-2 border-red-500">Debug container</div>
<div class="bg-red-100">Debug background</div>
```

### 2. Responsive Testing

```html
<!-- Show current breakpoint in development -->
<div class="fixed top-0 right-0 bg-black text-white p-2 z-50">
  <span class="sm:hidden">XS</span>
  <span class="hidden sm:inline md:hidden">SM</span>
  <span class="hidden md:inline lg:hidden">MD</span>
  <span class="hidden lg:inline xl:hidden">LG</span>
  <span class="hidden xl:inline">XL</span>
</div>
```

## 📈 Performance Tips

### 1. Purge Unused CSS

```javascript
// tailwind.config.js - Already configured
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // ...
};
```

### 2. Use JIT Mode

```javascript
// tailwind.config.js - Already enabled
module.exports = {
  mode: 'jit',
  // ...
};
```

### 3. Optimize for Production

```bash
# Build production bundle
npm run build
```

---

## 📞 Support

Nếu có thắc mắc về Tailwind CSS hoặc cần hỗ trợ, vui lòng:

1. Tham khảo [Tailwind CSS Documentation](https://tailwindcss.com/docs)
2. Kiểm tra file `TailwindExamples.js` để xem ví dụ cụ thể
3. Liên hệ team lead để được hỗ trợ

**Happy coding with Tailwind CSS! 🎉**
