import { build } from 'bun';

console.log('🔨 Building for production...');

const result = await build({
    entrypoints: ['./index.ts'],
    outdir: './dist',
    target: 'bun',
    minify: true,
    sourcemap: 'external',
});

if (result.success) {
    console.log('✅ Build completed successfully!');
    console.log('📦 Output directory: ./dist');
} else {
    console.error('❌ Build failed!');
    process.exit(1);
}
