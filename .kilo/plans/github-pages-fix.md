# Fix Plan: GitHub Pages Deployment Issues

## Problem Summary
The site works locally in dev and prod but fails on GitHub Pages with:
1. `__data.json` 404 error - File exists in build but not being served correctly
2. SES Removing unpermitted intrinsics warning (from svelte-pdf dependency)
3. Permission Policy header error (browser warning, not critical)
4. Asynchronous response error (likely consequence of failed data loading)

## Root Cause Analysis

### Primary Issue: __data.json 404 on GitHub Pages
Despite `__data.json` existing in the build directory, GitHub Pages is returning 404. This suggests:
1. The static adapter is not generating the file in the expected location
2. There might be an issue with how the base path is handled in GitHub Pages
3. The file might be getting filtered out by GitHub Pages processing

### Secondary Issues:
1. **SES Warning**: Comes from svelte-pdf dependency using PDF.js with SES sandboxing
2. **Permissions-Policy**: Browser warning about unrecognized feature, not breaking functionality
3. **Async Response Error**: Consequence of failed data loading from __data.json 404

## Evidence from Build
- Build directory contains `__data.json` file (2585 bytes)
- `_app` directory exists with client and server assets
- Individual project directories exist (AIME, FOBS, REM, etc.)
- Base path configuration in svelte.config.js: `base: dev ? '' : '/glean'`

## Fix Strategy

### Phase 1: Fix GitHub Pages __data.json Issue (Critical)
1. **Verify Static Adapter Output**: Check if __data.json is in correct location for GitHub Pages
2. **Check .nojekyll File**: Ensure it's present to prevent GitHub Pages from processing files incorrectly
3. **Verify Base Path Handling**: Ensure paths are correctly resolved with /glean base
4. **Check GitHub Actions Build Process**: Ensure build artifacts are correctly uploaded

### Phase 2: Address Secondary Issues (Medium/Low Priority)
1. **SES Warning**: Investigate if svelte-pdf can be updated or if warning can be suppressed
2. **Permissions-Policy**: Browser warning, can be ignored for functionality
3. **Async Error**: Will resolve when __data.json issue is fixed

## Implementation Steps

### Immediate Actions:
1. Check if __data.json is accessible via GitHub Pages at the expected URL
2. Verify the static adapter configuration for GitHub Pages compatibility
3. Ensure build process correctly outputs to the build directory

### Verification:
1. Build locally and inspect the exact structure
2. Test that __data.json is at the expected path for base=/glean
3. Deploy test version to verify fix

## Risk Assessment
- **Low Risk**: Checking build output and static adapter config
- **Medium Risk**: Changing build/deployment configuration
- **High Risk**: Altering core routing or data loading mechanisms