#!/bin/bash

# --- Configuration ---
VERSION="1.4.0"

# --- Functions ---
show_help() {
    echo "Usage: ./scripts/setup_structure.sh [options]"
    echo ""
    echo "Populates the current directory with the promptwash architecture and 14-file documentation suite."
    echo ""
    echo "Options:"
    echo "  --help     Show this help message"
    echo "  --version  Show script version"
}

# --- Argument Parsing ---
case "$1" in
    --help)
        show_help
        exit 0
        ;;
    --version)
        echo "promptwash-scaffolder v$VERSION"
        exit 0
        ;;
esac

echo "🛠️  Expanding promptwash structure with full documentation suite..."

# 1. Create Directories
mkdir -p bin docs src/{commands,pipeline,ir,ollama,constraints,config,repo,utils}

# 2. Create Documentation (Now with INDEX.md - 14 files total)
touch docs/{INDEX,README,SCOPE,REQUIREMENTS,ARCHITECTURE,CLI,PROMPT_IR,PHILOSOPHY,CONSTRAINTS,ROADMAP,CONTRIBUTING,DISCLOSURE,CHANGELOG}.md

# 3. Create CLI Entry & Root API
touch bin/promptwash.js
touch src/index.js

# 4. Create Command Handlers
touch src/commands/{parse,render,check,repo,constraints,config}.js

# 5. Create Pipeline Stages
touch src/pipeline/{normalize,clean,lint,analyze,adapt,index}.js

# 6. Create Core Modules
touch src/ir/schema.js
touch src/ollama/client.js
touch src/constraints/loader.js
touch src/config/loader.js
touch src/repo/manager.js

# 7. Create Utilities
touch src/utils/{display,tokens,fingerprint,input,errors}.js

# 8. Set Permissions
chmod +x bin/promptwash.js

echo "✅ Structure and Documentation built successfully in $(pwd)"
echo "📚 14 documentation files generated in ./docs/ (including INDEX.md)"