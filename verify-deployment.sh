#!/bin/bash

echo "================================================"
echo "Manchy Automobile - Deployment Verification"
echo "================================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ ERROR: dist folder not found!"
    echo "   Run 'npm run build' first"
    exit 1
fi

echo "✅ Dist folder found"
echo ""

# Count files
echo "📊 File Statistics:"
echo "   - Total files: $(find dist -type f | wc -l)"
echo "   - HTML pages: $(find dist -maxdepth 1 -name "*.html" | wc -l)"
echo "   - JavaScript files: $(find dist/scripts -name "*.js" 2>/dev/null | wc -l)"
echo "   - CSS files: $(find dist/styles -name "*.css" 2>/dev/null | wc -l)"
echo "   - Images: $(find dist/images -type f 2>/dev/null | wc -l)"
echo ""

# Check for required files
echo "🔍 Checking Required Files:"

required_files=(
    "dist/index.html"
    "dist/cars.html"
    "dist/about.html"
    "dist/staff.html"
    "dist/contact.html"
    "dist/car-details.html"
    "dist/favicon.ico"
    "dist/scripts/config.js"
    "dist/scripts/main.js"
    "dist/scripts/supabase.js"
    "dist/styles/main.css"
    "dist/images/Manchy-Logo2962.PNG"
)

all_good=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ MISSING: $file"
        all_good=false
    fi
done

echo ""

# Check folder structure
echo "📁 Checking Folder Structure:"
required_dirs=(
    "dist/scripts"
    "dist/styles"
    "dist/images"
    "dist/images/car-inventory"
    "dist/images/staff-photos"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✅ $dir"
    else
        echo "   ❌ MISSING: $dir"
        all_good=false
    fi
done

echo ""

# Final result
if [ "$all_good" = true ]; then
    echo "🎉 SUCCESS! All files present and ready for deployment"
    echo ""
    echo "📤 Next Steps:"
    echo "   1. Upload contents of 'dist' folder to your web server"
    echo "   2. Ensure file permissions are correct (644 for files, 755 for folders)"
    echo "   3. Test your website in a browser"
    echo "   4. Check browser console for any errors (F12 → Console)"
    echo ""
    exit 0
else
    echo "❌ ISSUES FOUND! Please run 'npm run build' again"
    exit 1
fi
