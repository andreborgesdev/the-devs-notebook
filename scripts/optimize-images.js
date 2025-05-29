#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const OPTIMIZED_DIR = path.join(IMAGES_DIR, 'optimized');

// Ensure optimized directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Check if sharp is available
function isSharpAvailable() {
  try {
    require.resolve('sharp');
    return true;
  } catch {
    console.log('Sharp not found. Install with: npm install sharp --save-dev');
    return false;
  }
}

// Get all image files
function getImageFiles() {
  const files = fs.readdirSync(IMAGES_DIR);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });
}

// Optimize images using sharp (if available)
async function optimizeWithSharp() {
  const sharp = require('sharp');
  const imageFiles = getImageFiles();
  
  console.log(`Found ${imageFiles.length} images to optimize...`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const baseName = path.parse(file).name;
    
    try {
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`Processing ${file} (${metadata.width}x${metadata.height})`);
      
      // Generate WebP version
      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(path.join(OPTIMIZED_DIR, `${baseName}.webp`));
      
      // Generate AVIF version (more aggressive compression)
      await sharp(inputPath)
        .avif({ quality: 60, effort: 9 })
        .toFile(path.join(OPTIMIZED_DIR, `${baseName}.avif`));
      
      // Generate optimized original format
      const originalExt = path.extname(file).toLowerCase();
      if (originalExt === '.png') {
        await sharp(inputPath)
          .png({ quality: 90, compressionLevel: 9 })
          .toFile(path.join(OPTIMIZED_DIR, file));
      } else if (['.jpg', '.jpeg'].includes(originalExt)) {
        await sharp(inputPath)
          .jpeg({ quality: 85, progressive: true })
          .toFile(path.join(OPTIMIZED_DIR, file));
      }
      
      // Generate responsive sizes for large images
      if (metadata.width && metadata.width > 800) {
        const sizes = [400, 800, 1200];
        
        for (const size of sizes) {
          if (size < metadata.width) {
            // WebP responsive
            await sharp(inputPath)
              .resize(size, null, { withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(path.join(OPTIMIZED_DIR, `${baseName}-${size}w.webp`));
            
            // AVIF responsive
            await sharp(inputPath)
              .resize(size, null, { withoutEnlargement: true })
              .avif({ quality: 60 })
              .toFile(path.join(OPTIMIZED_DIR, `${baseName}-${size}w.avif`));
          }
        }
      }
      
      console.log(`✓ Optimized ${file}`);
    } catch (error) {
      console.error(`✗ Failed to optimize ${file}:`, error.message);
    }
  }
  
  console.log('Image optimization complete!');
}

// Fallback: Use imagemin if sharp is not available
async function optimizeWithImagemin() {
  try {
    const imagemin = require('imagemin');
    const imageminJpegtran = require('imagemin-jpegtran');
    const imageminPngquant = require('imagemin-pngquant');
    const imageminWebp = require('imagemin-webp');
    
    console.log('Using imagemin for optimization...');
    
    await imagemin([path.join(IMAGES_DIR, '*.{jpg,png}')], {
      destination: OPTIMIZED_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminWebp({ quality: 80 })
      ]
    });
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Imagemin optimization failed:', error.message);
    console.log('Install imagemin: npm install imagemin imagemin-jpegtran imagemin-pngquant imagemin-webp --save-dev');
  }
}

// Generate image manifest
function generateImageManifest() {
  const manifest = {
    images: {},
    generated: new Date().toISOString()
  };
  
  const imageFiles = getImageFiles();
  
  imageFiles.forEach(file => {
    const baseName = path.parse(file).name;
    const originalPath = `/images/${file}`;
    
    manifest.images[originalPath] = {
      original: originalPath,
      webp: `/images/optimized/${baseName}.webp`,
      avif: `/images/optimized/${baseName}.avif`,
      sizes: []
    };
    
    // Check for responsive sizes
    const responsiveSizes = [400, 800, 1200];
    responsiveSizes.forEach(size => {
      const webpPath = path.join(OPTIMIZED_DIR, `${baseName}-${size}w.webp`);
      const avifPath = path.join(OPTIMIZED_DIR, `${baseName}-${size}w.avif`);
      
      if (fs.existsSync(webpPath)) {
        manifest.images[originalPath].sizes.push({
          width: size,
          webp: `/images/optimized/${baseName}-${size}w.webp`,
          avif: `/images/optimized/${baseName}-${size}w.avif`
        });
      }
    });
  });
  
  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'lib', 'image-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('Generated image manifest');
}

// Main execution
async function main() {
  console.log('Starting image optimization...');
  
  if (isSharpAvailable()) {
    await optimizeWithSharp();
  } else {
    await optimizeWithImagemin();
  }
  
  generateImageManifest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  optimizeWithSharp,
  optimizeWithImagemin,
  generateImageManifest
};
